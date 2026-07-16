package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Eleve;
import fr.servicepedagogique.backend.bo.InscriptionPromo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InscriptionPromoRepository extends JpaRepository<InscriptionPromo, Integer> {

    @Query("""
            select distinct eleve
            from InscriptionPromo ip
            join ip.eleve eleve
            join fetch eleve.utilisateur
            where ip.promotion.idPromotion = :idPromotion
              and ip.statut = fr.servicepedagogique.backend.bo.StatutInscription.VALIDEE
            order by eleve.utilisateur.email asc
            """)
    List<Eleve> findElevesValidesParPromotion(@Param("idPromotion") Integer idPromotion);
}
