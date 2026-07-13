package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Cours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoursRepository extends JpaRepository<Cours, Integer> {

    Optional<Cours> findByCode(String code);

    boolean existsByCode(String code);

}
