package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.UtilisateurService;
import fr.servicepedagogique.backend.dto.utilisateur.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class
UtilisateurController {

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
