'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOpViewAllCtrl
 * @description
 * # OrdenPagoOpViewAllCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('OrdenPagoOpViewAllCtrl', function($scope, financieraRequest) {
        var ctrl = this;
        $scope.estados = [];
        $scope.aristas = [];
        $scope.estado = { Id: 1, Nombre: "Elaborado" };
        $scope.estadoclick = null;
        $scope.funcion = function() {
            console.log("Hola Babio");
        };
        financieraRequest.get("estado_orden_pago", $.param({
                sortby: "NumeroOrden",
                limit: -1,
                order: "asc"
            }))
            .then(function(response) {
                $scope.estados = [];
                $scope.aristas = [];
                ctrl.estados = response.data;
                angular.forEach(ctrl.estados, function(estado) {
                    $scope.estados.push({ id: estado.Id, label: estado.Nombre });
                });
                $scope.aristas = [
                    { from: 1, to: 2 },
                    { from: 1, to: 3 },
                    { from: 2, to: 4 },
                    { from: 2, to: 5 },
                    { from: 4, to: 6 },
                    { from: 6, to: 7 }
                ];
            });
    });