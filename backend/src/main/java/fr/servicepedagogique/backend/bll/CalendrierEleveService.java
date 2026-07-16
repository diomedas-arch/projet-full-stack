package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import fr.servicepedagogique.backend.bo.Eleve;
import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dal.CoursPlanifieRepository;
import fr.servicepedagogique.backend.dal.EleveRepository;
import fr.servicepedagogique.backend.dto.calendrier.CalendrierEleveResponse;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CalendrierEleveService {

    private final EleveRepository eleveRepository;
    private final CoursPlanifieRepository coursPlanifieRepository;

    public CalendrierEleveService(
            EleveRepository eleveRepository,
            CoursPlanifieRepository coursPlanifieRepository
    ) {
        this.eleveRepository = eleveRepository;
        this.coursPlanifieRepository = coursPlanifieRepository;
    }

    @Transactional(readOnly = true)
    public List<CalendrierEleveResponse> consulterPour(Utilisateur utilisateur) {
        Eleve eleve = eleveRepository.findByUtilisateurIdUtilisateur(utilisateur.getIdUtilisateur())
                .orElseThrow(() -> new RessourceIntrouvableException("Dossier élève introuvable."));

        List<CoursPlanifie> coursPromotion = coursPlanifieRepository.findCalendrierPromotionParEleve(eleve.getIdEleve());
        List<CoursPlanifie> coursUnite = coursPlanifieRepository.findCalendrierUniteParEleve(eleve.getIdEleve());

        return Stream.concat(
                        coursPromotion.stream().map(cours -> CalendrierEleveResponse.depuis("PROMOTION", cours)),
                        coursUnite.stream().map(cours -> CalendrierEleveResponse.depuis("UNITE", cours))
                )
                .sorted(Comparator.comparing(CalendrierEleveResponse::dateDebut))
                .toList();
    }
}
