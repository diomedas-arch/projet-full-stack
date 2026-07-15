package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.Cours;
import fr.servicepedagogique.backend.dal.CoursRepository;
import fr.servicepedagogique.backend.dto.cours.CoursResponse;
import fr.servicepedagogique.backend.dto.cours.CreerCoursRequest;
import fr.servicepedagogique.backend.dto.cours.ModifierCoursRequest;
import fr.servicepedagogique.backend.exception.CodeCoursDejaUtiliseException;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CoursServiceTest {

    @Mock
    private CoursRepository coursRepository;

    private CoursService coursService;

    @BeforeEach
    void setUp() {
        coursService = new CoursService(coursRepository);
    }

    private static Cours coursAvecId(Integer id, String code, String titre) {
        Cours cours = new Cours(code, titre);
        cours.setIdCours(id);
        return cours;
    }

    @Test
    void lister_renvoieTousLesCoursSousFormeDeReponses() {
        Cours cours = coursAvecId(1, "JAVA101", "Introduction à Java");
        when(coursRepository.findAll()).thenReturn(List.of(cours));

        List<CoursResponse> resultat = coursService.lister();

        assertThat(resultat).containsExactly(new CoursResponse(1, "JAVA101", "Introduction à Java"));
    }





    @Test
    void consulter_renvoieLeCoursQuandIlExiste() {
        Cours cours = coursAvecId(1, "JAVA101", "Introduction à Java");
        when(coursRepository.findById(1)).thenReturn(Optional.of(cours));

        CoursResponse resultat = coursService.consulter(1);

        assertThat(resultat).isEqualTo(new CoursResponse(1, "JAVA101", "Introduction à Java"));
    }

    @Test
    void consulter_leveUneExceptionQuandLeCoursEstIntrouvable() {
        when(coursRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> coursService.consulter(99))
                .isInstanceOf(RessourceIntrouvableException.class);
    }

    @Test
    void creer_sauvegardeLeCoursQuandLeCodeEstDisponible() {
        CreerCoursRequest request = new CreerCoursRequest("JAVA101", "Introduction à Java");
        when(coursRepository.findByCode("JAVA101")).thenReturn(Optional.empty());
        when(coursRepository.save(any(Cours.class))).thenAnswer(invocation -> coursAvecId(1, "JAVA101", "Introduction à Java"));

        CoursResponse resultat = coursService.creer(request);

        assertThat(resultat).isEqualTo(new CoursResponse(1, "JAVA101", "Introduction à Java"));
    }

    @Test
    void creer_leveUneExceptionQuandLeCodeExisteDeja() {
        CreerCoursRequest request = new CreerCoursRequest("JAVA101", "Introduction à Java");
        when(coursRepository.findByCode("JAVA101"))
                .thenReturn(Optional.of(coursAvecId(1, "JAVA101", "Ancien titre")));

        assertThatThrownBy(() -> coursService.creer(request))
                .isInstanceOf(CodeCoursDejaUtiliseException.class);

        verify(coursRepository, never()).save(any());
    }

    @Test
    void modifier_metAJourLesChampsFournis() {
        Cours coursExistant = coursAvecId(1, "JAVA101", "Introduction à Java");
        when(coursRepository.findById(1)).thenReturn(Optional.of(coursExistant));
        when(coursRepository.findByCode("JAVA102")).thenReturn(Optional.empty());

        CoursResponse resultat = coursService.modifier(1, new ModifierCoursRequest("JAVA102", null));

        assertThat(resultat.code()).isEqualTo("JAVA102");
        assertThat(resultat.titre()).isEqualTo("Introduction à Java");
    }

    @Test
    void modifier_leveUneExceptionQuandLeNouveauCodeAppartientAUnAutreCours() {
        Cours coursExistant = coursAvecId(1, "JAVA101", "Introduction à Java");
        Cours autreCours = coursAvecId(2, "JAVA102", "Java avancé");
        when(coursRepository.findById(1)).thenReturn(Optional.of(coursExistant));
        when(coursRepository.findByCode("JAVA102")).thenReturn(Optional.of(autreCours));

        assertThatThrownBy(() -> coursService.modifier(1, new ModifierCoursRequest("JAVA102", null)))
                .isInstanceOf(CodeCoursDejaUtiliseException.class);
    }

    @Test
    void modifier_nEcheDePasQuandLeCodeFourniEstLeMemeQueLExistant() {
        Cours coursExistant = coursAvecId(1, "JAVA101", "Introduction à Java");
        when(coursRepository.findById(1)).thenReturn(Optional.of(coursExistant));
        when(coursRepository.findByCode("JAVA101")).thenReturn(Optional.of(coursExistant));

        CoursResponse resultat = coursService.modifier(1, new ModifierCoursRequest("JAVA101", "Nouveau titre"));

        assertThat(resultat.code()).isEqualTo("JAVA101");
        assertThat(resultat.titre()).isEqualTo("Nouveau titre");
    }

    @Test
    void supprimer_supprimeLeCoursQuandIlExiste() {
        Cours cours = coursAvecId(1, "JAVA101", "Introduction à Java");
        when(coursRepository.findById(1)).thenReturn(Optional.of(cours));

        coursService.supprimer(1);

        verify(coursRepository).delete(cours);
    }

    @Test
    void supprimer_leveUneExceptionQuandLeCoursEstIntrouvable() {
        when(coursRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> coursService.supprimer(99))
                .isInstanceOf(RessourceIntrouvableException.class);

        verify(coursRepository, never()).delete(any());
    }
}