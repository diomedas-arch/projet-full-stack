package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.FiliereService;
import fr.servicepedagogique.backend.dto.filiere.FiliereRequest;
import fr.servicepedagogique.backend.dto.filiere.FiliereResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/filieres")
public class FiliereController {

    private final FiliereService filiereService;

    public FiliereController(FiliereService filiereService) {
        this.filiereService = filiereService;
    }

    @GetMapping
    public List<FiliereResponse> lister() {
        return filiereService.lister();
    }

    @GetMapping("/{idFiliere}")
    public FiliereResponse consulter(@PathVariable Integer idFiliere) {
        return filiereService.consulter(idFiliere);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FiliereResponse creer(@Valid @RequestBody FiliereRequest request) {
        return filiereService.creer(request);
    }

    @PutMapping("/{idFiliere}")
    public FiliereResponse modifier(
            @PathVariable Integer idFiliere,
            @Valid @RequestBody FiliereRequest request
    ) {
        return filiereService.modifier(idFiliere, request);
    }
}
