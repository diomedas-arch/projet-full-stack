package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.dto.espace.CalendrierCoursResponse;
import fr.servicepedagogique.backend.dto.espace.CoursFormateurResponse;
import fr.servicepedagogique.backend.dto.espace.EleveCoursResponse;
import fr.servicepedagogique.backend.dto.espace.PromotionResponse;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EspacePedagogiqueService {

    private static final String SQL_PROMOTIONS = """
            SELECT p.id_promotion, p.libelle, p.periode, p.statut,
                   c.id_cursus, c.titre AS titre_cursus, c.niveau,
                   f.id_filiere, f.libelle AS libelle_filiere
            FROM PROMOTION p
            INNER JOIN CURSUS c ON c.id_cursus = p.id_cursus
            INNER JOIN FILIERE f ON f.id_filiere = c.id_filiere
            ORDER BY p.libelle
            """;

    private static final String SQL_CALENDRIER_ELEVE = """
            SELECT type_inscription, promotion, code_cours, titre_cours,
                   date_debut, date_fin, salle, formateur_specialite
            FROM V_CALENDRIER_ELEVE
            WHERE LOWER(email) = LOWER(?)
            ORDER BY date_debut
            """;

    private static final String SQL_COURS_FORMATEUR = """
            SELECT cp.id_cours_planifie, c.code, c.titre, p.libelle AS promotion,
                   cp.date_debut, cp.date_fin, cp.salle, cp.statut
            FROM COURS_PLANIFIE cp
            INNER JOIN PROMOTION p ON p.id_promotion = cp.id_promotion
            INNER JOIN CURSUS_COURS cc ON cc.id_cursus_cours = cp.id_cursus_cours
            INNER JOIN COURS c ON c.id_cours = cc.id_cours
            INNER JOIN FORMATEUR f ON f.id_formateur = cp.id_formateur
            INNER JOIN UTILISATEUR u ON u.id_utilisateur = f.id_utilisateur
            WHERE LOWER(u.email) = LOWER(?)
              AND CAST(f.actif AS INT) = 1
            ORDER BY cp.date_debut
            """;

    private static final String SQL_ELEVES_COURS = """
            SELECT e.id_eleve, u.email, e.numero_dossier, e.telephone, 'PROMOTION' AS type_inscription
            FROM COURS_PLANIFIE cp
            INNER JOIN INSCRIPTION_PROMO ip
                    ON ip.id_promotion = cp.id_promotion AND ip.statut = 'VALIDEE'
            INNER JOIN ELEVE e ON e.id_eleve = ip.id_eleve
            INNER JOIN UTILISATEUR u ON u.id_utilisateur = e.id_utilisateur
            WHERE cp.id_cours_planifie = ?

            UNION

            SELECT e.id_eleve, u.email, e.numero_dossier, e.telephone, 'UNITE' AS type_inscription
            FROM INSCRIPTION_COURS ic
            INNER JOIN ELEVE e ON e.id_eleve = ic.id_eleve
            INNER JOIN UTILISATEUR u ON u.id_utilisateur = e.id_utilisateur
            WHERE ic.id_cours_planifie = ? AND ic.statut = 'VALIDEE'
            ORDER BY email
            """;

    private final JdbcTemplate jdbcTemplate;

    public EspacePedagogiqueService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> listerPromotions() {
        return jdbcTemplate.query(SQL_PROMOTIONS, (rs, rowNum) -> new PromotionResponse(
                rs.getInt("id_promotion"),
                rs.getString("libelle"),
                rs.getString("periode"),
                rs.getString("statut"),
                rs.getInt("id_cursus"),
                rs.getString("titre_cursus"),
                rs.getString("niveau"),
                rs.getInt("id_filiere"),
                rs.getString("libelle_filiere")
        ));
    }

    @Transactional(readOnly = true)
    public List<CalendrierCoursResponse> calendrierEleve(String email) {
        return jdbcTemplate.query(SQL_CALENDRIER_ELEVE, (rs, rowNum) -> new CalendrierCoursResponse(
                rs.getString("type_inscription"),
                rs.getString("promotion"),
                rs.getString("code_cours"),
                rs.getString("titre_cours"),
                dateHeure(rs.getTimestamp("date_debut")),
                dateHeure(rs.getTimestamp("date_fin")),
                rs.getString("salle"),
                rs.getString("formateur_specialite")
        ), email.trim());
    }

    @Transactional(readOnly = true)
    public List<CoursFormateurResponse> coursDuFormateur(String email) {
        List<CoursFormateurResponse> cours = jdbcTemplate.query(SQL_COURS_FORMATEUR, (rs, rowNum) ->
            new CoursFormateurResponse(
                    rs.getInt("id_cours_planifie"),
                    rs.getString("code"),
                    rs.getString("titre"),
                    rs.getString("promotion"),
                    dateHeure(rs.getTimestamp("date_debut")),
                    dateHeure(rs.getTimestamp("date_fin")),
                    rs.getString("salle"),
                    rs.getString("statut"),
                    List.of()
            ), email.trim());

        return cours.stream().map(coursPlanifie -> new CoursFormateurResponse(
                coursPlanifie.idCoursPlanifie(),
                coursPlanifie.codeCours(),
                coursPlanifie.titreCours(),
                coursPlanifie.promotion(),
                coursPlanifie.dateDebut(),
                coursPlanifie.dateFin(),
                coursPlanifie.salle(),
                coursPlanifie.statut(),
                listerEleves(coursPlanifie.idCoursPlanifie())
        )).toList();
    }

    private List<EleveCoursResponse> listerEleves(Integer idCoursPlanifie) {
        return jdbcTemplate.query(
                SQL_ELEVES_COURS,
                (rs, rowNum) -> new EleveCoursResponse(
                        rs.getInt("id_eleve"),
                        rs.getString("email"),
                        rs.getString("numero_dossier"),
                        rs.getString("telephone"),
                        rs.getString("type_inscription")
                ),
                idCoursPlanifie,
                idCoursPlanifie
        );
    }

    private LocalDateTime dateHeure(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }
}
