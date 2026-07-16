package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.Cursus;
import fr.servicepedagogique.backend.bo.Promotion;
import fr.servicepedagogique.backend.bo.StatutPromotion;
import fr.servicepedagogique.backend.dal.CursusRepository;
import fr.servicepedagogique.backend.dal.PromotionRepository;
import fr.servicepedagogique.backend.dto.promotion.CreerPromotionRequest;
import fr.servicepedagogique.backend.dto.promotion.ModifierPromotionRequest;
import fr.servicepedagogique.backend.dto.promotion.PromotionResponse;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final CursusRepository cursusRepository;

    public PromotionService(PromotionRepository promotionRepository, CursusRepository cursusRepository) {
        this.promotionRepository = promotionRepository;
        this.cursusRepository = cursusRepository;
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> lister() {
        return promotionRepository.findAllByOrderByLibelleAsc()
                .stream()
                .map(PromotionResponse::depuis)
                .toList();
    }

    @Transactional(readOnly = true)
    public PromotionResponse consulter(Integer idPromotion) {
        return PromotionResponse.depuis(trouverPromotion(idPromotion));
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> listerParCursus(Integer idCursus) {
        return promotionRepository.findByCursus_IdCursus(idCursus)
                .stream()
                .map(PromotionResponse::depuis)
                .toList();
    }

    @Transactional
    public PromotionResponse creer(CreerPromotionRequest request) {
        String libelle = normaliserLibelleObligatoire(request.libelle());
        String periode = normaliserPeriodeObligatoire(request.periode());
        verifierLibelleDisponible(libelle, null);

        Cursus cursus = trouverCursus(request.idCursus());
        StatutPromotion statut = normaliserStatut(request.statut(), StatutPromotion.PLANIFIEE);

        return PromotionResponse.depuis(promotionRepository.save(new Promotion(cursus, libelle, periode, statut)));
    }

    @Transactional
    public PromotionResponse modifier(Integer idPromotion, ModifierPromotionRequest request) {
        Promotion promotion = trouverPromotion(idPromotion);

        if (request.idCursus() != null) {
            promotion.setCursus(trouverCursus(request.idCursus()));
        }

        if (request.libelle() != null) {
            String libelle = normaliserLibelleObligatoire(request.libelle());
            verifierLibelleDisponible(libelle, idPromotion);
            promotion.setLibelle(libelle);
        }

        if (request.periode() != null) {
            promotion.setPeriode(normaliserPeriodeObligatoire(request.periode()));
        }

        if (request.statut() != null) {
            promotion.setStatut(normaliserStatut(request.statut(), promotion.getStatut()));
        }

        return PromotionResponse.depuis(promotion);
    }

    @Transactional
    public void supprimer(Integer idPromotion) {
        promotionRepository.delete(trouverPromotion(idPromotion));
    }

    private Promotion trouverPromotion(Integer idPromotion) {
        return promotionRepository.findById(idPromotion)
                .orElseThrow(() -> new RessourceIntrouvableException("Promotion introuvable."));
    }

    private Cursus trouverCursus(Integer idCursus) {
        return cursusRepository.findById(idCursus)
                .orElseThrow(() -> new RessourceIntrouvableException("Cursus introuvable."));
    }

    private void verifierLibelleDisponible(String libelle, Integer idPromotionIgnore) {
        promotionRepository.findByLibelleIgnoreCase(libelle).ifPresent(promotionExistante -> {
            if (!promotionExistante.getIdPromotion().equals(idPromotionIgnore)) {
                throw new IllegalArgumentException("Une promotion avec ce libellé existe déjà : " + libelle);
            }
        });
    }

    private String normaliserLibelleObligatoire(String libelle) {
        if (!StringUtils.hasText(libelle)) {
            throw new IllegalArgumentException("Le libellé est obligatoire.");
        }

        return libelle.trim();
    }

    private String normaliserPeriodeObligatoire(String periode) {
        if (!StringUtils.hasText(periode)) {
            throw new IllegalArgumentException("La période est obligatoire.");
        }

        return periode.trim();
    }

    private StatutPromotion normaliserStatut(String statut, StatutPromotion statutParDefaut) {
        if (!StringUtils.hasText(statut)) {
            return statutParDefaut;
        }

        try {
            return StatutPromotion.valueOf(statut.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Statut de promotion invalide : " + statut);
        }
    }
}
