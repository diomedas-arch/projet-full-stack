package fr.servicepedagogique.backend.bll;

import static org.assertj.core.api.Assertions.assertThat;

import fr.servicepedagogique.backend.dto.espace.CalendrierCoursResponse;
import fr.servicepedagogique.backend.dto.espace.CoursFormateurResponse;
import fr.servicepedagogique.backend.dto.espace.PromotionResponse;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

@JdbcTest
@Import(EspacePedagogiqueService.class)
class EspacePedagogiqueServiceTests {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private EspacePedagogiqueService service;

    @BeforeEach
    void preparerBase() {
        jdbcTemplate.execute("DROP ALL OBJECTS");
        jdbcTemplate.execute("CREATE TABLE UTILISATEUR (id_utilisateur INT PRIMARY KEY, email VARCHAR(255), mot_de_passe_hash VARCHAR(255), role VARCHAR(30), statut VARCHAR(20))");
        jdbcTemplate.execute("CREATE TABLE FILIERE (id_filiere INT PRIMARY KEY, libelle VARCHAR(100))");
        jdbcTemplate.execute("CREATE TABLE CURSUS (id_cursus INT PRIMARY KEY, id_filiere INT, titre VARCHAR(150), niveau VARCHAR(50))");
        jdbcTemplate.execute("CREATE TABLE COURS (id_cours INT PRIMARY KEY, code VARCHAR(30), titre VARCHAR(150))");
        jdbcTemplate.execute("CREATE TABLE ELEVE (id_eleve INT PRIMARY KEY, id_utilisateur INT, numero_dossier VARCHAR(50), telephone VARCHAR(30))");
        jdbcTemplate.execute("CREATE TABLE FORMATEUR (id_formateur INT PRIMARY KEY, id_utilisateur INT, specialite VARCHAR(150), actif BIT)");
        jdbcTemplate.execute("CREATE TABLE CURSUS_COURS (id_cursus_cours INT PRIMARY KEY, id_cursus INT, id_cours INT, ordre INT, prerequis VARCHAR(255), obligatoire BIT)");
        jdbcTemplate.execute("CREATE TABLE PROMOTION (id_promotion INT PRIMARY KEY, id_cursus INT, libelle VARCHAR(150), periode VARCHAR(100), statut VARCHAR(20))");
        jdbcTemplate.execute("CREATE TABLE COURS_PLANIFIE (id_cours_planifie INT PRIMARY KEY, id_promotion INT, id_cursus_cours INT, id_formateur INT, date_debut TIMESTAMP, date_fin TIMESTAMP, salle VARCHAR(100), statut VARCHAR(20))");
        jdbcTemplate.execute("CREATE TABLE INSCRIPTION_PROMO (id_inscription_promo INT PRIMARY KEY, id_eleve INT, id_promotion INT, date_inscription TIMESTAMP, statut VARCHAR(20))");
        jdbcTemplate.execute("CREATE TABLE INSCRIPTION_COURS (id_inscription_cours INT PRIMARY KEY, id_eleve INT, id_cours_planifie INT, date_inscription TIMESTAMP, forcee BIT, motif_forcage VARCHAR(500), statut VARCHAR(20))");

        jdbcTemplate.execute("INSERT INTO UTILISATEUR VALUES (1, 'eleve@test.fr', 'hash', 'ROLE_ELEVE', 'ACTIF')");
        jdbcTemplate.execute("INSERT INTO UTILISATEUR VALUES (2, 'formateur@test.fr', 'hash', 'ROLE_FORMATEUR', 'ACTIF')");
        jdbcTemplate.execute("INSERT INTO FILIERE VALUES (1, 'Développement')");
        jdbcTemplate.execute("INSERT INTO CURSUS VALUES (1, 1, 'Développeur Java', 'Niveau 6')");
        jdbcTemplate.execute("INSERT INTO COURS VALUES (1, 'JAVA', 'Java orienté objet')");
        jdbcTemplate.execute("INSERT INTO ELEVE VALUES (1, 1, 'DOS-001', '0600000000')");
        jdbcTemplate.execute("INSERT INTO FORMATEUR VALUES (1, 2, 'Java', 1)");
        jdbcTemplate.execute("INSERT INTO CURSUS_COURS VALUES (1, 1, 1, 1, NULL, 1)");
        jdbcTemplate.execute("INSERT INTO PROMOTION VALUES (1, 1, 'Promo Java 2026', '2026', 'EN_COURS')");
        jdbcTemplate.execute("INSERT INTO COURS_PLANIFIE VALUES (1, 1, 1, 1, '2026-07-20 09:00:00', '2026-07-20 17:00:00', 'Salle 101', 'PLANIFIE')");
        jdbcTemplate.execute("INSERT INTO INSCRIPTION_PROMO VALUES (1, 1, 1, CURRENT_TIMESTAMP, 'VALIDEE')");

        jdbcTemplate.execute("""
                CREATE VIEW V_CALENDRIER_ELEVE AS
                SELECT e.id_eleve, u.email, 'PROMOTION' AS type_inscription,
                       p.libelle AS promotion, c.code AS code_cours, c.titre AS titre_cours,
                       cp.date_debut, cp.date_fin, cp.salle, f.specialite AS formateur_specialite
                FROM ELEVE e
                INNER JOIN UTILISATEUR u ON u.id_utilisateur = e.id_utilisateur
                INNER JOIN INSCRIPTION_PROMO ip ON ip.id_eleve = e.id_eleve
                INNER JOIN PROMOTION p ON p.id_promotion = ip.id_promotion
                INNER JOIN COURS_PLANIFIE cp ON cp.id_promotion = p.id_promotion
                INNER JOIN CURSUS_COURS cc ON cc.id_cursus_cours = cp.id_cursus_cours
                INNER JOIN COURS c ON c.id_cours = cc.id_cours
                LEFT JOIN FORMATEUR f ON f.id_formateur = cp.id_formateur
                WHERE ip.statut = 'VALIDEE'
                """);
    }

    @Test
    void retournePromotionsCalendrierEtCoursFormateur() {
        List<PromotionResponse> promotions = service.listerPromotions();
        List<CalendrierCoursResponse> calendrier = service.calendrierEleve("eleve@test.fr");
        List<CoursFormateurResponse> cours = service.coursDuFormateur("formateur@test.fr");

        assertThat(promotions).singleElement().satisfies(promotion -> {
            assertThat(promotion.libelle()).isEqualTo("Promo Java 2026");
            assertThat(promotion.libelleFiliere()).isEqualTo("Développement");
        });
        assertThat(calendrier).singleElement().satisfies(element -> {
            assertThat(element.codeCours()).isEqualTo("JAVA");
            assertThat(element.salle()).isEqualTo("Salle 101");
        });
        assertThat(cours).singleElement().satisfies(element -> {
            assertThat(element.titreCours()).isEqualTo("Java orienté objet");
            assertThat(element.eleves()).singleElement().satisfies(eleve ->
                    assertThat(eleve.email()).isEqualTo("eleve@test.fr")
            );
        });
    }
}
