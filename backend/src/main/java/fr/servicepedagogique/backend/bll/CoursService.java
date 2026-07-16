package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.Cours;
import fr.servicepedagogique.backend.dal.CoursRepository;
import fr.servicepedagogique.backend.dto.cours.CoursResponse;
import fr.servicepedagogique.backend.dto.cours.CreerCoursRequest;
import fr.servicepedagogique.backend.dto.cours.ModifierCoursRequest;
import fr.servicepedagogique.backend.exception.CodeCoursDejaUtiliseException;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class CoursService {

    private final CoursRepository coursRepository;

    public CoursService(CoursRepository coursRepository) {
        this.coursRepository = coursRepository;
    }

    @Transactional(readOnly = true)
    public List<CoursResponse> lister() {
        return coursRepository.findAll()
                .stream()
                .map(CoursResponse::depuis)
                .toList();
    }

    @Transactional(readOnly = true)
    public CoursResponse consulter(Integer idCours) {
        return CoursResponse.depuis(trouverCours(idCours));
    }

    @Transactional
    public CoursResponse creer(CreerCoursRequest request) {
        String code = normaliserCodeObligatoire(request.code());
        String titre = normaliserTitreObligatoire(request.titre());
        verifierCodeDisponible(code, null);

        return CoursResponse.depuis(coursRepository.save(new Cours(code, titre)));
    }

    @Transactional
    public CoursResponse modifier(Integer idCours, ModifierCoursRequest request) {
        Cours cours = trouverCours(idCours);

        if (request.code() != null) {
            String code = normaliserCodeObligatoire(request.code());
            verifierCodeDisponible(code, idCours);
            cours.setCode(code);
        }

        if (request.titre() != null) {
            cours.setTitre(normaliserTitreObligatoire(request.titre()));
        }

        return CoursResponse.depuis(cours);
    }

    @Transactional
    public void supprimer(Integer idCours) {
        coursRepository.delete(trouverCours(idCours));
    }

    private Cours trouverCours(Integer idCours) {
        return coursRepository.findById(idCours)
                .orElseThrow(() -> new RessourceIntrouvableException("Cours introuvable."));
    }

    private void verifierCodeDisponible(String code, Integer idCoursIgnore) {
        coursRepository.findByCode(code).ifPresent(coursExistant -> {
            if (!coursExistant.getIdCours().equals(idCoursIgnore)) {
                throw new CodeCoursDejaUtiliseException("Un cours avec ce code existe déjà.");
            }
        });
    }

    private String normaliserCodeObligatoire(String code) {
        if (!StringUtils.hasText(code)) {
            throw new IllegalArgumentException("Le code est obligatoire.");
        }

        return code.trim();
    }

    private String normaliserTitreObligatoire(String titre) {
        if (!StringUtils.hasText(titre)) {
            throw new IllegalArgumentException("Le titre est obligatoire.");
        }

        return titre.trim();
    }
}
