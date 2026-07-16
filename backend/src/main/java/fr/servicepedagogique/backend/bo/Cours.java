package fr.servicepedagogique.backend.bo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "COURS")
public class Cours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cours")
    private Integer idCours;

    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "titre", nullable = false, length = 150)
    private String titre;

    protected Cours() {
    }

    public Cours(String code, String titre) {
        this.code = code;
        this.titre = titre;
    }

    public Integer getIdCours() {
        return idCours;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }
}
