package fr.servicepedagogique.backend.bo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "COURS_PLANIFIE", uniqueConstraints = @UniqueConstraint(columnNames = {"id_promotion", "id_cursus_cours"}))
public class CoursPlanifie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cours_planifie")
    private Integer idCoursPlanifie;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_promotion", nullable = false)
    private Promotion promotion;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cursus_cours", nullable = false)
    private CursusCours cursusCours;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_formateur")
    private Formateur formateur;

    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDateTime dateFin;

    @Column(name = "salle", length = 100)
    private String salle;

    @Column(name = "statut", nullable = false, length = 20)
    private String statut;

    protected CoursPlanifie() {
    }

    public CoursPlanifie(
            Promotion promotion,
            CursusCours cursusCours,
            Formateur formateur,
            LocalDateTime dateDebut,
            LocalDateTime dateFin,
            String salle,
            String statut
    ) {
        this.promotion = promotion;
        this.cursusCours = cursusCours;
        this.formateur = formateur;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.salle = salle;
        this.statut = statut;
    }
}