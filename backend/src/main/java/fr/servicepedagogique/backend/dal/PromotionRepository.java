package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Promotion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, Integer> {

    List<Promotion> findAllByOrderByLibelleAsc();
}
