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
@Table(name = "CURSUS_COURS")
public class CursusCours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cursus_cours")
    private Integer idCursusCours;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cursus", nullable = false)
    private Cursus cursus;

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

    public Integer getIdCursusCours() {
        return idCursusCours;
    }

    public Cursus getCursus() {
        return cursus;
    }

    public void setCursus(Cursus cursus) {
        this.cursus = cursus;
    }

    public Cours getCours() {
        return cours;
    }

    public void setCours(Cours cours) {
        this.cours = cours;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }

    public String getPrerequis() {
        return prerequis;
    }

    public void setPrerequis(String prerequis) {
        this.prerequis = prerequis;
    }

    public boolean isObligatoire() {
        return obligatoire;
    }

    public void setObligatoire(boolean obligatoire) {
        this.obligatoire = obligatoire;
    }
}
