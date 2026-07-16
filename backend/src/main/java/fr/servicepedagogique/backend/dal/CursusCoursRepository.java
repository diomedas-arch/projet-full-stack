package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.CursusCours;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursusCoursRepository extends JpaRepository<CursusCours, Integer> {
}
