(function (angular) {
    "use strict";

    const app = angular.module("servicePedagogiqueApp");

    app.controller("LoginController", ["$http", "$window", "SessionService",
        function ($http, $window, SessionService) {
            const vm = this;
            vm.credentials = { email: "", motDePasse: "" };
            vm.loading = false;
            vm.message = "";

            const existing = SessionService.get();
            if (existing) {
                $window.location.replace(SessionService.homeForRole(existing.utilisateur.role));
                return;
            }

            if (new URLSearchParams($window.location.search).get("session") === "expiree") {
                vm.message = "Votre session a expiré. Veuillez vous reconnecter.";
            }

            vm.submit = function (form) {
                if (form.$invalid || vm.loading) return;
                vm.loading = true;
                vm.message = "";

                $http.post("/api/auth/login", {
                    email: vm.credentials.email.trim(),
                    motDePasse: vm.credentials.motDePasse
                }).then(function (response) {
                    SessionService.save(response.data);
                    $window.location.replace(SessionService.homeForRole(response.data.utilisateur.role));
                }).catch(function (error) {
                    vm.message = error.data && error.data.message
                        ? error.data.message
                        : "La connexion a échoué. Vérifiez votre email et votre mot de passe.";
                }).finally(function () {
                    vm.loading = false;
                });
            };
        }]);

    app.controller("DashboardController", ["$q", "ApiService", "PageService",
        function ($q, ApiService, PageService) {
            const vm = this;
            if (!PageService.initialise(vm, ["ROLE_ADMIN", "ROLE_REFERENTE"])) return;
            vm.loading = true;
            vm.error = "";
            vm.filieres = [];
            vm.cursus = [];
            vm.promotions = [];
            vm.utilisateurs = [];
            vm.nom = vm.session.utilisateur.email.split("@")[0].replace(/[._-]+/g, " ");

            const requests = [
                ApiService.get("/api/filieres"),
                ApiService.get("/api/cursus"),
                ApiService.get("/api/promotions")
            ];
            if (vm.session.utilisateur.role === "ROLE_ADMIN") requests.push(ApiService.get("/api/utilisateurs"));

            $q.all(requests).then(function (results) {
                vm.filieres = results[0];
                vm.cursus = results[1];
                vm.promotions = results[2];
                vm.utilisateurs = results[3] || [];
                vm.filieresSansCursus = vm.filieres.filter(function (filiere) {
                    return filiere.nombreCursus === 0;
                }).length;
            }).catch(function (error) {
                vm.error = error.message;
            }).finally(function () {
                vm.loading = false;
            });
        }]);

    app.controller("FilieresController", ["$window", "ApiService", "PageService", "UiService",
        function ($window, ApiService, PageService, UiService) {
            const vm = this;
            if (!PageService.initialise(vm, ["ROLE_ADMIN", "ROLE_REFERENTE"])) return;
            vm.filieres = [];
            vm.search = "";
            vm.form = {};
            vm.loading = true;
            vm.saving = false;
            vm.error = "";

            vm.filtered = function () {
                const search = (vm.search || "").trim().toLocaleLowerCase("fr");
                return vm.filieres.filter(function (filiere) {
                    return filiere.libelle.toLocaleLowerCase("fr").includes(search);
                });
            };

            vm.load = function () {
                vm.loading = true;
                ApiService.get("/api/filieres").then(function (data) {
                    vm.filieres = data;
                }).catch(function (error) {
                    vm.error = error.message;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.reset = function (focus) {
                vm.form = {};
                vm.formError = "";
                if (focus) $window.setTimeout(function () {
                    document.getElementById("libelle")?.focus();
                }, 0);
            };

            vm.edit = function (filiere) {
                vm.form = { idFiliere: filiere.idFiliere, libelle: filiere.libelle };
                vm.formError = "";
                document.getElementById("formulaire-filiere")?.scrollIntoView({ behavior: "smooth" });
            };

            vm.save = function (form) {
                if (form.$invalid || vm.saving) return;
                vm.saving = true;
                vm.formError = "";
                const editing = Boolean(vm.form.idFiliere);
                const request = editing
                    ? ApiService.put("/api/filieres/" + vm.form.idFiliere, { libelle: vm.form.libelle.trim() })
                    : ApiService.post("/api/filieres", { libelle: vm.form.libelle.trim() });

                request.then(function () {
                    UiService.show(editing ? "La filière a été modifiée." : "La filière a été créée.");
                    vm.reset();
                    vm.load();
                }).catch(function (error) {
                    vm.formError = error.details.libelle || error.message;
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.load();
            if (new URLSearchParams($window.location.search).get("nouveau") === "1") vm.reset(true);
        }]);

    app.controller("CursusController", ["$q", "$window", "ApiService", "PageService", "UiService",
        function ($q, $window, ApiService, PageService, UiService) {
            const vm = this;
            if (!PageService.initialise(vm, ["ROLE_ADMIN", "ROLE_REFERENTE"])) return;
            vm.cursus = [];
            vm.filieres = [];
            vm.search = "";
            vm.filiereFilter = "";
            vm.form = {};
            vm.loading = true;
            vm.saving = false;
            vm.error = "";

            vm.filtered = function () {
                const search = (vm.search || "").trim().toLocaleLowerCase("fr");
                return vm.cursus.filter(function (cursus) {
                    const text = [cursus.titre, cursus.libelleFiliere, cursus.niveau || ""].join(" ").toLocaleLowerCase("fr");
                    return text.includes(search) && (!vm.filiereFilter || String(cursus.idFiliere) === String(vm.filiereFilter));
                });
            };

            vm.load = function () {
                vm.loading = true;
                $q.all([ApiService.get("/api/filieres"), ApiService.get("/api/cursus")])
                    .then(function (results) {
                        vm.filieres = results[0];
                        vm.cursus = results[1];
                    }).catch(function (error) {
                        vm.error = error.message;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.reset = function (focus) {
                vm.form = {};
                vm.formError = "";
                if (focus) $window.setTimeout(function () {
                    document.getElementById("filiere")?.focus();
                }, 0);
            };

            vm.edit = function (cursus) {
                vm.form = {
                    idCursus: cursus.idCursus,
                    idFiliere: String(cursus.idFiliere),
                    titre: cursus.titre,
                    niveau: cursus.niveau
                };
                vm.formError = "";
                document.getElementById("formulaire-cursus")?.scrollIntoView({ behavior: "smooth" });
            };

            vm.save = function (form) {
                if (form.$invalid || vm.saving) return;
                vm.saving = true;
                vm.formError = "";
                const editing = Boolean(vm.form.idCursus);
                const body = {
                    idFiliere: Number(vm.form.idFiliere),
                    titre: vm.form.titre.trim(),
                    niveau: vm.form.niveau ? vm.form.niveau.trim() : null
                };
                const request = editing
                    ? ApiService.put("/api/cursus/" + vm.form.idCursus, body)
                    : ApiService.post("/api/cursus", body);

                request.then(function () {
                    UiService.show(editing ? "Le cursus a été modifié." : "Le cursus a été créé.");
                    vm.reset();
                    vm.load();
                }).catch(function (error) {
                    vm.formError = error.details.titre || error.details.idFiliere || error.details.niveau || error.message;
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.load();
            if (new URLSearchParams($window.location.search).get("nouveau") === "1") vm.reset(true);
        }]);

    app.controller("UtilisateursController", ["ApiService", "PageService", "UiService",
        function (ApiService, PageService, UiService) {
            const vm = this;
            if (!PageService.initialise(vm, ["ROLE_ADMIN"])) return;
            vm.roles = ["ROLE_ADMIN", "ROLE_REFERENTE", "ROLE_FORMATEUR", "ROLE_ELEVE"];
            vm.statuts = ["ACTIF", "INACTIF", "BLOQUE"];
            vm.utilisateurs = [];
            vm.search = "";
            vm.roleFilter = "";
            vm.statusFilter = "";
            vm.form = { statut: "ACTIF" };
            vm.loading = true;

            vm.filtered = function () {
                const search = (vm.search || "").trim().toLowerCase();
                return vm.utilisateurs.filter(function (user) {
                    return user.email.toLowerCase().includes(search)
                        && (!vm.roleFilter || user.role === vm.roleFilter)
                        && (!vm.statusFilter || user.statut === vm.statusFilter);
                });
            };

            vm.load = function () {
                vm.loading = true;
                ApiService.get("/api/utilisateurs").then(function (data) {
                    vm.utilisateurs = data;
                }).catch(function (error) {
                    vm.error = error.message;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.reset = function () {
                vm.form = { statut: "ACTIF" };
                vm.formError = "";
            };

            vm.edit = function (user) {
                vm.form = angular.copy(user);
                vm.formError = "";
                document.getElementById("formulaire-utilisateur")?.scrollIntoView({ behavior: "smooth" });
            };

            vm.save = function (form) {
                if (form.$invalid || vm.saving) return;
                vm.saving = true;
                vm.formError = "";
                const editing = Boolean(vm.form.idUtilisateur);
                const body = { email: vm.form.email.trim(), role: vm.form.role, statut: vm.form.statut };
                if (!editing) body.motDePasse = vm.form.motDePasse;
                const request = editing
                    ? ApiService.put("/api/utilisateurs/" + vm.form.idUtilisateur, body)
                    : ApiService.post("/api/utilisateurs", body);

                request.then(function () {
                    UiService.show(editing ? "Le compte a été modifié." : "Le compte a été créé.");
                    vm.reset();
                    vm.load();
                }).catch(function (error) {
                    vm.formError = error.details.email || error.details.motDePasse || error.message;
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.toggleStatus = function (user) {
                const next = user.statut === "ACTIF" ? "INACTIF" : "ACTIF";
                ApiService.patch("/api/utilisateurs/" + user.idUtilisateur + "/statut", { statut: next })
                    .then(function () {
                        UiService.show(next === "ACTIF" ? "Le compte a été activé." : "Le compte a été désactivé.");
                        vm.load();
                    }).catch(function (error) { UiService.show(error.message, "error"); });
            };

            vm.load();
        }]);

    app.controller("PromotionsController", ["ApiService", "PageService",
        function (ApiService, PageService) {
            const vm = this;
            if (!PageService.initialise(vm)) return;
            vm.promotions = [];
            vm.search = "";
            vm.statusFilter = "";
            vm.loading = true;

            vm.filtered = function () {
                const search = (vm.search || "").trim().toLocaleLowerCase("fr");
                return vm.promotions.filter(function (promotion) {
                    const text = [promotion.libelle, promotion.titreCursus, promotion.libelleFiliere, promotion.periode].join(" ").toLocaleLowerCase("fr");
                    return text.includes(search) && (!vm.statusFilter || promotion.statut === vm.statusFilter);
                });
            };

            ApiService.get("/api/promotions").then(function (data) {
                vm.promotions = data;
            }).catch(function (error) {
                vm.error = error.message;
            }).finally(function () {
                vm.loading = false;
            });
        }]);

    app.controller("CalendrierEleveController", ["ApiService", "PageService",
        function (ApiService, PageService) {
            const vm = this;
            if (!PageService.initialise(vm, ["ROLE_ELEVE"])) return;
            vm.cours = [];
            vm.loading = true;

            function refreshStats() {
                const now = Date.now();
                vm.aVenir = vm.cours.filter(function (cours) { return new Date(cours.dateFin).getTime() >= now; });
                vm.prochain = vm.aVenir.length ? vm.aVenir[0] : null;
                vm.promotions = new Set(vm.cours.map(function (cours) { return cours.promotion; })).size;
            }

            ApiService.get("/api/me/calendrier").then(function (data) {
                vm.cours = data;
                refreshStats();
            }).catch(function (error) {
                vm.error = error.message;
            }).finally(function () {
                vm.loading = false;
            });
        }]);

    app.controller("CoursFormateurController", ["ApiService", "PageService",
        function (ApiService, PageService) {
            const vm = this;
            if (!PageService.initialise(vm, ["ROLE_FORMATEUR"])) return;
            vm.cours = [];
            vm.loading = true;

            function refreshStats() {
                const now = Date.now();
                vm.aVenir = vm.cours.filter(function (cours) { return new Date(cours.dateFin).getTime() >= now; }).length;
                const eleves = new Set();
                vm.cours.forEach(function (cours) {
                    cours.eleves.forEach(function (eleve) { eleves.add(eleve.idEleve); });
                });
                vm.nombreEleves = eleves.size;
            }

            vm.toggle = function (cours) { cours.expanded = !cours.expanded; };

            ApiService.get("/api/formateur/cours").then(function (data) {
                vm.cours = data;
                refreshStats();
            }).catch(function (error) {
                vm.error = error.message;
            }).finally(function () {
                vm.loading = false;
            });
        }]);
})(window.angular);
