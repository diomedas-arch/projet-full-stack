package fr.servicepedagogique.backend.controller;

import fr.servicepedagogique.backend.bll.CoursService;
import fr.servicepedagogique.backend.bo.Cours;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cours")
@RequiredArgsConstructor
public class CoursController {

    private final CoursService coursService;

    @GetMapping
    public List<Cours> getAll() {
        return coursService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cours> getById(@PathVariable Integer id) {
        return coursService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cours> create(@RequestBody Cours cours) {
        return ResponseEntity.ok(coursService.create(cours));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cours> update(@PathVariable Integer id, @RequestBody Cours cours) {
        return ResponseEntity.ok(coursService.update(id, cours));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        coursService.delete(id);
        return ResponseEntity.noContent().build();
    }
}