package fr.servicepedagogique.backend.dto.formateur;

import fr.servicepedagogique.backend.dto.planning.CoursPlanifieResponse;
import java.util.List;

public record CoursFormateurResponse(
        CoursPlanifieResponse cours,
        List<EleveConcerneResponse> eleves
) {
}
