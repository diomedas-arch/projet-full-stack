package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.CursusCours;
import org.springframework.data.jpa.repository.JpaRepository;

// TODO MERGE : repository placeholder minimal créé par Allan pour permettre la compilation de Promotion/CoursPlanifie.
// À remplacer/fusionner avec l'implémentation complète de Sasha (branche cursus-filiere).
public interface CursusCoursRepository extends JpaRepository<CursusCours, Integer> {
}