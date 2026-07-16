package fr.servicepedagogique.backend.dto.promotion;

import fr.servicepedagogique.backend.dto.planning.CoursPlanifieResponse;
import java.util.List;

public record PromotionDetailResponse(
        PromotionResponse promotion,
        List<CoursPlanifieResponse> cours
) {
}
