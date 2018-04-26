'use strict';

angular.module('financieraClienteApp')
    .controller('menuCtrl', function($location, $window, $q, requestRequest, $scope, token_service, notificacion, $translate, $route, $mdSidenav, configuracionRequest, $rootScope, $http) {
        self.perfil = "Admin";
        //$scope.menuserv=configuracionRequest;
        $scope.language = {
            es: "btn btn-primary btn-circle btn-outline active",
            en: "btn btn-primary btn-circle btn-outline"
        };
        $scope.notificacion = notificacion;
        $scope.actual = "";
        $scope.token_service = token_service;
        $scope.breadcrumb = [];

        $scope.menu_app = [{
                id: "kronos",
                title: "KRONOS",
                url: "http://10.20.0.254/kronos"
            },
            {
                id: "agora",
                title: "AGORA",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/agora"
            }, {
                id: "argo",
                title: "ARGO",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/argo"
            }, {
                id: "arka",
                title: "ARKA",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/arka"
            }, {
                id: "temis",
                title: "TEMIS",
                url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/gefad"
            }, {
                id: "polux",
                title: "POLUX",
                url: "http://10.20.0.254/polux"
            }, {
                id: "jano",
                title: "JANO",
                url: "http://10.20.0.254/kronos"
            }, {
                id: "kyron",
                title: "KYRON",
                url: "http://10.20.0.254/kronos"
            }, {
                id: "sga",
                title: "SGA",
                url: "http://10.20.0.254/kronos"
            }
        ];
        //$scope.menu_service = [];
        $scope.changeLanguage = function(key) {
            $translate.use(key);
            switch (key) {
                case 'es':
                    $scope.language.es = "btn btn-primary btn-circle btn-outline active";
                    $scope.language.en = "btn btn-primary btn-circle btn-outline";
                    break;
                case 'en':
                    $scope.language.en = "btn btn-primary btn-circle btn-outline active";
                    $scope.language.es = "btn btn-primary btn-circle btn-outline";
                    break;
                default:
            }
        };

        $scope.redirect_url = function(path) {
            var path_sub = path.substring(0, 4);
            switch (path_sub.toUpperCase()) {
                case "HTTP":
                    $window.open(path, "_blank");
                    break;
                case "otro":
                     break;
                default:
                    requestRequest.cancel_all();
                    $location.path(path);
                    break;
            }
        };

        $scope.notificacion.get_crud('notificacion', $.param({
                query: "UsuarioDestino:2"
            }))
            .then(function(response) {
                $scope.notificacion.log = response.data;
            });

        configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + self.perfil + '/Kronos').then(function(response) {
            $rootScope.my_menu = response.data;
            /*configuracionRequest.update_menu(https://10.20.0.162:9443/store/apis/authenticate response.data);
            console.log("get menu");
            $scope.menu_service = configuracionRequest.get_menu();*/
        });

        //$scope.menuserv.actualizar_menu("Admin");
        //$scope.menu_service =$scope.menuserv.get_menu();

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');

        //Pendiente por definir json del menu
        (function($) {
            $(document).ready(function() {
                $('[data-toggle="tooltip"]').tooltip();
                $('ul.dropdown-menu [data-toggle=dropdown-submenu]').on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).parent().siblings().removeClass('open');
                    $(this).parent().toggleClass('open');
                });
            });
        })(jQuery);
    });
