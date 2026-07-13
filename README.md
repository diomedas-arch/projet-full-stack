# Backend - Architecture MVC / BO / BLL / DAL

Le backend suit une organisation classique par couches.

## Structure

```text
fr.servicepedagogique.backend
+-- bo          # Objets metier persistes en base
+-- bll         # Logique metier
+-- controller  # Controleurs REST, couche MVC/API
+-- dal         # Acces aux donnees
+-- dto         # Objets echanges avec l'API
+-- exception   # Gestion centralisee des erreurs
+-- security    # Securite, JWT et configuration Spring Security
```

## Role des couches

- `bo` contient les classes metier, par exemple `Utilisateur`.
- `dal` contient les interfaces d'acces aux donnees, par exemple `UtilisateurRepository`.
- `bll` contient les regles metier, par exemple creation d'utilisateur, controle de l'unicite de l'email et hashage du mot de passe.
- `controller` expose les routes HTTP de l'API.
- `dto` evite d'exposer directement les objets metier dans les requetes et les reponses.
- `security` gere l'authentification JWT et les droits d'acces.
- `exception` uniformise les messages d'erreur de l'API.

## Flux type

```text
Requete HTTP
    -> Controller
        -> BLL / Service metier
            -> DAL / Repository
                -> Base de donnees
```

La table SQL `UTILISATEUR` reste inchangee. Le code Java s'adapte a sa structure.
