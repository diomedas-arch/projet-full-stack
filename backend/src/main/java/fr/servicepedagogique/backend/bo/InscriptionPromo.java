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
@Table(name = "INSCRIPTION_PROMO")
public class InscriptionPromo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inscription_promo")
    private Integer idInscriptionPromo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_eleve", nullable = false)
    private Eleve eleve;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_promotion", nullable = false)
    private Promotion promotion;

    @Column(name = "date_inscription", nullable = false)
    private LocalDateTime dateInscription;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false, length = 20)
    private StatutInscription statut = StatutInscription.VALIDEE;

    protected InscriptionPromo() {
    }

    public Integer getIdInscriptionPromo() {
        return idInscriptionPromo;
    }

    public Eleve getEleve() {
        return eleve;
    }

    public Promotion getPromotion() {
        return promotion;
    }

    public LocalDateTime getDateInscription() {
        return dateInscription;
    }

    public StatutInscription getStatut() {
        return statut;
    }
}
