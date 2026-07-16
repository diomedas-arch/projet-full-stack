package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import fr.servicepedagogique.backend.bo.CursusCours;
import fr.servicepedagogique.backend.bo.Formateur;
import fr.servicepedagogique.backend.bo.Promotion;
import fr.servicepedagogique.backend.bo.StatutCoursPlanifie;
import fr.servicepedagogique.backend.dal.CoursPlanifieRepository;
import fr.servicepedagogique.backend.dal.CursusCoursRepository;
import fr.servicepedagogique.backend.dal.FormateurRepository;
import fr.servicepedagogique.backend.dal.PromotionRepository;
import fr.servicepedagogique.backend.dto.coursplanifie.CoursPlanifieResponse;
import fr.servicepedagogique.backend.dto.coursplanifie.CreerCoursPlanifieRequest;
import fr.servicepedagogique.backend.dto.coursplanifie.ModifierCoursPlanifieRequest;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class CoursPlanifieService {

    private final CoursPlanifieRepository coursPlanifieRepository;
    private final PromotionRepository promotionRepository;
    private final CursusCoursRepository cursusCoursRepository;
    private final FormateurRepository formateurRepository;

    public CoursPlanifieService(
            CoursPlanifieRepository coursPlanifieRepository,
            PromotionRepository promotionRepository,
            CursusCoursRepository cursusCoursRepository,
            FormateurRepository formateurRepository
    ) {
        this.coursPlanifieRepository = coursPlanifieRepository;
        this.promotionRepository = promotionRepository;
        this.cursusCoursRepository = cursusCoursRepository;
        this.formateurRepository = formateurRepository;
    }

    @Transactional(readOnly = true)
    public List<CoursPlanifieResponse> lister() {
        return coursPlanifieRepository.findAll()
                .stream()
                .map(CoursPlanifieResponse::depuis)
                .toList();
    }

    @Transactional(readOnly = true)
    public CoursPlanifieResponse consulter(Integer idCoursPlanifie) {
        return CoursPlanifieResponse.depuis(trouverCoursPlanifie(idCoursPlanifie));
    }

    @Transactional(readOnly = true)
    public List<CoursPlanifieResponse> listerParPromotion(Integer idPromotion) {
        return coursPlanifieRepository.findByPromotion_IdPromotion(idPromotion)
                .stream()
                .map(CoursPlanifieResponse::depuis)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CoursPlanifieResponse> listerParFormateur(Integer idFormateur) {
        return coursPlanifieRepository.findByFormateur_IdFormateur(idFormateur)
                .stream()
                .map(CoursPlanifieResponse::depuis)
                .toList();
    }

    @Transactional
    public CoursPlanifieResponse creer(CreerCoursPlanifieRequest request) {
        verifierDates(request.dateDebut(), request.dateFin());

        Promotion promotion = trouverPromotion(request.idPromotion());
        CursusCours cursusCours = trouverCursusCours(request.idCursusCours());
        verifierCursusCoursAppartientAuCursusDeLaPromotion(promotion, cursusCours);
        verifierCoupleDisponible(promotion, cursusCours, null);

        Formateur formateur = request.idFormateur() != null ? trouverFormateur(request.idFormateur()) : null;
        StatutCoursPlanifie statut = normaliserStatut(request.statut(), StatutCoursPlanifie.PLANIFIE);

        CoursPlanifie coursPlanifie = new CoursPlanifie(
                promotion,
                cursusCours,
                formateur,
                request.dateDebut(),
                request.dateFin(),
                normaliserTexteOptionnel(request.salle()),
                statut
        );

        return CoursPlanifieResponse.depuis(coursPlanifieRepository.save(coursPlanifie));
    }

    @Transactional
    public CoursPlanifieResponse modifier(Integer idCoursPlanifie, ModifierCoursPlanifieRequest request) {
        CoursPlanifie coursPlanifie = trouverCoursPlanifie(idCoursPlanifie);

        Promotion promotion = request.idPromotion() != null
                ? trouverPromotion(request.idPromotion())
                : coursPlanifie.getPromotion();
        CursusCours cursusCours = request.idCursusCours() != null
                ? trouverCursusCours(request.idCursusCours())
                : coursPlanifie.getCursusCours();

        LocalDateTime dateDebut = request.dateDebut() != null ? request.dateDebut() : coursPlanifie.getDateDebut();
        LocalDateTime dateFin = request.dateFin() != null ? request.dateFin() : coursPlanifie.getDateFin();
        verifierDates(dateDebut, dateFin);

        if (request.idPromotion() != null || request.idCursusCours() != null) {
            verifierCursusCoursAppartientAuCursusDeLaPromotion(promotion, cursusCours);
            verifierCoupleDisponible(promotion, cursusCours, coursPlanifie);
        }

        coursPlanifie.setPromotion(promotion);
        coursPlanifie.setCursusCours(cursusCours);
        coursPlanifie.setDateDebut(dateDebut);
        coursPlanifie.setDateFin(dateFin);

        coursPlanifie.setFormateur(request.idFormateur() == null ? null : trouverFormateur(request.idFormateur()));
        coursPlanifie.setSalle(normaliserTexteOptionnel(request.salle()));

        if (request.statut() != null) {
            coursPlanifie.setStatut(normaliserStatut(request.statut(), coursPlanifie.getStatut()));
        }

        return CoursPlanifieResponse.depuis(coursPlanifie);
    }

    @Transactional
    public void supprimer(Integer idCoursPlanifie) {
        coursPlanifieRepository.delete(trouverCoursPlanifie(idCoursPlanifie));
    }

    private CoursPlanifie trouverCoursPlanifie(Integer idCoursPlanifie) {
        return coursPlanifieRepository.findById(idCoursPlanifie)
                .orElseThrow(() -> new RessourceIntrouvableException("Cours planifié introuvable."));
    }

    private Promotion trouverPromotion(Integer idPromotion) {
        return promotionRepository.findById(idPromotion)
                .orElseThrow(() -> new RessourceIntrouvableException("Promotion introuvable."));
    }

    private CursusCours trouverCursusCours(Integer idCursusCours) {
        return cursusCoursRepository.findById(idCursusCours)
                .orElseThrow(() -> new RessourceIntrouvableException("Cours du cursus introuvable."));
    }

    private Formateur trouverFormateur(Integer idFormateur) {
        return formateurRepository.findById(idFormateur)
                .orElseThrow(() -> new RessourceIntrouvableException("Formateur introuvable."));
    }

    private void verifierDates(LocalDateTime dateDebut, LocalDateTime dateFin) {
        if (dateDebut == null || dateFin == null) {
            throw new IllegalArgumentException("Les dates de début et de fin sont obligatoires.");
        }

        if (!dateFin.isAfter(dateDebut)) {
            throw new IllegalArgumentException("La date de fin doit être strictement postérieure à la date de début.");
        }
    }

    private void verifierCursusCoursAppartientAuCursusDeLaPromotion(Promotion promotion, CursusCours cursusCours) {
        if (!cursusCours.getCursus().getIdCursus().equals(promotion.getCursus().getIdCursus())) {
            throw new IllegalArgumentException("Le cours planifié doit appartenir au même cursus que la promotion.");
        }
    }

    private void verifierCoupleDisponible(
            Promotion promotion,
            CursusCours cursusCours,
            CoursPlanifie coursPlanifieActuel
    ) {
        boolean inchange = coursPlanifieActuel != null
                && promotion.getIdPromotion().equals(coursPlanifieActuel.getPromotion().getIdPromotion())
                && cursusCours.getIdCursusCours().equals(coursPlanifieActuel.getCursusCours().getIdCursusCours());

        if (!inchange && coursPlanifieRepository.existsByPromotionAndCursusCours(promotion, cursusCours)) {
            throw new IllegalArgumentException("Ce cours du cursus est déjà planifié pour cette promotion.");
        }
    }

    private StatutCoursPlanifie normaliserStatut(String statut, StatutCoursPlanifie statutParDefaut) {
        if (!StringUtils.hasText(statut)) {
            return statutParDefaut;
        }

        try {
            return StatutCoursPlanifie.valueOf(statut.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Statut de cours planifié invalide : " + statut);
        }
    }

    private String normaliserTexteOptionnel(String valeur) {
        return StringUtils.hasText(valeur) ? valeur.trim() : null;
    }
}
