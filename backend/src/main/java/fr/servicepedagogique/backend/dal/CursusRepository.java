package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Cursus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursusRepository extends JpaRepository<Cursus, Integer> {

    List<Cursus> findAllByOrderByTitreAsc();

    long countByFiliere_IdFiliere(Integer idFiliere);

    boolean existsByFiliere_IdFiliereAndTitreIgnoreCase(Integer idFiliere, String titre);

    boolean existsByFiliere_IdFiliereAndTitreIgnoreCaseAndIdCursusNot(
            Integer idFiliere,
            String titre,
            Integer idCursus
    );
}
