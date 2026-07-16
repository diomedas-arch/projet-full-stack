package fr.servicepedagogique.backend;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.servicepedagogique.backend.bo.Cours;
import fr.servicepedagogique.backend.bo.Cursus;
import fr.servicepedagogique.backend.bo.CursusCours;
import fr.servicepedagogique.backend.bo.Filiere;
import fr.servicepedagogique.backend.bo.Formateur;
import fr.servicepedagogique.backend.bo.RoleUtilisateur;
import fr.servicepedagogique.backend.bo.StatutUtilisateur;
import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dal.CoursRepository;
import fr.servicepedagogique.backend.dal.CursusCoursRepository;
import fr.servicepedagogique.backend.dal.CursusRepository;
import fr.servicepedagogique.backend.dal.FiliereRepository;
import fr.servicepedagogique.backend.dal.FormateurRepository;
import fr.servicepedagogique.backend.dal.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CatalogueLectureControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FiliereRepository filiereRepository;

    @Autowired
    private CursusRepository cursusRepository;

    @Autowired
    private CoursRepository coursRepository;

    @Autowired
    private CursusCoursRepository cursusCoursRepository;

    @Autowired
    private FormateurRepository formateurRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    private Integer idCursus;

    @BeforeEach
    void initialiserDonnees() {
        formateurRepository.deleteAll();
        cursusCoursRepository.deleteAll();
        coursRepository.deleteAll();
        cursusRepository.deleteAll();
        filiereRepository.deleteAll();
        utilisateurRepository.deleteAll();

        Filiere filiere = filiereRepository.save(new Filiere("Développement"));
        Cursus cursus = cursusRepository.save(new Cursus(filiere, "Concepteur développeur", null));
        Cours cours = coursRepository.save(new Cours("ANG-101", "Angular"));
        cursusCoursRepository.save(new CursusCours(cursus, cours, 1, null, true));
        idCursus = cursus.getIdCursus();

        Utilisateur formateurActif = utilisateurRepository.save(new Utilisateur(
                "formateur@example.com",
                "hash",
                RoleUtilisateur.ROLE_FORMATEUR,
                StatutUtilisateur.ACTIF
        ));
        formateurRepository.save(new Formateur(formateurActif, "Développement web", true));
        formateurRepository.save(new Formateur(null, null, true));

        Utilisateur formateurInactif = utilisateurRepository.save(new Utilisateur(
                "archive@example.com",
                "hash",
                RoleUtilisateur.ROLE_FORMATEUR,
                StatutUtilisateur.ACTIF
        ));
        formateurRepository.save(new Formateur(formateurInactif, "Archive", false));
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void adminPeutListerLesCoursDuCursus() throws Exception {
        mockMvc.perform(get("/api/cursus/{idCursus}/cours", idCursus))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].idCursus").value(idCursus))
                .andExpect(jsonPath("$[0].codeCours").value("ANG-101"))
                .andExpect(jsonPath("$[0].titreCours").value("Angular"))
                .andExpect(jsonPath("$[0].ordre").value(1))
                .andExpect(jsonPath("$[0].prerequis").doesNotExist())
                .andExpect(jsonPath("$[0].obligatoire").value(true));
    }

    @Test
    @WithMockUser(authorities = "ROLE_REFERENTE")
    void referentePeutListerLesFormateursActifs() throws Exception {
        mockMvc.perform(get("/api/formateurs").param("actif", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].email").doesNotExist())
                .andExpect(jsonPath("$[0].specialite").doesNotExist())
                .andExpect(jsonPath("$[0].actif").value(true))
                .andExpect(jsonPath("$[1].email").value("formateur@example.com"))
                .andExpect(jsonPath("$[1].specialite").value("Développement web"))
                .andExpect(jsonPath("$[1].actif").value(true));
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void cursusInexistantRetourne404() throws Exception {
        mockMvc.perform(get("/api/cursus/{idCursus}/cours", 999_999))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Cursus introuvable."));
    }

    @Test
    @WithMockUser(authorities = "ROLE_ELEVE")
    void eleveNePeutPasListerLesCoursDuCursus() throws Exception {
        mockMvc.perform(get("/api/cursus/{idCursus}/cours", idCursus))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ROLE_ELEVE")
    void eleveNePeutPasListerLesFormateurs() throws Exception {
        mockMvc.perform(get("/api/formateurs").param("actif", "true"))
                .andExpect(status().isForbidden());
    }
}
