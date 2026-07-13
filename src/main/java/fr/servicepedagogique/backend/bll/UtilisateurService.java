package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.StatutUtilisateur;
import fr.servicepedagogique.backend.bo.Utilisateur;
import fr.servicepedagogique.backend.dal.UtilisateurRepository;
import fr.servicepedagogique.backend.dto.utilisateur.ChangerMotDePasseRequest;
import fr.servicepedagogique.backend.dto.utilisateur.ChangerStatutUtilisateurRequest;
import fr.servicepedagogique.backend.dto.utilisateur.CreerUtilisateurRequest;
import fr.servicepedagogique.backend.dto.utilisateur.ModifierUtilisateurRequest;
import fr.servicepedagogique.backend.dto.utilisateur.UtilisateurResponse;
import fr.servicepedagogique.backend.exception.EmailDejaUtiliseException;
import fr.servicepedagogique.backend.exception.RessourceIntrouvableException;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UtilisateurResponse> lister() {
        return utilisateurRepository.findAll()
                .stream()
                .map(UtilisateurResponse::depuis)
                .toList();
    }

    @Transactional(readOnly = true)
    public UtilisateurResponse consulter(Integer idUtilisateur) {
        return UtilisateurResponse.depuis(trouverUtilisateur(idUtilisateur));
    }

    @Transactional
    public UtilisateurResponse creer(CreerUtilisateurRequest request) {
        String email = normaliserEmailObligatoire(request.email());
        verifierEmailDisponible(email, null);

        StatutUtilisateur statut = request.statut() == null ? StatutUtilisateur.ACTIF : request.statut();
        Utilisateur utilisateur = new Utilisateur(
                email,
                passwordEncoder.encode(request.motDePasse()),
                request.role(),
                statut
        );

        return UtilisateurResponse.depuis(utilisateurRepository.save(utilisateur));
    }

    @Transactional
    public UtilisateurResponse modifier(Integer idUtilisateur, ModifierUtilisateurRequest request) {
        Utilisateur utilisateur = trouverUtilisateur(idUtilisateur);

        if (request.email() != null) {
            String email = normaliserEmailObligatoire(request.email());
            verifierEmailDisponible(email, idUtilisateur);
            utilisateur.setEmail(email);
        }

        if (request.role() != null) {
            utilisateur.setRole(request.role());
        }

        if (request.statut() != null) {
            utilisateur.setStatut(request.statut());
        }

        return UtilisateurResponse.depuis(utilisateur);
    }

    @Transactional
    public UtilisateurResponse changerStatut(Integer idUtilisateur, ChangerStatutUtilisateurRequest request) {
        Utilisateur utilisateur = trouverUtilisateur(idUtilisateur);
        utilisateur.setStatut(request.statut());
        return UtilisateurResponse.depuis(utilisateur);
    }

    @Transactional
    public UtilisateurResponse changerMotDePasse(Integer idUtilisateur, ChangerMotDePasseRequest request) {
        Utilisateur utilisateur = trouverUtilisateur(idUtilisateur);
        utilisateur.setMotDePasseHash(passwordEncoder.encode(request.motDePasse()));
        return UtilisateurResponse.depuis(utilisateur);
    }

    private Utilisateur trouverUtilisateur(Integer idUtilisateur) {
        return utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable."));
    }

    private void verifierEmailDisponible(String email, Integer idUtilisateurIgnore) {
        utilisateurRepository.findByEmail(email).ifPresent(utilisateurExistant -> {
            if (!utilisateurExistant.getIdUtilisateur().equals(idUtilisateurIgnore)) {
                throw new EmailDejaUtiliseException("Cet email est déjà utilisé par un autre compte.");
            }
        });
    }

    private String normaliserEmailObligatoire(String email) {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("L'email est obligatoire.");
        }

        return email.trim().toLowerCase();
    }
}
