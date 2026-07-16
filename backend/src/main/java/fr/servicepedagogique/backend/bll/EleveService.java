package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.Eleve;
import fr.servicepedagogique.backend.bo.RoleUtilisateur;
import fr.servicepedagogique.backend.bo.StatutUtilisateur;
import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dal.EleveRepository;
import fr.servicepedagogique.backend.dal.UtilisateurRepository;
import fr.servicepedagogique.backend.dto.eleve.CreerEleveRequest;
import fr.servicepedagogique.backend.dto.eleve.EleveResponse;
import fr.servicepedagogique.backend.dto.eleve.ModifierEleveRequest;
import fr.servicepedagogique.backend.dto.utilisateur.ChangerMotDePasseRequest;
import fr.servicepedagogique.backend.exception.DonneeDejaExistanteException;
import fr.servicepedagogique.backend.exception.EmailDejaUtiliseException;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class EleveService {

    private final EleveRepository eleveRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public EleveService(
            EleveRepository eleveRepository,
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.eleveRepository = eleveRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<EleveResponse> lister() {
        return eleveRepository.findAll()
                .stream()
                .map(EleveResponse::depuis)
                .toList();
    }

    @Transactional(readOnly = true)
    public EleveResponse consulter(Integer idEleve) {
        return EleveResponse.depuis(trouverEleve(idEleve));
    }

    @Transactional
    public EleveResponse creer(CreerEleveRequest request) {
        String email = normaliserEmailObligatoire(request.email());
        String numeroDossier = normaliserNumeroDossierObligatoire(request.numeroDossier());
        verifierEmailDisponible(email, null);
        verifierNumeroDossierDisponible(numeroDossier, null);

        StatutUtilisateur statut = request.statut() == null ? StatutUtilisateur.ACTIF : request.statut();
        Utilisateur utilisateur = new Utilisateur(
                email,
                passwordEncoder.encode(request.motDePasse()),
                RoleUtilisateur.ROLE_ELEVE,
                statut
        );

        Utilisateur utilisateurEnregistre = utilisateurRepository.saveAndFlush(utilisateur);
        Eleve eleve = eleveRepository.findByUtilisateurIdUtilisateur(utilisateurEnregistre.getIdUtilisateur())
                .orElseGet(() -> new Eleve(utilisateurEnregistre, numeroDossier, normaliserTexteOptionnel(request.telephone())));
        eleve.setUtilisateur(utilisateurEnregistre);
        eleve.setNumeroDossier(numeroDossier);
        eleve.setTelephone(normaliserTexteOptionnel(request.telephone()));

        return EleveResponse.depuis(eleveRepository.save(eleve));
    }

    @Transactional
    public EleveResponse modifier(Integer idEleve, ModifierEleveRequest request) {
        Eleve eleve = trouverEleve(idEleve);
        Utilisateur utilisateur = eleve.getUtilisateur();

        if (request.email() != null) {
            String email = normaliserEmailObligatoire(request.email());
            verifierEmailDisponible(email, utilisateur.getIdUtilisateur());
            utilisateur.setEmail(email);
        }

        if (request.numeroDossier() != null) {
            String numeroDossier = normaliserNumeroDossierObligatoire(request.numeroDossier());
            verifierNumeroDossierDisponible(numeroDossier, idEleve);
            eleve.setNumeroDossier(numeroDossier);
        }

        eleve.setTelephone(normaliserTexteOptionnel(request.telephone()));

        if (request.statut() != null) {
            utilisateur.setStatut(request.statut());
        }

        return EleveResponse.depuis(eleve);
    }

    @Transactional
    public EleveResponse changerMotDePasse(Integer idEleve, ChangerMotDePasseRequest request) {
        Eleve eleve = trouverEleve(idEleve);
        eleve.getUtilisateur().setMotDePasseHash(passwordEncoder.encode(request.motDePasse()));
        return EleveResponse.depuis(eleve);
    }

    @Transactional
    public void supprimer(Integer idEleve) {
        Eleve eleve = trouverEleve(idEleve);
        Utilisateur utilisateur = eleve.getUtilisateur();
        eleveRepository.delete(eleve);
        eleveRepository.flush();
        utilisateurRepository.delete(utilisateur);
    }

    private Eleve trouverEleve(Integer idEleve) {
        return eleveRepository.findById(idEleve)
                .orElseThrow(() -> new RessourceIntrouvableException("Élève introuvable."));
    }

    private void verifierEmailDisponible(String email, Integer idUtilisateurIgnore) {
        utilisateurRepository.findByEmail(email).ifPresent(utilisateurExistant -> {
            if (!utilisateurExistant.getIdUtilisateur().equals(idUtilisateurIgnore)) {
                throw new EmailDejaUtiliseException("Cet email est déjà utilisé par un autre compte.");
            }
        });
    }

    private void verifierNumeroDossierDisponible(String numeroDossier, Integer idEleveIgnore) {
        eleveRepository.findByNumeroDossier(numeroDossier).ifPresent(eleveExistant -> {
            if (!eleveExistant.getIdEleve().equals(idEleveIgnore)) {
                throw new DonneeDejaExistanteException("Ce numéro de dossier est déjà utilisé par un autre élève.");
            }
        });
    }

    private String normaliserEmailObligatoire(String email) {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("L'email est obligatoire.");
        }

        return email.trim().toLowerCase();
    }

    private String normaliserNumeroDossierObligatoire(String numeroDossier) {
        if (!StringUtils.hasText(numeroDossier)) {
            throw new IllegalArgumentException("Le numéro de dossier est obligatoire.");
        }

        return numeroDossier.trim();
    }

    private String normaliserTexteOptionnel(String valeur) {
        return StringUtils.hasText(valeur) ? valeur.trim() : null;
    }
}
