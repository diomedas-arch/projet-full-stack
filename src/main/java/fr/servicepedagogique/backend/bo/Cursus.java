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
@Table(name = "CURSUS", uniqueConstraints = @UniqueConstraint(columnNames = {"id_filiere", "titre"}))
public class Cursus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cursus")
    private Integer idCursus;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_filiere", nullable = false)
    private Filiere filiere;

    @Column(name = "titre", nullable = false, length = 150)
    private String titre;

    @Column(name = "niveau", length = 50)
    private String niveau;

    protected Cursus() {
    }

    public Cursus(Filiere filiere, String titre, String niveau) {
        this.filiere = filiere;
        this.titre = titre;
        this.niveau = niveau;
    }
}