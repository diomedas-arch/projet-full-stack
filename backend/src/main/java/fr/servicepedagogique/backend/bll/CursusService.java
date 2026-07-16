package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.Cursus;
import fr.servicepedagogique.backend.bo.Filiere;
import fr.servicepedagogique.backend.dal.CursusCoursRepository;
import fr.servicepedagogique.backend.dal.CursusRepository;
import fr.servicepedagogique.backend.dal.FiliereRepository;
import fr.servicepedagogique.backend.dto.cursus.CursusCoursResponse;
import fr.servicepedagogique.backend.dto.cursus.CursusRequest;
import fr.servicepedagogique.backend.dto.cursus.CursusResponse;
import fr.servicepedagogique.backend.exception.DonneeDejaExistanteException;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class CursusService {

    private final CursusRepository cursusRepository;
    private final FiliereRepository filiereRepository;
    private final CursusCoursRepository cursusCoursRepository;

    public CursusService(
            CursusRepository cursusRepository,
            FiliereRepository filiereRepository,
            CursusCoursRepository cursusCoursRepository
    ) {
        this.cursusRepository = cursusRepository;
        this.filiereRepository = filiereRepository;
        this.cursusCoursRepository = cursusCoursRepository;
    }

    @Transactional(readOnly = true)
    public List<CursusResponse> lister() {
        return cursusRepository.findAllByOrderByTitreAsc()
                .stream()
                .map(this::versResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CursusResponse consulter(Integer idCursus) {
        return versResponse(trouverCursus(idCursus));
    }

    @Transactional(readOnly = true)
    public List<CursusCoursResponse> listerCours(Integer idCursus) {
        trouverCursus(idCursus);
        return cursusCoursRepository.findByCursusIdAvecCours(idCursus)
                .stream()
                .map(CursusCoursResponse::depuis)
                .toList();
    }

    @Transactional
    public CursusResponse creer(CursusRequest request) {
        Filiere filiere = trouverFiliere(request.idFiliere());
        String titre = normaliserTitre(request.titre());
        verifierTitreDisponible(filiere.getIdFiliere(), titre, null);

        Cursus cursus = new Cursus(filiere, titre, normaliserNiveau(request.niveau()));
        return versResponse(cursusRepository.save(cursus));
    }

    @Transactional
    public CursusResponse modifier(Integer idCursus, CursusRequest request) {
        Cursus cursus = trouverCursus(idCursus);
        Filiere filiere = trouverFiliere(request.idFiliere());
        String titre = normaliserTitre(request.titre());
        verifierTitreDisponible(filiere.getIdFiliere(), titre, idCursus);

        cursus.setFiliere(filiere);
        cursus.setTitre(titre);
        cursus.setNiveau(normaliserNiveau(request.niveau()));
        return versResponse(cursus);
    }

    private Cursus trouverCursus(Integer idCursus) {
        return cursusRepository.findById(idCursus)
                .orElseThrow(() -> new RessourceIntrouvableException("Cursus introuvable."));
    }

    private Filiere trouverFiliere(Integer idFiliere) {
        return filiereRepository.findById(idFiliere)
                .orElseThrow(() -> new RessourceIntrouvableException("Filière introuvable."));
    }

    private void verifierTitreDisponible(Integer idFiliere, String titre, Integer idCursusIgnore) {
        boolean existe = idCursusIgnore == null
                ? cursusRepository.existsByFiliere_IdFiliereAndTitreIgnoreCase(idFiliere, titre)
                : cursusRepository.existsByFiliere_IdFiliereAndTitreIgnoreCaseAndIdCursusNot(
                        idFiliere,
                        titre,
                        idCursusIgnore
                );

        if (existe) {
            throw new DonneeDejaExistanteException("Ce cursus existe déjà dans la filière sélectionnée.");
        }
    }

    private String normaliserTitre(String titre) {
        if (!StringUtils.hasText(titre)) {
            throw new IllegalArgumentException("Le titre du cursus est obligatoire.");
        }
        return titre.trim();
    }

    private String normaliserNiveau(String niveau) {
        return StringUtils.hasText(niveau) ? niveau.trim() : null;
    }

    private CursusResponse versResponse(Cursus cursus) {
        return new CursusResponse(
                cursus.getIdCursus(),
                cursus.getTitre(),
                cursus.getNiveau(),
                cursus.getFiliere().getIdFiliere(),
                cursus.getFiliere().getLibelle()
        );
    }
}
