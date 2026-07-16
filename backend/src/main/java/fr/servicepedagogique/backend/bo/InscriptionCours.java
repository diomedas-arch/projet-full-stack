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
@Table(name = "INSCRIPTION_COURS")
public class InscriptionCours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inscription_cours")
    private Integer idInscriptionCours;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_eleve", nullable = false)
    private Eleve eleve;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cours_planifie", nullable = false)
    private CoursPlanifie coursPlanifie;

    @Column(name = "date_inscription", nullable = false)
    private LocalDateTime dateInscription;

    @Column(name = "forcee", nullable = false)
    private boolean forcee;

    @Column(name = "motif_forcage", length = 500)
    private String motifForcage;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false, length = 20)
    private StatutInscription statut = StatutInscription.VALIDEE;

    protected InscriptionCours() {
    }

    public Integer getIdInscriptionCours() {
        return idInscriptionCours;
    }

    public Eleve getEleve() {
        return eleve;
    }

    public CoursPlanifie getCoursPlanifie() {
        return coursPlanifie;
    }

    public LocalDateTime getDateInscription() {
        return dateInscription;
    }

    public boolean isForcee() {
        return forcee;
    }

    public String getMotifForcage() {
        return motifForcage;
    }

    public StatutInscription getStatut() {
        return statut;
    }
}
