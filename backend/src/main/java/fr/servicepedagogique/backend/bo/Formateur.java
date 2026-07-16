package fr.servicepedagogique.backend.bo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "FORMATEUR")
public class Formateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_formateur")
    private Integer idFormateur;

    @OneToOne(fetch = FetchType.EAGER)
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

    public Integer getIdFormateur() {
        return idFormateur;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public boolean isActif() {
        return actif;
    }

    public void setActif(boolean actif) {
        this.actif = actif;
    }
}
