package fr.servicepedagogique.backend.bo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "COURS")
public class Cours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cours")
    private Integer idCours;

    @Column(name = "code", nullable = false, length = 30, unique = true)
    private String code;

    @Column(name = "titre", nullable = false, length = 150)
    private String titre;

    protected Cours() {
    }

    public Cours(String code, String titre) {
        this.code = code;
        this.titre = titre;
    }
}
