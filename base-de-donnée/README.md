# Base de données

Ce dossier contient le script SQL Server du projet.

Le fichier `create_service_pedagogique_sql_server.sql` conserve la table `UTILISATEUR` telle qu'elle est prévue dans le modèle initial :

- `id_utilisateur`
- `email`
- `mot_de_passe_hash`
- `role`
- `statut`

Le code backend de gestion utilisateur est aligné sur cette structure.

## Mot de passe utilisateur

Pour tester la connexion, la colonne `mot_de_passe_hash` doit contenir un hash BCrypt, pas le mot de passe en clair.
