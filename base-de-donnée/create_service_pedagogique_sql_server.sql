/* ============================================================
   Base de données : ServicePedagogiqueDB
   SGBD : SQL Server
   À exécuter dans SQL Server Management Studio ou Azure Data Studio
   ============================================================ */

IF DB_ID(N'ServicePedagogiqueDB') IS NULL
BEGIN
    CREATE DATABASE ServicePedagogiqueDB;
END
GO

USE ServicePedagogiqueDB;
GO

/* ============================================================
   1. Tables principales
   ============================================================ */

CREATE TABLE UTILISATEUR (
    id_utilisateur INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL,
    mot_de_passe_hash NVARCHAR(255) NOT NULL, -- nécessaire pour l'authentification
    role NVARCHAR(30) NOT NULL,
    statut NVARCHAR(20) NOT NULL CONSTRAINT DF_UTILISATEUR_statut DEFAULT 'ACTIF',

    CONSTRAINT UQ_UTILISATEUR_email UNIQUE (email),
    CONSTRAINT CK_UTILISATEUR_role CHECK (
        role IN ('ROLE_ELEVE', 'ROLE_REFERENTE', 'ROLE_FORMATEUR', 'ROLE_ADMIN')
    ),
    CONSTRAINT CK_UTILISATEUR_statut CHECK (
        statut IN ('ACTIF', 'INACTIF', 'BLOQUE')
    )
);
GO

CREATE TABLE FILIERE (
    id_filiere INT IDENTITY(1,1) PRIMARY KEY,
    libelle NVARCHAR(100) NOT NULL,

    CONSTRAINT UQ_FILIERE_libelle UNIQUE (libelle)
);
GO

CREATE TABLE COURS (
    id_cours INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(30) NOT NULL,
    titre NVARCHAR(150) NOT NULL,

    CONSTRAINT UQ_COURS_code UNIQUE (code)
);
GO

CREATE TABLE ELEVE (
    id_eleve INT IDENTITY(1,1) PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    numero_dossier NVARCHAR(50) NOT NULL,
    telephone NVARCHAR(30) NULL,

    CONSTRAINT UQ_ELEVE_utilisateur UNIQUE (id_utilisateur),
    CONSTRAINT UQ_ELEVE_numero_dossier UNIQUE (numero_dossier),
    CONSTRAINT FK_ELEVE_UTILISATEUR
        FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur)
);
GO

CREATE OR ALTER TRIGGER TR_UTILISATEUR_AJOUT_ELEVE
ON UTILISATEUR
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ELEVE (
        id_utilisateur,
        numero_dossier,
        telephone
    )
    SELECT
        i.id_utilisateur,
        CONCAT(N'ELV-', RIGHT(CONCAT(N'000000', CAST(i.id_utilisateur AS NVARCHAR(20))), 6)),
        NULL
    FROM inserted i
    WHERE i.role = N'ROLE_ELEVE'
      AND NOT EXISTS (
          SELECT 1
          FROM ELEVE e
          WHERE e.id_utilisateur = i.id_utilisateur
      );
END;
GO

CREATE TABLE FORMATEUR (
    id_formateur INT IDENTITY(1,1) PRIMARY KEY,
    id_utilisateur INT NULL, -- optionnel : utile si le formateur se connecte à l'application
    specialite NVARCHAR(150) NULL,
    actif BIT NOT NULL CONSTRAINT DF_FORMATEUR_actif DEFAULT 1,

    CONSTRAINT UQ_FORMATEUR_utilisateur UNIQUE (id_utilisateur),
    CONSTRAINT FK_FORMATEUR_UTILISATEUR
        FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur)
);
GO

CREATE TABLE CURSUS (
    id_cursus INT IDENTITY(1,1) PRIMARY KEY,
    id_filiere INT NOT NULL,
    titre NVARCHAR(150) NOT NULL,
    niveau NVARCHAR(50) NULL,

    CONSTRAINT FK_CURSUS_FILIERE
        FOREIGN KEY (id_filiere) REFERENCES FILIERE(id_filiere),
    CONSTRAINT UQ_CURSUS_filiere_titre UNIQUE (id_filiere, titre)
);
GO

