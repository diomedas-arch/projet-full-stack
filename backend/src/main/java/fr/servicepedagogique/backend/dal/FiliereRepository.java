package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Filiere;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FiliereRepository extends JpaRepository<Filiere, Integer> {

    List<Filiere> findAllByOrderByLibelleAsc();

    boolean existsByLibelleIgnoreCase(String libelle);

    boolean existsByLibelleIgnoreCaseAndIdFiliereNot(String libelle, Integer idFiliere);
}
