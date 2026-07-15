package fr.servicepedagogique.backend.bo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "PROMOTION")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promotion")
    private Integer idPromotion;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cursus", nullable = false)
    private Cursus cursus;

    @Column(name = "libelle", nullable = false, length = 150, unique = true)
    private String libelle;

    @Column(name = "periode", nullable = false, length = 100)
    private String periode;

    @Column(name = "statut", nullable = false, length = 20)
    private String statut;

    protected Promotion() {
    }

    public Promotion(Cursus cursus, String libelle, String periode, String statut) {
        this.cursus = cursus;
        this.libelle = libelle;
        this.periode = periode;
        this.statut = statut;
    }
}