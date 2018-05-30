'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:verTraslados
 * @description
 * # verTraslados
 */
angular.module('financieraClienteApp')
  .directive('verTraslados', function(financieraRequest,$translate) {
    return {
      restrict: 'E',
      scope: {
        sol: '=?',
        tipos: '=?'
      },
      templateUrl: 'views/directives/bancos/ver_traslados.html',

      controller: function($scope) {
        var ctrl = this;
        ctrl.concepto = "Concepto ejemplo"

        $scope.$watch('sol', function() {
          ctrl.id = $scope.id;

        });

        ctrl.CuentasContables = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 10,
            useExternalPagination: true,
            columnDefs: [
                { field: 'Id', visible: false },
                { field: 'Codigo', displayName: $translate.instant('CODIGO'), cellClass: 'input_center', headerCellClass: 'text-info' },
                { field: 'Nombre',displayName: $translate.instant('NOMBRE'), cellClass: 'input_center', headerCellClass: 'text-info' },
                { field: 'Naturaleza',displayName: $translate.instant('NATURALEZA'), cellClass: 'input_center', headerCellClass: 'text-info'},

            ]

        };


        ctrl.cargar_cuentas_contables = function(){
          financieraRequest.get('cuenta_contable', $.param({
            limit: 10
          })).then(function(response) {
            ctrl.CuentasContables.data = response.data;
          });
        };


      },
      controllerAs: 'd_verTraslados'
    };
  });
