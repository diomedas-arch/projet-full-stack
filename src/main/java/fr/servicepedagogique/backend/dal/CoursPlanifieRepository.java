package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import fr.servicepedagogique.backend.bo.CursusCours;
import fr.servicepedagogique.backend.bo.Promotion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoursPlanifieRepository extends JpaRepository<CoursPlanifie, Integer> {

    boolean existsByPromotionAndCursusCours(Promotion promotion, CursusCours cursusCours);

    List<CoursPlanifie> findByPromotion_IdPromotion(Integer idPromotion);

    List<CoursPlanifie> findByFormateur_IdFormateur(Integer idFormateur);

    List<CoursPlanifie> findByStatut(String statut);
}