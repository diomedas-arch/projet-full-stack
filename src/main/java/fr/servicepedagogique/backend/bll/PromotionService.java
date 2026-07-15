package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.Cursus;
import fr.servicepedagogique.backend.bo.Promotion;
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

    private static final String STATUT_PAR_DEFAUT = "PLANIFIEE";

    private final PromotionRepository promotionRepository;
    private final CursusRepository cursusRepository;

    public PromotionService(PromotionRepository promotionRepository, CursusRepository cursusRepository) {
        this.promotionRepository = promotionRepository;
        this.cursusRepository = cursusRepository;
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> lister() {
        return promotionRepository.findAll()
                .stream()
                .map(PromotionResponse::depuis)
                .toList();
    }

    @Transactional(readOnly = true)
    public PromotionResponse consulter(Integer idPromotion) {
        return PromotionResponse.depuis(trouverPromotion(idPromotion));
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> findByCursus(Integer idCursus) {
        return promotionRepository.findByCursus_IdCursus(idCursus)
                .stream()
                .map(PromotionResponse::depuis)
                .toList();
    }

    @Transactional
    public PromotionResponse creer(CreerPromotionRequest request) {
        String libelle = normaliserLibelleObligatoire(request.libelle());
        verifierLibelleDisponible(libelle);

        Cursus cursus = trouverCursus(request.idCursus());
        String statut = request.statut() != null ? request.statut() : STATUT_PAR_DEFAUT;

        Promotion promotion = new Promotion(cursus, libelle, request.periode().trim(), statut);
        return PromotionResponse.depuis(promotionRepository.save(promotion));
    }

    @Transactional
    public PromotionResponse modifier(Integer idPromotion, ModifierPromotionRequest request) {
        Promotion promotion = trouverPromotion(idPromotion);

        if (request.idCursus() != null) {
            promotion.setCursus(trouverCursus(request.idCursus()));
        }

        if (request.libelle() != null) {
            String libelle = normaliserLibelleObligatoire(request.libelle());
            if (!libelle.equals(promotion.getLibelle())) {
                verifierLibelleDisponible(libelle);
            }
            promotion.setLibelle(libelle);
        }

        if (request.periode() != null) {
            promotion.setPeriode(request.periode().trim());
        }

        if (request.statut() != null) {
            promotion.setStatut(request.statut());
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

    private void verifierLibelleDisponible(String libelle) {
        if (promotionRepository.existsByLibelle(libelle)) {
            throw new IllegalArgumentException("Une promotion avec ce libellé existe déjà : " + libelle);
        }
    }

    private String normaliserLibelleObligatoire(String libelle) {
        if (!StringUtils.hasText(libelle)) {
            throw new IllegalArgumentException("Le libellé est obligatoire.");
        }

        return libelle.trim();
    }
}