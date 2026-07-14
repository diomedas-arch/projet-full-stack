package fr.servicepedagogique.backend.bo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "CURSUS")
public class Cursus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cursus")
    private Integer idCursus;

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

    public Integer getIdCursus() {
        return idCursus;
    }

    public Filiere getFiliere() {
        return filiere;
    }

    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }
}
