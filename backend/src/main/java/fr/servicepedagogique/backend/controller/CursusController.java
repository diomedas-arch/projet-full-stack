package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.CursusService;
import fr.servicepedagogique.backend.dto.cursus.CursusCoursResponse;
import fr.servicepedagogique.backend.dto.cursus.CursusRequest;
import fr.servicepedagogique.backend.dto.cursus.CursusResponse;
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
@RequestMapping("/api/cursus")
public class CursusController {

    private final CursusService cursusService;

    public CursusController(CursusService cursusService) {
        this.cursusService = cursusService;
    }

    @GetMapping
    public List<CursusResponse> lister() {
        return cursusService.lister();
    }

    @GetMapping("/{idCursus}")
    public CursusResponse consulter(@PathVariable Integer idCursus) {
        return cursusService.consulter(idCursus);
    }

    @GetMapping("/{idCursus}/cours")
    public List<CursusCoursResponse> listerCours(@PathVariable Integer idCursus) {
        return cursusService.listerCours(idCursus);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CursusResponse creer(@Valid @RequestBody CursusRequest request) {
        return cursusService.creer(request);
    }

    @PutMapping("/{idCursus}")
    public CursusResponse modifier(
            @PathVariable Integer idCursus,
            @Valid @RequestBody CursusRequest request
    ) {
        return cursusService.modifier(idCursus, request);
    }
}
