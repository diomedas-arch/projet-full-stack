package fr.servicepedagogique.backend.bo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "FILIERE")
public class Filiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_filiere")
    private Integer idFiliere;

    @Column(name = "libelle", nullable = false, unique = true, length = 100)
    private String libelle;

    protected Filiere() {
    }

    public Filiere(String libelle) {
        this.libelle = libelle;
    }

    public Integer getIdFiliere() {
        return idFiliere;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }
}
