package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Promotion;
import fr.servicepedagogique.backend.bo.StatutPromotion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, Integer> {

    List<Promotion> findAllByOrderByLibelleAsc();

    Optional<Promotion> findByLibelleIgnoreCase(String libelle);

    boolean existsByLibelle(String libelle);

    List<Promotion> findByCursus_IdCursus(Integer idCursus);

    List<Promotion> findByStatut(StatutPromotion statut);
}
