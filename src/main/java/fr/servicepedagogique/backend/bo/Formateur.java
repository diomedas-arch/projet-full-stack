package fr.servicepedagogique.backend.bo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// TODO MERGE : entité placeholder minimale créée par Allan pour permettre la compilation de Promotion/CoursPlanifie.
// Implémentation complète (Service/Controller/DTO) pas encore assignée à ce jour — à compléter plus tard.
// Vérifier la cohérence des champs et des annotations avant de merger.
@Entity
@Getter
@Setter
@ToString
@Table(name = "FORMATEUR")
public class Formateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_formateur")
    private Integer idFormateur;

    @ToString.Exclude
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilisateur", unique = true)
    private Utilisateur utilisateur;

    @Column(name = "specialite", length = 150)
    private String specialite;

    @Column(name = "actif", nullable = false)
    private boolean actif = true;

    protected Formateur() {
    }

    public Formateur(Utilisateur utilisateur, String specialite, boolean actif) {
        this.utilisateur = utilisateur;
        this.specialite = specialite;
        this.actif = actif;
    }
}