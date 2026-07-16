# Gestion pedagogique

Application full-stack de gestion pedagogique composee d'un backend Spring Boot, d'une SPA Angular et d'une base SQL Server.

## Prerequis

- Java 21.
- Node.js et npm.
- SQL Server accessible localement ou sur le reseau.
- Un secret JWT fourni par variable d'environnement en production.

## Base de donnees

Le script SQL Server du depot se trouve dans `base-de-donnée/`.

1. Creer la base SQL Server cible.
2. Executer le script du depot dans SQL Server Management Studio, Azure Data Studio ou un outil equivalent.
3. Configurer les variables d'environnement du backend.

## Configuration

Le backend lit ces variables :

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
JWT_SECRET
JWT_EXPIRATION_MINUTES
```

Ne stockez pas de vraie valeur de secret dans le depot. Les valeurs par defaut de `application.properties` servent uniquement au developpement local.

## Lancement en developpement

Backend :

```bash
cd backend
./gradlew bootRun
```

Sous Windows :

```powershell
cd backend
.\gradlew.bat bootRun
```

Frontend :

```bash
cd frontend/gestionPedagogique
npm ci
npm start
```

Angular sert l'application en developpement et utilise `proxy.conf.json` pour rediriger `/api` vers `http://localhost:8080`.

## Build production

Le backend contient des taches Gradle qui executent le build Angular puis copient le resultat dans les ressources statiques du jar Spring Boot.

```bash
cd backend
./gradlew clean bootJar
```

Sous Windows :

```powershell
cd backend
.\gradlew.bat clean bootJar
```

Pour executer rapidement les tests backend sans reconstruire Angular :

```bash
cd backend
./gradlew test -PskipFrontend
```

Le jar produit sert ensuite `index.html` et les assets Angular. Les routes SPA sont renvoyees vers Angular sans intercepter `/api/**`.

## Tests

Frontend :

```bash
cd frontend/gestionPedagogique
npm ci
npm run build
npm test -- --watch=false
```

Backend :

```bash
cd backend
./gradlew test
```

Sous Windows, remplacer `./gradlew` par `.\gradlew.bat`.

## Architecture

```text
backend/
  src/main/java/fr/servicepedagogique/backend/
    bo/          entites metier
    bll/         services metier
    controller/  API REST et fallback SPA
    dal/         repositories JPA
    dto/         contrats API
    exception/   gestion d'erreurs
    security/    JWT et droits

frontend/gestionPedagogique/
  src/app/
    core/        auth, interceptors, modeles et services transverses
    features/    ecrans applicatifs
    shared/      composants reutilisables
    testing/     helpers de tests Angular

docs/legacy-ui/
  ancienne interface HTML/CSS/JS conservee comme reference de migration
```

## Roles et droits

- `ROLE_ADMIN` : administration complete, utilisateurs, eleves, filieres, cursus, cours, promotions et cours planifies.
- `ROLE_REFERENTE` : gestion pedagogique hors administration globale des utilisateurs.
- `ROLE_ELEVE` : acces a l'accueil et au calendrier eleve.
- `ROLE_FORMATEUR` : acces a l'accueil et aux cours du formateur.

Le frontend masque les actions non autorisees et les guards bloquent les routes protegees. Le backend reste l'autorite finale via `SecurityConfig`.

## Validation visuelle

Pour verifier la parite avec l'interface historique :

1. Lancer le backend et le frontend Angular.
2. Comparer desktop et mobile avec les fichiers conserves dans `docs/legacy-ui/`.
3. Verifier le login, la sidebar, le menu mobile, l'accueil, les listes, les formulaires, les etats vides, les erreurs et les confirmations.
4. Tester au moins un compte par role.
5. En production, rafraichir directement une route Angular comme `/promotions` ou `/cours-planifies`.

## Notes de migration

La migration Angular retire les donnees temporaires du formulaire de cours planifies. Les cours d'un cursus et les formateurs disponibles sont lus via l'API backend. Les formulaires utilisateur et eleve n'utilisent plus de mot de passe automatique : le mot de passe est obligatoire en creation et facultatif en modification.
