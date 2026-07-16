package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.CoursPlanifieService;
import fr.servicepedagogique.backend.dto.coursplanifie.CoursPlanifieResponse;
import fr.servicepedagogique.backend.dto.coursplanifie.CreerCoursPlanifieRequest;
import fr.servicepedagogique.backend.dto.coursplanifie.ModifierCoursPlanifieRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cours-planifies")
public class CoursPlanifieController {

    private final CoursPlanifieService coursPlanifieService;

    public CoursPlanifieController(CoursPlanifieService coursPlanifieService) {
        this.coursPlanifieService = coursPlanifieService;
    }

    @GetMapping
    public List<CoursPlanifieResponse> lister() {
        return coursPlanifieService.lister();
    }

    @GetMapping("/{idCoursPlanifie}")
    public CoursPlanifieResponse consulter(@PathVariable Integer idCoursPlanifie) {
        return coursPlanifieService.consulter(idCoursPlanifie);
    }

    @GetMapping("/promotion/{idPromotion}")
    public List<CoursPlanifieResponse> listerParPromotion(@PathVariable Integer idPromotion) {
        return coursPlanifieService.listerParPromotion(idPromotion);
    }

    @GetMapping("/formateur/{idFormateur}")
    public List<CoursPlanifieResponse> listerParFormateur(@PathVariable Integer idFormateur) {
        return coursPlanifieService.listerParFormateur(idFormateur);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CoursPlanifieResponse creer(@Valid @RequestBody CreerCoursPlanifieRequest request) {
        return coursPlanifieService.creer(request);
    }

    @PutMapping("/{idCoursPlanifie}")
    public CoursPlanifieResponse modifier(
            @PathVariable Integer idCoursPlanifie,
            @Valid @RequestBody ModifierCoursPlanifieRequest request
    ) {
        return coursPlanifieService.modifier(idCoursPlanifie, request);
    }

    @DeleteMapping("/{idCoursPlanifie}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Integer idCoursPlanifie) {
        coursPlanifieService.supprimer(idCoursPlanifie);
    }
}
