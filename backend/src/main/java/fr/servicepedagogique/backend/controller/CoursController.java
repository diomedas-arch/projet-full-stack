package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.CoursService;
import fr.servicepedagogique.backend.dto.cours.CoursResponse;
import fr.servicepedagogique.backend.dto.cours.CreerCoursRequest;
import fr.servicepedagogique.backend.dto.cours.ModifierCoursRequest;
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
@RequestMapping("/api/cours")
public class CoursController {

    private final CoursService coursService;

    public CoursController(CoursService coursService) {
        this.coursService = coursService;
    }

    @GetMapping
    public List<CoursResponse> lister() {
        return coursService.lister();
    }

    @GetMapping("/{idCours}")
    public CoursResponse consulter(@PathVariable Integer idCours) {
        return coursService.consulter(idCours);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CoursResponse creer(@Valid @RequestBody CreerCoursRequest request) {
        return coursService.creer(request);
    }

    @PutMapping("/{idCours}")
    public CoursResponse modifier(
            @PathVariable Integer idCours,
            @Valid @RequestBody ModifierCoursRequest request
    ) {
        return coursService.modifier(idCours, request);
    }

    @DeleteMapping("/{idCours}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Integer idCours) {
        coursService.supprimer(idCours);
    }
}
