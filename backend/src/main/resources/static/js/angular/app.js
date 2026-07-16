(function (angular) {
    "use strict";

    angular.module("servicePedagogiqueApp", [])
        .factory("SessionService", ["$window", function ($window) {
            const TOKEN_KEY = "token";
            const USER_KEY = "utilisateur";

            function decodePayload(token) {
                try {
                    const part = token.split(".")[1];
                    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
                    return JSON.parse($window.atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
                } catch (error) {
                    return null;
                }
            }

            function clear() {
                $window.localStorage.removeItem(TOKEN_KEY);
                $window.localStorage.removeItem(USER_KEY);
            }

            function get() {
                const token = $window.localStorage.getItem(TOKEN_KEY);
                if (!token) return null;

                const payload = decodePayload(token);
                if (!payload || !payload.exp || Date.now() >= payload.exp * 1000) {
                    clear();
                    return null;
                }

                let utilisateur;
                try {
                    utilisateur = JSON.parse($window.localStorage.getItem(USER_KEY));
                } catch (error) {
                    utilisateur = null;
                }

                return {
                    token: token,
                    payload: payload,
                    utilisateur: utilisateur || { email: payload.sub, role: payload.role }
                };
            }

            function save(loginResponse) {
                $window.localStorage.setItem(TOKEN_KEY, loginResponse.token);
                $window.localStorage.setItem(USER_KEY, JSON.stringify(loginResponse.utilisateur));
            }

            function homeForRole(role) {
                return {
                    ROLE_ADMIN: "/accueil.html",
                    ROLE_REFERENTE: "/accueil.html",
                    ROLE_FORMATEUR: "/cours-formateur.html",
                    ROLE_ELEVE: "/calendrier-eleve.html"
                }[role] || "/login.html";
            }

            function requireSession(roles) {
                const session = get();
                if (!session) {
                    $window.location.replace("/login.html");
                    return null;
                }

                if (roles && roles.length && roles.indexOf(session.utilisateur.role) < 0) {
                    $window.location.replace(homeForRole(session.utilisateur.role));
                    return null;
                }
                return session;
            }

            return {
                get: get,
                save: save,
                clear: clear,
                require: requireSession,
                homeForRole: homeForRole
            };
        }])
        .factory("ApiService", ["$http", "$q", "$window", "SessionService",
            function ($http, $q, $window, SessionService) {
                function request(method, url, body) {
                    const session = SessionService.get();
                    if (!session) {
                        $window.location.replace("/login.html");
                        return $q.reject({ status: 401, message: "Authentification requise." });
                    }

                    return $http({
                        method: method,
                        url: url,
                        data: body,
                        headers: {
                            Accept: "application/json",
                            Authorization: "Bearer " + session.token
                        }
                    }).then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                        if (error.status === 401) {
                            SessionService.clear();
                            $window.location.replace("/login.html?session=expiree");
                        }
                        return $q.reject({
                            status: error.status,
                            message: error.data && error.data.message
                                ? error.data.message
                                : "La requête a échoué. Vérifiez que le serveur est démarré.",
                            details: error.data && error.data.details ? error.data.details : {}
                        });
                    });
                }

                return {
                    get: function (url) { return request("GET", url); },
                    post: function (url, body) { return request("POST", url, body); },
                    put: function (url, body) { return request("PUT", url, body); },
                    patch: function (url, body) { return request("PATCH", url, body); }
                };
            }])
        .factory("UiService", ["$timeout", function ($timeout) {
            const service = { toasts: [] };
            service.show = function (message, type) {
                const toast = { id: Date.now() + Math.random(), message: message, type: type || "success" };
                service.toasts.push(toast);
                $timeout(function () {
                    const index = service.toasts.indexOf(toast);
                    if (index >= 0) service.toasts.splice(index, 1);
                }, 3600);
            };
            return service;
        }])
        .factory("PageService", ["SessionService", function (SessionService) {
            return {
                initialise: function (viewModel, roles) {
                    viewModel.nav = { open: false };
                    viewModel.session = SessionService.require(roles || []);
                    return viewModel.session;
                }
            };
        }])
        .filter("roleLabel", function () {
            const labels = {
                ROLE_ADMIN: "Administrateur",
                ROLE_REFERENTE: "Référente administrative",
                ROLE_FORMATEUR: "Formateur",
                ROLE_ELEVE: "Élève"
            };
            return function (role) { return labels[role] || role; };
        })
        .filter("statusLabel", function () {
            const labels = {
                ACTIF: "Actif",
                INACTIF: "Inactif",
                BLOQUE: "Bloqué",
                PLANIFIEE: "Planifiée",
                EN_COURS: "En cours",
                TERMINEE: "Terminée",
                ANNULEE: "Annulée",
                PLANIFIE: "Planifié",
                TERMINE: "Terminé",
                ANNULE: "Annulé"
            };
            return function (status) { return labels[status] || status; };
        })
        .directive("spNavigation", ["SessionService", function (SessionService) {
            return {
                restrict: "E",
                scope: { active: "@", nav: "=" },
                bindToController: true,
                controllerAs: "menu",
                templateUrl: "/fragments/navigation.html",
                controller: ["$window", function ($window) {
                    const controller = this;
                    controller.session = SessionService.get();
                    const role = controller.session ? controller.session.utilisateur.role : null;
                    const items = {
                        ROLE_ADMIN: [
                            ["accueil", "A", "Accueil", "/accueil.html"],
                            ["utilisateurs", "U", "Utilisateurs", "/utilisateurs.html"],
                            ["filieres", "F", "Filières", "/filieres.html"],
                            ["cursus", "C", "Cursus", "/cursus.html"],
                            ["promotions", "P", "Promotions", "/promotions.html"]
                        ],
                        ROLE_REFERENTE: [
                            ["accueil", "A", "Accueil", "/accueil.html"],
                            ["filieres", "F", "Filières", "/filieres.html"],
                            ["cursus", "C", "Cursus", "/cursus.html"],
                            ["promotions", "P", "Promotions", "/promotions.html"]
                        ],
                        ROLE_FORMATEUR: [
                            ["cours-formateur", "C", "Mes cours", "/cours-formateur.html"],
                            ["promotions", "P", "Promotions", "/promotions.html"]
                        ],
                        ROLE_ELEVE: [
                            ["calendrier", "C", "Mon calendrier", "/calendrier-eleve.html"],
                            ["promotions", "P", "Promotions", "/promotions.html"]
                        ]
                    };
                    controller.items = (items[role] || []).map(function (item) {
                        return { key: item[0], icon: item[1], label: item[2], href: item[3] };
                    });
                    controller.role = role;
                    controller.logout = function () {
                        SessionService.clear();
                        $window.location.replace("/login.html");
                    };
                }]
            };
        }])
        .directive("spToasts", ["UiService", function (UiService) {
            return {
                restrict: "E",
                template: '<div class="toast-region" aria-live="polite">' +
                    '<div class="toast" ng-repeat="toast in toasts.items track by toast.id" ng-class="toast.type">{{toast.message}}</div>' +
                    '</div>',
                controllerAs: "toasts",
                bindToController: true,
                controller: function () { this.items = UiService.toasts; }
            };
        }]);
})(window.angular);
