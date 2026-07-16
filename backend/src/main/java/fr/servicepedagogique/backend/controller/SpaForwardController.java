package fr.servicepedagogique.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({
            "/",
            "/login",
            "/accueil",
            "/filieres",
            "/cursus",
            "/cours",
            "/cours/{id}",
            "/cours/{id}/modifier",
            "/cours/nouveau",
            "/promotions",
            "/promotions/{id}",
            "/promotions/{id}/modifier",
            "/promotions/nouveau",
            "/cours-planifies",
            "/cours-planifies/{id}/modifier",
            "/cours-planifies/nouveau",
            "/eleves",
            "/eleves/{id}/modifier",
            "/eleves/nouveau",
            "/utilisateurs",
            "/utilisateurs/{id}/modifier",
            "/utilisateurs/nouveau",
            "/mon-calendrier",
            "/mes-cours"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
