# Statut de migration Angular

| Ancienne page | Route Angular | Fonctionnalites attendues | Etat final | Tests associes |
| --- | --- | --- | --- | --- |
| `login.html` | `/login` | Connexion, validation, erreurs, session expiree, URL de retour | Porte dans un ecran Angular sans shell | `auth.service.spec.ts`, `auth.guard.spec.ts`, `api-error.interceptor.spec.ts` |
| `accueil.html` | `/accueil` | Bienvenue, compteurs, cursus recents, actions rapides par role | Porte avec chargement, erreur, vide et actions filtrees | Build Angular, tests auth/guards |
| `filieres.html` | `/filieres` | Liste, recherche, compteur, creation, modification, validation | Porte en Angular standalone avec etats de liste | Build Angular |
| `cursus.html` | `/cursus` | Liste, recherche, filtre filiere, compteur, creation, modification | Porte avec filtre filiere et modeles nullable alignes | `cursus-cours.service.spec.ts`, build Angular |
| `promotions.html` | `/promotions` | Liste, filtres, droits par role, suppression | Porte, actions de gestion reservees aux roles autorises | Specs de montage `promotion-list`, build Angular |
| `promotion-detail.html` | `/promotions/:id` | Detail promotion, cours planifies, actions autorisees | Porte avec masquage des actions non autorisees | Specs de montage `promotion-detail`, build Angular |
| Pages promotion creation/modification | `/promotions/nouveau`, `/promotions/:id/modifier` | Creation, modification, validation, annulation | Fonctionnalites Angular conservees et stabilisees | Specs de montage `promotion-form`, build Angular |
| `eleves.html` et `eleve-form.html` | `/eleves`, `/eleves/nouveau`, `/eleves/:id/modifier` | Liste, recherche, CRUD, mot de passe facultatif en edition | Porte sans mot de passe par defaut, PATCH mot de passe ajoute | `eleve.service.spec.ts`, build Angular |
| `utilisateurs.html` et `utilisateur-form.html` | `/utilisateurs`, `/utilisateurs/nouveau`, `/utilisateurs/:id/modifier` | Liste, recherche, CRUD, roles/statuts, mot de passe facultatif en edition | Porte sans mot de passe par defaut, PATCH mot de passe ajoute | `utilisateur.service.spec.ts`, build Angular |
| `calendrier.html` | `/mon-calendrier` | Planning eleve par role | Route conservee et protegee pour `ROLE_ELEVE` | `auth.guard.spec.ts`, build Angular |
| `formateur-cours.html` | `/mes-cours` | Cours du formateur par role | Route conservee et protegee pour `ROLE_FORMATEUR` | `auth.guard.spec.ts`, build Angular |
| Cours Angular existants | `/cours`, `/cours/nouveau`, `/cours/:id`, `/cours/:id/modifier` | Liste, detail, creation, modification, suppression | Fonctionnalites conservees avec shell migre | Specs de montage cours, build Angular |
| Cours planifies Angular existants | `/cours-planifies`, `/cours-planifies/nouveau`, `/cours-planifies/:id/modifier` | Liste, creation, modification, suppression, formateur nullable, salle nullable | Donnees temporaires supprimees, chargement via API backend | `cursus-cours.service.spec.ts`, `formateur.service.spec.ts`, specs de montage, tests backend |
| Static Spring historique | `docs/legacy-ui/` | Reference visuelle et fonctionnelle | Retiree de la production, conservee en documentation | Verification de statut Git et build backend |

## Endpoints ajoutes pour supprimer les donnees temporaires

| Endpoint | Roles | Etat | Tests |
| --- | --- | --- | --- |
| `GET /api/cursus/{idCursus}/cours` | `ROLE_ADMIN`, `ROLE_REFERENTE` | Ajoute avec DTO, service, repository et 404 si cursus absent | `CatalogueLectureControllerTests` |
| `GET /api/formateurs?actif=true` | `ROLE_ADMIN`, `ROLE_REFERENTE` | Ajoute avec DTO nullable-safe et tri stable | `CatalogueLectureControllerTests` |

## Validations executees

- Build Angular via Angular CLI local : reussi.
- Tests Angular Karma/Chrome headless : 26 tests, 26 succes.
- Tests backend Gradle avec `-PskipFrontend` : reussis.

L'environnement courant ne fournit pas de commande `npm` dans le `PATH`; les validations frontend ont donc ete executees avec le binaire Node disponible et le CLI Angular local du projet.
