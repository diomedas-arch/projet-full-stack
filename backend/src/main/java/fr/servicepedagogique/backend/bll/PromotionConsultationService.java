package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import fr.servicepedagogique.backend.bo.Promotion;
import fr.servicepedagogique.backend.dal.CoursPlanifieRepository;
import fr.servicepedagogique.backend.dal.PromotionRepository;
import fr.servicepedagogique.backend.dto.planning.CoursPlanifieResponse;
import fr.servicepedagogique.backend.dto.promotion.PromotionDetailResponse;
import fr.servicepedagogique.backend.dto.promotion.PromotionResponse;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PromotionConsultationService {

    private final PromotionRepository promotionRepository;
    private final CoursPlanifieRepository coursPlanifieRepository;

    public PromotionConsultationService(
            PromotionRepository promotionRepository,
            CoursPlanifieRepository coursPlanifieRepository
    ) {
        this.promotionRepository = promotionRepository;
        this.coursPlanifieRepository = coursPlanifieRepository;
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> lister() {
        return promotionRepository.findAllByOrderByLibelleAsc()
                .stream()
                .map(PromotionResponse::depuis)
                .toList();
    }

    @Transactional(readOnly = true)
    public PromotionDetailResponse consulter(Integer idPromotion) {
        Promotion promotion = promotionRepository.findById(idPromotion)
                .orElseThrow(() -> new RessourceIntrouvableException("Promotion introuvable."));

        List<CoursPlanifie> cours = coursPlanifieRepository.findByPromotionIdAvecDetails(idPromotion);

        return new PromotionDetailResponse(
                PromotionResponse.depuis(promotion),
                cours.stream().map(CoursPlanifieResponse::depuis).toList()
        );
    }
}
