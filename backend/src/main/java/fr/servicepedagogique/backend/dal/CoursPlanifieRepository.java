package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.CoursPlanifie;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CoursPlanifieRepository extends JpaRepository<CoursPlanifie, Integer> {

    @Query("""
            select distinct cp
            from CoursPlanifie cp
            join fetch cp.promotion p
            join fetch p.cursus cursus
            join fetch cursus.filiere
            join fetch cp.cursusCours cc
            join fetch cc.cours
            left join fetch cp.formateur formateur
            left join fetch formateur.utilisateur
            where p.idPromotion = :idPromotion
            order by cp.dateDebut asc
            """)
    List<CoursPlanifie> findByPromotionIdAvecDetails(@Param("idPromotion") Integer idPromotion);

    @Query("""
            select distinct cp
            from CoursPlanifie cp
            join fetch cp.promotion p
            join fetch p.cursus cursus
            join fetch cursus.filiere
            join fetch cp.cursusCours cc
            join fetch cc.cours
            left join fetch cp.formateur formateur
            left join fetch formateur.utilisateur
            join InscriptionPromo ip on ip.promotion = p
            where ip.eleve.idEleve = :idEleve
              and ip.statut = fr.servicepedagogique.backend.bo.StatutInscription.VALIDEE
            order by cp.dateDebut asc
            """)
    List<CoursPlanifie> findCalendrierPromotionParEleve(@Param("idEleve") Integer idEleve);

    @Query("""
            select distinct cp
            from CoursPlanifie cp
            join fetch cp.promotion p
            join fetch p.cursus cursus
            join fetch cursus.filiere
            join fetch cp.cursusCours cc
            join fetch cc.cours
            left join fetch cp.formateur formateur
            left join fetch formateur.utilisateur
            join InscriptionCours ic on ic.coursPlanifie = cp
            where ic.eleve.idEleve = :idEleve
              and ic.statut = fr.servicepedagogique.backend.bo.StatutInscription.VALIDEE
            order by cp.dateDebut asc
            """)
    List<CoursPlanifie> findCalendrierUniteParEleve(@Param("idEleve") Integer idEleve);

    @Query("""
            select distinct cp
            from CoursPlanifie cp
            join fetch cp.promotion p
            join fetch p.cursus cursus
            join fetch cursus.filiere
            join fetch cp.cursusCours cc
            join fetch cc.cours
            left join fetch cp.formateur formateur
            left join fetch formateur.utilisateur
            where formateur.idFormateur = :idFormateur
            order by cp.dateDebut asc
            """)
    List<CoursPlanifie> findCoursParFormateur(@Param("idFormateur") Integer idFormateur);
}
