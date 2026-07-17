package fr.servicepedagogique.backend.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.servicepedagogique.backend.bo.Cours;
import fr.servicepedagogique.backend.dal.CoursRepository;
import fr.servicepedagogique.backend.dto.cours.CreerCoursRequest;
import fr.servicepedagogique.backend.dto.cours.ModifierCoursRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CoursControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CoursRepository coursRepository;

    @Test
    @WithAnonymousUser
    void lister_estRefuseSansAuthentification() throws Exception {
        mockMvc.perform(get("/api/cours"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ROLE_ELEVE")
    void lister_estAutoriseAUnUtilisateurNonReferente() throws Exception {
        coursRepository.save(new Cours("JAVA101", "Introduction à Java"));

        mockMvc.perform(get("/api/cours"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].code").value("JAVA101"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void lister_renvoieLesCoursExistantsAUnReferente() throws Exception {
        coursRepository.save(new Cours("JAVA101", "Introduction à Java"));

        mockMvc.perform(get("/api/cours"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].code").value("JAVA101"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void creer_renvoie201EtPersisteLeCoursQuandLesDonneesSontValides() throws Exception {
        CreerCoursRequest request = new CreerCoursRequest("JAVA101", "Introduction à Java");

        mockMvc.perform(post("/api/cours")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idCours").exists())
                .andExpect(jsonPath("$.code").value("JAVA101"))
                .andExpect(jsonPath("$.titre").value("Introduction à Java"));

        assertThatCoursExiste("JAVA101");
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void creer_renvoie400QuandLeCodeEstManquant() throws Exception {
        CreerCoursRequest request = new CreerCoursRequest(" ", "Introduction à Java");

        mockMvc.perform(post("/api/cours")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void creer_renvoie409QuandLeCodeExisteDeja() throws Exception {
        coursRepository.save(new Cours("JAVA101", "Introduction à Java"));
        CreerCoursRequest request = new CreerCoursRequest("JAVA101", "Autre titre");

        mockMvc.perform(post("/api/cours")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(authorities = "ROLE_FORMATEUR")
    void creer_estRefuseAUnUtilisateurNonReferente() throws Exception {
        CreerCoursRequest request = new CreerCoursRequest("JAVA101", "Introduction à Java");

        mockMvc.perform(post("/api/cours")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void modifier_metAJourLeCoursExistant() throws Exception {
        Cours cours = coursRepository.save(new Cours("JAVA101", "Introduction à Java"));
        ModifierCoursRequest request = new ModifierCoursRequest(null, "Java pour débutants");

        mockMvc.perform(put("/api/cours/{id}", cours.getIdCours())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("JAVA101"))
                .andExpect(jsonPath("$.titre").value("Java pour débutants"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void modifier_renvoie404QuandLeCoursEstIntrouvable() throws Exception {
        ModifierCoursRequest request = new ModifierCoursRequest(null, "Java pour débutants");

        mockMvc.perform(put("/api/cours/{id}", 9999)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void supprimer_renvoie204EtSupprimeLeCours() throws Exception {
        Cours cours = coursRepository.save(new Cours("JAVA101", "Introduction à Java"));

        mockMvc.perform(delete("/api/cours/{id}", cours.getIdCours()).with(csrf()))
                .andExpect(status().isNoContent());

        org.assertj.core.api.Assertions.assertThat(coursRepository.findById(cours.getIdCours())).isEmpty();
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void supprimer_renvoie404QuandLeCoursEstIntrouvable() throws Exception {
        mockMvc.perform(delete("/api/cours/{id}", 9999).with(csrf()))
                .andExpect(status().isNotFound());
    }

    private void assertThatCoursExiste(String code) {
        org.assertj.core.api.Assertions.assertThat(coursRepository.findByCode(code)).isPresent();
    }
}