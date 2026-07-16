package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Formateur;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FormateurRepository extends JpaRepository<Formateur, Integer> {

    Optional<Formateur> findByUtilisateurIdUtilisateur(Integer idUtilisateur);

    @Query("""
            select f
            from Formateur f
            left join fetch f.utilisateur u
            where (:actif is null or f.actif = :actif)
            order by u.email asc, f.specialite asc, f.idFormateur asc
            """)
    List<Formateur> findDisponibles(@Param("actif") Boolean actif);
}
