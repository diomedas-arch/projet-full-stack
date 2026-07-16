package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Cours;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoursRepository extends JpaRepository<Cours, Integer> {

    Optional<Cours> findByCode(String code);
}
