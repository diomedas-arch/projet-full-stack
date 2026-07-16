package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import fr.servicepedagogique.backend.bo.Eleve;
import fr.servicepedagogique.backend.bo.Formateur;
import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dal.CoursPlanifieRepository;
import fr.servicepedagogique.backend.dal.FormateurRepository;
import fr.servicepedagogique.backend.dal.InscriptionCoursRepository;
import fr.servicepedagogique.backend.dal.InscriptionPromoRepository;
import fr.servicepedagogique.backend.dto.formateur.CoursFormateurResponse;
import fr.servicepedagogique.backend.dto.formateur.EleveConcerneResponse;
import fr.servicepedagogique.backend.dto.planning.CoursPlanifieResponse;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FormateurConsultationService {

    private final FormateurRepository formateurRepository;
    private final CoursPlanifieRepository coursPlanifieRepository;
    private final InscriptionPromoRepository inscriptionPromoRepository;
    private final InscriptionCoursRepository inscriptionCoursRepository;

    public FormateurConsultationService(
            FormateurRepository formateurRepository,
            CoursPlanifieRepository coursPlanifieRepository,
            InscriptionPromoRepository inscriptionPromoRepository,
            InscriptionCoursRepository inscriptionCoursRepository
    ) {
        this.formateurRepository = formateurRepository;
        this.coursPlanifieRepository = coursPlanifieRepository;
        this.inscriptionPromoRepository = inscriptionPromoRepository;
        this.inscriptionCoursRepository = inscriptionCoursRepository;
    }

    @Transactional(readOnly = true)
    public List<CoursFormateurResponse> consulterCoursPour(Utilisateur utilisateur) {
        Formateur formateur = formateurRepository.findByUtilisateurIdUtilisateur(utilisateur.getIdUtilisateur())
                .orElseThrow(() -> new RessourceIntrouvableException("Dossier formateur introuvable."));

        return coursPlanifieRepository.findCoursParFormateur(formateur.getIdFormateur())
                .stream()
                .map(this::versResponse)
                .toList();
    }

    private CoursFormateurResponse versResponse(CoursPlanifie coursPlanifie) {
        Map<Integer, Eleve> eleves = new LinkedHashMap<>();

        inscriptionPromoRepository.findElevesValidesParPromotion(coursPlanifie.getPromotion().getIdPromotion())
                .forEach(eleve -> eleves.put(eleve.getIdEleve(), eleve));
        inscriptionCoursRepository.findElevesValidesParCoursPlanifie(coursPlanifie.getIdCoursPlanifie())
                .forEach(eleve -> eleves.put(eleve.getIdEleve(), eleve));

        return new CoursFormateurResponse(
                CoursPlanifieResponse.depuis(coursPlanifie),
                eleves.values().stream().map(EleveConcerneResponse::depuis).toList()
        );
    }
}
