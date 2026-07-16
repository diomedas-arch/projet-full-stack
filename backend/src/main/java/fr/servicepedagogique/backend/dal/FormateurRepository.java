package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Formateur;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormateurRepository extends JpaRepository<Formateur, Integer> {

    Optional<Formateur> findByUtilisateurIdUtilisateur(Integer idUtilisateur);
}
