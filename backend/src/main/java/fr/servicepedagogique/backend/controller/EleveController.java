package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.EleveService;
import fr.servicepedagogique.backend.dto.eleve.CreerEleveRequest;
import fr.servicepedagogique.backend.dto.eleve.EleveResponse;
import fr.servicepedagogique.backend.dto.eleve.ModifierEleveRequest;
import fr.servicepedagogique.backend.dto.utilisateur.ChangerMotDePasseRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/eleves")
public class EleveController {

    private final EleveService eleveService;

    public EleveController(EleveService eleveService) {
        this.eleveService = eleveService;
    }

    @GetMapping
    public List<EleveResponse> lister() {
        return eleveService.lister();
    }

    @GetMapping("/{idEleve}")
    public EleveResponse consulter(@PathVariable Integer idEleve) {
        return eleveService.consulter(idEleve);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EleveResponse creer(@Valid @RequestBody CreerEleveRequest request) {
        return eleveService.creer(request);
    }

    @PutMapping("/{idEleve}")
    public EleveResponse modifier(
            @PathVariable Integer idEleve,
            @Valid @RequestBody ModifierEleveRequest request
    ) {
        return eleveService.modifier(idEleve, request);
    }

    @PatchMapping("/{idEleve}/mot-de-passe")
    public EleveResponse changerMotDePasse(
            @PathVariable Integer idEleve,
            @Valid @RequestBody ChangerMotDePasseRequest request
    ) {
        return eleveService.changerMotDePasse(idEleve, request);
    }

    @DeleteMapping("/{idEleve}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Integer idEleve) {
        eleveService.supprimer(idEleve);
    }
}
