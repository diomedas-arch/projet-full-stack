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

## Interface Angular servie par Spring Boot

Le projet reste une application Spring Boot unique. Il n'y a pas de projet frontend séparé.

- Les pages se trouvent dans `src/main/resources/static`.
- Les contrôleurs et services Angular se trouvent dans `src/main/resources/static/js/angular`.
- AngularJS 1.8.3 est fourni par un WebJar Java et servi par Spring Boot sous `/webjars/**`.
- Le navigateur appelle directement les routes REST `/api/**` du même serveur.
- Le Tomcat intégré sert donc à la fois l'interface et le backend sur le port 8080.

### Pages par rôle

- `ROLE_ADMIN` : accueil, utilisateurs, filières, cursus et promotions.
- `ROLE_REFERENTE` : accueil, filières, cursus et promotions.
- `ROLE_ELEVE` : calendrier personnel et promotions, en lecture seule.
- `ROLE_FORMATEUR` : cours affectés, élèves inscrits et promotions, en lecture seule.

### Exécution

Depuis le dossier `backend` :

```powershell
.\gradlew.bat bootRun
```

Puis ouvrir `http://localhost:8080`.
