package fr.servicepedagogique.backend.bo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// TODO MERGE : entité placeholder minimale créée par Allan pour permettre la compilation de Promotion/CoursPlanifie.
// À remplacer/fusionner avec l'implémentation complète de Sasha (branche cursus-filiere).
// Vérifier la cohérence des champs et des annotations avant de merger.
@Entity
@Getter
@Setter
@ToString
@Table(name = "CURSUS_COURS", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_cursus", "id_cours"}),
        @UniqueConstraint(columnNames = {"id_cursus", "ordre"})
})
public class CursusCours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cursus_cours")
    private Integer idCursusCours;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cursus", nullable = false)
    private Cursus cursus;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cours", nullable = false)
    private Cours cours;

    @Column(name = "ordre", nullable = false)
    private Integer ordre;

    @Column(name = "prerequis", length = 255)
    private String prerequis;

    @Column(name = "obligatoire", nullable = false)
    private boolean obligatoire = true;

    protected CursusCours() {
    }

    public CursusCours(Cursus cursus, Cours cours, Integer ordre, String prerequis, boolean obligatoire) {
        this.cursus = cursus;
        this.cours = cours;
        this.ordre = ordre;
        this.prerequis = prerequis;
        this.obligatoire = obligatoire;
    }
}