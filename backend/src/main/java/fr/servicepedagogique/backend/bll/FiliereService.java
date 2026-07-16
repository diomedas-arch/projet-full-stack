package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.Filiere;
import fr.servicepedagogique.backend.dal.CursusRepository;
import fr.servicepedagogique.backend.dal.FiliereRepository;
import fr.servicepedagogique.backend.dto.filiere.FiliereRequest;
import fr.servicepedagogique.backend.dto.filiere.FiliereResponse;
import fr.servicepedagogique.backend.exception.DonneeDejaExistanteException;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class FiliereService {

    private final FiliereRepository filiereRepository;
    private final CursusRepository cursusRepository;

    public FiliereService(FiliereRepository filiereRepository, CursusRepository cursusRepository) {
        this.filiereRepository = filiereRepository;
        this.cursusRepository = cursusRepository;
    }

    @Transactional(readOnly = true)
    public List<FiliereResponse> lister() {
        return filiereRepository.findAllByOrderByLibelleAsc()
                .stream()
                .map(this::versResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FiliereResponse consulter(Integer idFiliere) {
        return versResponse(trouverFiliere(idFiliere));
    }

    @Transactional
    public FiliereResponse creer(FiliereRequest request) {
        String libelle = normaliserLibelle(request.libelle());
        if (filiereRepository.existsByLibelleIgnoreCase(libelle)) {
            throw new DonneeDejaExistanteException("Une filière portant ce nom existe déjà.");
        }

        return versResponse(filiereRepository.save(new Filiere(libelle)));
    }

    @Transactional
    public FiliereResponse modifier(Integer idFiliere, FiliereRequest request) {
        Filiere filiere = trouverFiliere(idFiliere);
        String libelle = normaliserLibelle(request.libelle());

        if (filiereRepository.existsByLibelleIgnoreCaseAndIdFiliereNot(libelle, idFiliere)) {
            throw new DonneeDejaExistanteException("Une filière portant ce nom existe déjà.");
        }

        filiere.setLibelle(libelle);
        return versResponse(filiere);
    }

    private Filiere trouverFiliere(Integer idFiliere) {
        return filiereRepository.findById(idFiliere)
                .orElseThrow(() -> new RessourceIntrouvableException("Filière introuvable."));
    }

    private String normaliserLibelle(String libelle) {
        if (!StringUtils.hasText(libelle)) {
            throw new IllegalArgumentException("Le libellé de la filière est obligatoire.");
        }
        return libelle.trim();
    }

    private FiliereResponse versResponse(Filiere filiere) {
        return new FiliereResponse(
                filiere.getIdFiliere(),
                filiere.getLibelle(),
                cursusRepository.countByFiliere_IdFiliere(filiere.getIdFiliere())
        );
    }
}
