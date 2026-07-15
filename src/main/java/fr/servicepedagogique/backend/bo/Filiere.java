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
@Table(name = "FILIERE")
public class Filiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_filiere")
    private Integer idFiliere;

    @Column(name = "libelle", nullable = false, length = 100, unique = true)
    private String libelle;

    protected Filiere() {
    }

    public Filiere(String libelle) {
        this.libelle = libelle;
    }
}
