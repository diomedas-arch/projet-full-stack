package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.UtilisateurService;
import fr.servicepedagogique.backend.dto.utilisateur.ChangerMotDePasseRequest;
import fr.servicepedagogique.backend.dto.utilisateur.ChangerStatutUtilisateurRequest;
import fr.servicepedagogique.backend.dto.utilisateur.CreerUtilisateurRequest;
import fr.servicepedagogique.backend.dto.utilisateur.ModifierUtilisateurRequest;
import fr.servicepedagogique.backend.dto.utilisateur.UtilisateurResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    public List<UtilisateurResponse> lister() {
        return utilisateurService.lister();
    }

    @GetMapping("/{idUtilisateur}")
    public UtilisateurResponse consulter(@PathVariable Integer idUtilisateur) {
        return utilisateurService.consulter(idUtilisateur);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UtilisateurResponse creer(@Valid @RequestBody CreerUtilisateurRequest request) {
        return utilisateurService.creer(request);
    }

    @PutMapping("/{idUtilisateur}")
    public UtilisateurResponse modifier(
            @PathVariable Integer idUtilisateur,
            @Valid @RequestBody ModifierUtilisateurRequest request
    ) {
        return utilisateurService.modifier(idUtilisateur, request);
    }

    @PatchMapping("/{idUtilisateur}/statut")
    public UtilisateurResponse changerStatut(
            @PathVariable Integer idUtilisateur,
            @Valid @RequestBody ChangerStatutUtilisateurRequest request
    ) {
        return utilisateurService.changerStatut(idUtilisateur, request);
    }

    @PatchMapping("/{idUtilisateur}/mot-de-passe")
    public UtilisateurResponse changerMotDePasse(
            @PathVariable Integer idUtilisateur,
            @Valid @RequestBody ChangerMotDePasseRequest request
    ) {
        return utilisateurService.changerMotDePasse(idUtilisateur, request);
    }
}
