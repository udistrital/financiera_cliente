'use strict';

angular.module('financieraClienteApp')
.controller('menuCtrl', function($location, $http, $scope, token_service, notificacion, $translate, $route) {
   var paths = [];
   $scope.language = {
       es:"btn btn-primary btn-circle btn-outline active",
       en:"btn btn-primary btn-circle btn-outline"
   };
   $scope.notificacion = notificacion;
   $scope.actual = "";
   $scope.token_service = token_service;
   $scope.breadcrumb = [];
   $scope.menu_service = [
   { //CDP
     "Id": 1,
     "Nombre": "CDP",
     "Url": "",
     "Opciones": [
       { //solicitud_consulta de CDP
         "Id": 1,
         "Nombre": "Solicitudes de CDP",
         "Url": "cdp/cdp_solicitud_consulta",
         "Opciones": null
       },
       { //Detalle de CDP
         "Id": 1,
         "Nombre": "Consulta de CDP",
         "Url": "cdp/cdp_consulta",
         "Opciones": null
       }
     ]
   },
   { //Conceptos
     "Id": 1,
     "Nombre": "Conceptos",
     "Url": "",
     "Opciones": [
       { //Crear Conceptos
         "Id": 1,
         "Nombre": "Crear Conceptos",
         "Url": "conceptos/nuevo",
         "Opciones": null
       }
     ]
   },
   { //Plan de cuentas
     "Id": 1,
     "Nombre": "Plan de cuentas",
     "Url": "",
     "Opciones": [
       { //Crear plan_cuentas
         "Id": 1,
         "Nombre": "Crear Plan de cuentas",
         "Url": "plan_cuentas/nuevo",
         "Opciones": null
       },
       { //Crear Conceptos
         "Id": 1,
         "Nombre": "Crear Cuenta contable",
         "Url": "plan_cuentas/cuentas/nueva",
         "Opciones": null
       },
     ]
   },
   { //Compromisos
     "Id": 1,
     "Nombre": "Compromisos",
     "Url": "",
     "Opciones": [
       { //Crear Compromisos
         "Id": 1,
         "Nombre": "Crear Compromisos",
         "Url": "compromisos/nuevo",
         "Opciones": null
       }
     ]
   },
   { //RP
     "Id": 1,
     "Nombre": "RP",
     "Url": "",
     "Opciones": [
       { //Consulta de solicitud de RP
         "Id": 1,
         "Nombre": "Solicitudes de RP",
         "Url": "rp/rp_solicitud_consulta",
         "Opciones": null
       },
       { //Consulta de RP
         "Id": 1,
         "Nombre": "Consulta de RP",
         "Url": "rp/rp_consulta",
         "Opciones": null
       },
       { //Registro de RP
         "Id": 1,
         "Nombre": "Registro de RP",
         "Url": "rp/rp_registro",
         "Opciones": null
       }
     ]
   },
   { //RUBRO
     "Id": 1,
     "Nombre": "Rubro",
     "Url": "",
     "Opciones": [
       { //Registro de Rubro
         "Id": 1,
         "Nombre": "Registro de Rubro",
         "Url": "rubro/rubro_registro",
         "Opciones": null
       },
       { //Consulta de Rubro
         "Id": 1,
         "Nombre": "Consulta de Rubro",
         "Url": "rubro/rubro_consulta",
         "Opciones": null
       },
       { //Aprobación de rubro planeación
         "Id": 1,
         "Nombre": "Aprobación de Planeación",
         "Url": "rubro/rubro_apropiacion_planeacion",
         "Opciones": null
       },
       { //Detalle de RP
         "Id": 1,
         "Nombre": "Consulta de Aprobaciones",
         "Url": "rubro/rubro_apropiacion_consulta",
         "Opciones": null
       },
       { //Detalle de RP
         "Id": 1,
         "Nombre": "Aprobación de Aprobación",
         "Url": "rubro/rubro_apropiacion_aprobacion",
         "Opciones": null
       }
     ]
   },
   { //Ordenes de pago
     "Id": 50,
     "Nombre": "Ordenes de Pago",
     "Url": "orden_pago/ver_todos",
     "Opciones": null
   }
 ];

   var recorrerArbol = function(item, padre) {
     var padres = "";
     for (var i = 0; i < item.length; i++) {
       if (item[i].Opciones === null) {
         padres = padre + " , " + item[i].Nombre;
         paths.push({
           'path': item[i].Url,
           'padre': padres.split(",")
         });
       } else {
         recorrerArbol(item[i].Opciones, padre + "," + item[i].Nombre);
       }
     }
     return padres;
   };

   var update_url = function() {
     $scope.breadcrumb = [''];
     for (var i = 0; i < paths.length; i++) {
       if ($scope.actual === "/" + paths[i].path) {
         $scope.breadcrumb = paths[i].padre;
       } else if ('/' === $scope.actual) {
         $scope.breadcrumb = [''];
       }
     }
   };
   recorrerArbol($scope.menu_service, "");
   paths.push({padre:["","Notificaciones","Ver Notificaciones"],path:"notificaciones"});

   $scope.$on('$routeChangeStart', function() {
     $scope.actual = $location.path();
     update_url();
   });

   $scope.changeLanguage = function (key) {
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
        $route.reload();
   };
   //Pendiente por definir json del menu
   (function($) {
     $(document).ready(function() {
       $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
         event.preventDefault();
         event.stopPropagation();
         $(this).parent().siblings().removeClass('open');
         $(this).parent().toggleClass('open');
       });
     });
   })(jQuery);
 });
