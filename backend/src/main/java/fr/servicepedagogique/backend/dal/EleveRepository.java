package fr.servicepedagogique.backend.dal;

import fr.servicepedagogique.backend.bo.Eleve;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EleveRepository extends JpaRepository<Eleve, Integer> {

    Optional<Eleve> findByUtilisateurIdUtilisateur(Integer idUtilisateur);

    Optional<Eleve> findByNumeroDossier(String numeroDossier);
}
