package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.CursusCours;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CursusCoursRepository extends JpaRepository<CursusCours, Integer> {

    @Query("""
            select cc
            from CursusCours cc
            join fetch cc.cursus cursus
            join fetch cc.cours cours
            where cursus.idCursus = :idCursus
            order by cc.ordre asc, cours.code asc
            """)
    List<CursusCours> findByCursusIdAvecCours(@Param("idCursus") Integer idCursus);
}
