package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Eleve;
import fr.servicepedagogique.backend.bo.InscriptionCours;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InscriptionCoursRepository extends JpaRepository<InscriptionCours, Integer> {

    @Query("""
            select distinct eleve
            from InscriptionCours ic
            join ic.eleve eleve
            join fetch eleve.utilisateur
            where ic.coursPlanifie.idCoursPlanifie = :idCoursPlanifie
              and ic.statut = fr.servicepedagogique.backend.bo.StatutInscription.VALIDEE
            order by eleve.utilisateur.email asc
            """)
    List<Eleve> findElevesValidesParCoursPlanifie(@Param("idCoursPlanifie") Integer idCoursPlanifie);
}