CREATE TABLE CURSUS_COURS (
    id_cursus_cours INT IDENTITY(1,1) PRIMARY KEY,
    id_cursus INT NOT NULL,
    id_cours INT NOT NULL,
    ordre INT NOT NULL,
    prerequis NVARCHAR(255) NULL,
    obligatoire BIT NOT NULL CONSTRAINT DF_CURSUS_COURS_obligatoire DEFAULT 1,

    CONSTRAINT FK_CURSUS_COURS_CURSUS
        FOREIGN KEY (id_cursus) REFERENCES CURSUS(id_cursus),
    CONSTRAINT FK_CURSUS_COURS_COURS
        FOREIGN KEY (id_cours) REFERENCES COURS(id_cours),

    CONSTRAINT CK_CURSUS_COURS_ordre CHECK (ordre > 0),
    CONSTRAINT UQ_CURSUS_COURS_cursus_cours UNIQUE (id_cursus, id_cours),
    CONSTRAINT UQ_CURSUS_COURS_cursus_ordre UNIQUE (id_cursus, ordre)
);
GO

CREATE TABLE PROMOTION (
    id_promotion INT IDENTITY(1,1) PRIMARY KEY,
    id_cursus INT NOT NULL,
    libelle NVARCHAR(150) NOT NULL,
    periode NVARCHAR(100) NOT NULL,
    statut NVARCHAR(20) NOT NULL CONSTRAINT DF_PROMOTION_statut DEFAULT 'PLANIFIEE',

    CONSTRAINT FK_PROMOTION_CURSUS
        FOREIGN KEY (id_cursus) REFERENCES CURSUS(id_cursus),
    CONSTRAINT UQ_PROMOTION_libelle UNIQUE (libelle),
    CONSTRAINT CK_PROMOTION_statut CHECK (
        statut IN ('PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE')
    )
);
GO

CREATE TABLE COURS_PLANIFIE (
    id_cours_planifie INT IDENTITY(1,1) PRIMARY KEY,
    id_promotion INT NOT NULL,
    id_cursus_cours INT NOT NULL,
    id_formateur INT NULL,
    date_debut DATETIME2(0) NOT NULL,
    date_fin DATETIME2(0) NOT NULL,
    salle NVARCHAR(100) NULL,
    statut NVARCHAR(20) NOT NULL CONSTRAINT DF_COURS_PLANIFIE_statut DEFAULT 'PLANIFIE',

    CONSTRAINT FK_COURS_PLANIFIE_PROMOTION
        FOREIGN KEY (id_promotion) REFERENCES PROMOTION(id_promotion),
    CONSTRAINT FK_COURS_PLANIFIE_CURSUS_COURS
        FOREIGN KEY (id_cursus_cours) REFERENCES CURSUS_COURS(id_cursus_cours),
    CONSTRAINT FK_COURS_PLANIFIE_FORMATEUR
        FOREIGN KEY (id_formateur) REFERENCES FORMATEUR(id_formateur),

    CONSTRAINT CK_COURS_PLANIFIE_dates CHECK (date_fin > date_debut),
    CONSTRAINT CK_COURS_PLANIFIE_statut CHECK (
        statut IN ('PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE')
    ),
    CONSTRAINT UQ_COURS_PLANIFIE_promotion_cours UNIQUE (id_promotion, id_cursus_cours)
);
GO

CREATE TABLE INSCRIPTION_PROMO (
    id_inscription_promo INT IDENTITY(1,1) PRIMARY KEY,
    id_eleve INT NOT NULL,
    id_promotion INT NOT NULL,
    date_inscription DATETIME2(0) NOT NULL CONSTRAINT DF_INSCRIPTION_PROMO_date DEFAULT SYSDATETIME(),
    statut NVARCHAR(20) NOT NULL CONSTRAINT DF_INSCRIPTION_PROMO_statut DEFAULT 'VALIDEE',

    CONSTRAINT FK_INSCRIPTION_PROMO_ELEVE
        FOREIGN KEY (id_eleve) REFERENCES ELEVE(id_eleve),
    CONSTRAINT FK_INSCRIPTION_PROMO_PROMOTION
        FOREIGN KEY (id_promotion) REFERENCES PROMOTION(id_promotion),

    CONSTRAINT CK_INSCRIPTION_PROMO_statut CHECK (
        statut IN ('VALIDEE', 'ANNULEE')
    ),
    CONSTRAINT UQ_INSCRIPTION_PROMO_eleve_promotion UNIQUE (id_eleve, id_promotion)
);
GO

