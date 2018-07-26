'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verSolicitud
 * @description
 * # verSolicitud
 */
angular.module('financieraClienteApp')
  .directive('verSolicitud', function() {
    return {
      restrict: 'E',
      scope: {
        sol: '=?',
        tipos: '=?'
      },
      templateUrl: 'views/directives/avance/ver_solicitud.html',

      controller: function($scope,$translate) {
        var ctrl = this;

        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
        ];

        ctrl.cargando = true;
        ctrl.hayData = true;

        ctrl.gridInfPresupuesto = {
          enableFiltering: false,
          enableSorting: false,
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          columnDefs: [
              {
                  field: 'Tercero',
                  displayName: $translate.instant('NECESIDAD_NO'),
                  width: '33%',
                  headerCellClass: 'encabezado',
              },
              {
                  field: 'NumeroFactura',
                  displayName: $translate.instant('NO_CDP'),
                  width: '33%',
                  headerCellClass: 'encabezado',
              },
              {
                  field: 'InformacionProveedor[0].NomProveedor',
                  displayName: $translate.instant('NO_CRP'),
                  width: '34%',
                  headerCellClass: 'encabezado',
              }
          ]
        };


        $scope.$watch('sol', function() {
          ctrl.solicitud = $scope.sol;
          ctrl.tipo_avance = $scope.tipos;
        });
      },
      controllerAs: 'd_verSolicitud'
    };
  });
