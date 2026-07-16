package fr.servicepedagogique.backend.bo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PROMOTION")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promotion")
    private Integer idPromotion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cursus", nullable = false)
    private Cursus cursus;

    @Column(name = "libelle", nullable = false, unique = true, length = 150)
    private String libelle;

    @Column(name = "periode", nullable = false, length = 100)
    private String periode;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false, length = 20)
    private StatutPromotion statut = StatutPromotion.PLANIFIEE;

    protected Promotion() {
    }

    public Promotion(Cursus cursus, String libelle, String periode, StatutPromotion statut) {
        this.cursus = cursus;
        this.libelle = libelle;
        this.periode = periode;
        this.statut = statut;
    }

    public Integer getIdPromotion() {
        return idPromotion;
    }

    public Cursus getCursus() {
        return cursus;
    }

    public void setCursus(Cursus cursus) {
        this.cursus = cursus;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getPeriode() {
        return periode;
    }

    public void setPeriode(String periode) {
        this.periode = periode;
    }

    public StatutPromotion getStatut() {
        return statut;
    }

    public void setStatut(StatutPromotion statut) {
        this.statut = statut;
    }
}