CREATE TABLE INSCRIPTION_COURS (
    id_inscription_cours INT IDENTITY(1,1) PRIMARY KEY,
    id_eleve INT NOT NULL,
    id_cours_planifie INT NOT NULL,
    date_inscription DATETIME2(0) NOT NULL CONSTRAINT DF_INSCRIPTION_COURS_date DEFAULT SYSDATETIME(),
    forcee BIT NOT NULL CONSTRAINT DF_INSCRIPTION_COURS_forcee DEFAULT 0,
    motif_forcage NVARCHAR(500) NULL,
    statut NVARCHAR(20) NOT NULL CONSTRAINT DF_INSCRIPTION_COURS_statut DEFAULT 'VALIDEE',

    CONSTRAINT FK_INSCRIPTION_COURS_ELEVE
        FOREIGN KEY (id_eleve) REFERENCES ELEVE(id_eleve),
    CONSTRAINT FK_INSCRIPTION_COURS_COURS_PLANIFIE
        FOREIGN KEY (id_cours_planifie) REFERENCES COURS_PLANIFIE(id_cours_planifie),

    CONSTRAINT CK_INSCRIPTION_COURS_statut CHECK (
        statut IN ('VALIDEE', 'ANNULEE')
    ),
    CONSTRAINT CK_INSCRIPTION_COURS_forcage CHECK (
        forcee = 0 OR motif_forcage IS NOT NULL
    ),
    CONSTRAINT UQ_INSCRIPTION_COURS_eleve_cours_planifie UNIQUE (id_eleve, id_cours_planifie)
);
GO

/* ============================================================
   2. Index utiles
   ============================================================ */

CREATE INDEX IX_CURSUS_id_filiere ON CURSUS(id_filiere);
CREATE INDEX IX_CURSUS_COURS_id_cursus ON CURSUS_COURS(id_cursus);
CREATE INDEX IX_CURSUS_COURS_id_cours ON CURSUS_COURS(id_cours);
CREATE INDEX IX_PROMOTION_id_cursus ON PROMOTION(id_cursus);
CREATE INDEX IX_COURS_PLANIFIE_id_promotion ON COURS_PLANIFIE(id_promotion);
CREATE INDEX IX_COURS_PLANIFIE_id_cursus_cours ON COURS_PLANIFIE(id_cursus_cours);
CREATE INDEX IX_INSCRIPTION_PROMO_id_eleve ON INSCRIPTION_PROMO(id_eleve);
CREATE INDEX IX_INSCRIPTION_COURS_id_eleve ON INSCRIPTION_COURS(id_eleve);
GO

/* ============================================================
   3. Contrôles métier par triggers
   ============================================================ */

