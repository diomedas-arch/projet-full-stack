package fr.servicepedagogique.backend.bll;

import fr.servicepedagogique.backend.bo.Cours;
import fr.servicepedagogique.backend.dal.CoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CoursService {

    private final CoursRepository coursRepository;

    public List<Cours> findAll() {
        return coursRepository.findAll();
    }

    public Optional<Cours> findById(Integer id) {
        return coursRepository.findById(id);
    }

    public Cours create(Cours cours) {
        if (coursRepository.existsByCode(cours.getCode())) {
            throw new IllegalArgumentException("Un cours avec ce code existe déjà : " + cours.getCode());
        }
        return coursRepository.save(cours);
    }

    public Cours update(Integer id, Cours coursMaj) {
        Cours existant = coursRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cours introuvable : " + id));
        existant.setCode(coursMaj.getCode());
        existant.setTitre(coursMaj.getTitre());
        return coursRepository.save(existant);
    }

    public void delete(Integer id) {
        coursRepository.deleteById(id);
    }
}