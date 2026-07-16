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
import java.time.LocalDateTime;

@Entity
@Table(name = "COURS_PLANIFIE")
public class CoursPlanifie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cours_planifie")
    private Integer idCoursPlanifie;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_promotion", nullable = false)
    private Promotion promotion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cursus_cours", nullable = false)
    private CursusCours cursusCours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_formateur")
    private Formateur formateur;

    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDateTime dateFin;

    @Column(name = "salle", length = 100)
    private String salle;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false, length = 20)
    private StatutCoursPlanifie statut = StatutCoursPlanifie.PLANIFIE;

    protected CoursPlanifie() {
    }

    public CoursPlanifie(
            Promotion promotion,
            CursusCours cursusCours,
            Formateur formateur,
            LocalDateTime dateDebut,
            LocalDateTime dateFin,
            String salle,
            StatutCoursPlanifie statut
    ) {
        this.promotion = promotion;
        this.cursusCours = cursusCours;
        this.formateur = formateur;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.salle = salle;
        this.statut = statut;
    }

    public Integer getIdCoursPlanifie() {
        return idCoursPlanifie;
    }

    public Promotion getPromotion() {
        return promotion;
    }

    public void setPromotion(Promotion promotion) {
        this.promotion = promotion;
    }

    public CursusCours getCursusCours() {
        return cursusCours;
    }

    public void setCursusCours(CursusCours cursusCours) {
        this.cursusCours = cursusCours;
    }

    public Formateur getFormateur() {
        return formateur;
    }

    public void setFormateur(Formateur formateur) {
        this.formateur = formateur;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public String getSalle() {
        return salle;
    }

    public void setSalle(String salle) {
        this.salle = salle;
    }

    public StatutCoursPlanifie getStatut() {
        return statut;
    }

    public void setStatut(StatutCoursPlanifie statut) {
        this.statut = statut;
    }
}