/* Vérifie qu'un cours planifié appartient bien au cursus de la promotion. */
CREATE OR ALTER TRIGGER TRG_COURS_PLANIFIE_CURSUS
ON COURS_PLANIFIE
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN PROMOTION p ON p.id_promotion = i.id_promotion
        INNER JOIN CURSUS_COURS cc ON cc.id_cursus_cours = i.id_cursus_cours
        WHERE p.id_cursus <> cc.id_cursus
    )
    BEGIN
        RAISERROR(N'Le cours planifié ne correspond pas au cursus de la promotion.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

/* Empêche une inscription à l'unité si l'élève suit déjà le même cours via une promotion.
   Vérifie aussi l'ordre pédagogique sauf si forcee = 1. */
CREATE OR ALTER TRIGGER TRG_INSCRIPTION_COURS_CONTROLES
ON INSCRIPTION_COURS
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    /* Doublon avec une promotion déjà suivie */
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN COURS_PLANIFIE cp_unite
            ON cp_unite.id_cours_planifie = i.id_cours_planifie
        INNER JOIN CURSUS_COURS cc_unite
            ON cc_unite.id_cursus_cours = cp_unite.id_cursus_cours
        INNER JOIN INSCRIPTION_PROMO ip
            ON ip.id_eleve = i.id_eleve
           AND ip.statut = 'VALIDEE'
        INNER JOIN COURS_PLANIFIE cp_promo
            ON cp_promo.id_promotion = ip.id_promotion
        INNER JOIN CURSUS_COURS cc_promo
            ON cc_promo.id_cursus_cours = cp_promo.id_cursus_cours
        WHERE i.statut = 'VALIDEE'
          AND cc_promo.id_cours = cc_unite.id_cours
    )
    BEGIN
        RAISERROR(N'Inscription refusée : l''élève suit déjà ce cours via une promotion.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;

    /* Ordre pédagogique : tous les cours obligatoires précédents doivent être suivis */
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN COURS_PLANIFIE cp_courant
            ON cp_courant.id_cours_planifie = i.id_cours_planifie
        INNER JOIN CURSUS_COURS cc_courant
            ON cc_courant.id_cursus_cours = cp_courant.id_cursus_cours
        INNER JOIN CURSUS_COURS cc_precedent
            ON cc_precedent.id_cursus = cc_courant.id_cursus
           AND cc_precedent.ordre < cc_courant.ordre
           AND cc_precedent.obligatoire = 1
        WHERE i.statut = 'VALIDEE'
          AND i.forcee = 0

          /* Pas suivi à l'unité */
          AND NOT EXISTS (
              SELECT 1
              FROM INSCRIPTION_COURS ic2
              INNER JOIN COURS_PLANIFIE cp2
                  ON cp2.id_cours_planifie = ic2.id_cours_planifie
              INNER JOIN CURSUS_COURS cc2
                  ON cc2.id_cursus_cours = cp2.id_cursus_cours
              WHERE ic2.id_eleve = i.id_eleve
                AND ic2.statut = 'VALIDEE'
                AND cc2.id_cours = cc_precedent.id_cours
          )

          /* Pas suivi via une promotion */
          AND NOT EXISTS (
              SELECT 1
              FROM INSCRIPTION_PROMO ip2
              INNER JOIN COURS_PLANIFIE cp3
                  ON cp3.id_promotion = ip2.id_promotion
              INNER JOIN CURSUS_COURS cc3
                  ON cc3.id_cursus_cours = cp3.id_cursus_cours
              WHERE ip2.id_eleve = i.id_eleve
                AND ip2.statut = 'VALIDEE'
                AND cc3.id_cours = cc_precedent.id_cours
          )
    )
    BEGIN
        RAISERROR(N'Inscription refusée : l''ordre pédagogique du cursus n''est pas respecté. Utiliser forcee = 1 avec un motif si nécessaire.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO

/* Empêche l'inscription à une promotion si l'élève suit déjà l'un des cours de cette promotion à l'unité. */
CREATE OR ALTER TRIGGER TRG_INSCRIPTION_PROMO_CONTROLES
ON INSCRIPTION_PROMO
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted ip
        INNER JOIN COURS_PLANIFIE cp_promo
            ON cp_promo.id_promotion = ip.id_promotion
        INNER JOIN CURSUS_COURS cc_promo
            ON cc_promo.id_cursus_cours = cp_promo.id_cursus_cours
        INNER JOIN INSCRIPTION_COURS ic
            ON ic.id_eleve = ip.id_eleve
           AND ic.statut = 'VALIDEE'
        INNER JOIN COURS_PLANIFIE cp_unite
            ON cp_unite.id_cours_planifie = ic.id_cours_planifie
        INNER JOIN CURSUS_COURS cc_unite
            ON cc_unite.id_cursus_cours = cp_unite.id_cursus_cours
        WHERE ip.statut = 'VALIDEE'
          AND cc_unite.id_cours = cc_promo.id_cours
    )
    BEGIN
        RAISERROR(N'Inscription refusée : l''élève suit déjà à l''unité au moins un cours contenu dans cette promotion.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO

/* ============================================================
   4. Vue pratique : calendrier d'un élève
   ============================================================ */

CREATE OR ALTER VIEW V_CALENDRIER_ELEVE AS
    SELECT
        e.id_eleve,
        u.email,
        'PROMOTION' AS type_inscription,
        p.libelle AS promotion,
        c.code AS code_cours,
        c.titre AS titre_cours,
        cp.date_debut,
        cp.date_fin,
        cp.salle,
        f.specialite AS formateur_specialite
    FROM ELEVE e
    INNER JOIN UTILISATEUR u ON u.id_utilisateur = e.id_utilisateur
    INNER JOIN INSCRIPTION_PROMO ip ON ip.id_eleve = e.id_eleve
    INNER JOIN PROMOTION p ON p.id_promotion = ip.id_promotion
    INNER JOIN COURS_PLANIFIE cp ON cp.id_promotion = p.id_promotion
    INNER JOIN CURSUS_COURS cc ON cc.id_cursus_cours = cp.id_cursus_cours
    INNER JOIN COURS c ON c.id_cours = cc.id_cours
    LEFT JOIN FORMATEUR f ON f.id_formateur = cp.id_formateur
    WHERE ip.statut = 'VALIDEE'

    UNION ALL

    SELECT
        e.id_eleve,
        u.email,
        'UNITE' AS type_inscription,
        p.libelle AS promotion,
        c.code AS code_cours,
        c.titre AS titre_cours,
        cp.date_debut,
        cp.date_fin,
        cp.salle,
        f.specialite AS formateur_specialite
    FROM ELEVE e
    INNER JOIN UTILISATEUR u ON u.id_utilisateur = e.id_utilisateur
    INNER JOIN INSCRIPTION_COURS ic ON ic.id_eleve = e.id_eleve
    INNER JOIN COURS_PLANIFIE cp ON cp.id_cours_planifie = ic.id_cours_planifie
    INNER JOIN PROMOTION p ON p.id_promotion = cp.id_promotion
    INNER JOIN CURSUS_COURS cc ON cc.id_cursus_cours = cp.id_cursus_cours
    INNER JOIN COURS c ON c.id_cours = cc.id_cours
    LEFT JOIN FORMATEUR f ON f.id_formateur = cp.id_formateur
    WHERE ic.statut = 'VALIDEE';
GO
