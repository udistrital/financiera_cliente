'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasGestionDescuentosCtrl
 * @description
 * # PlanCuentasGestionDescuentosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionDescuentosCtrl', function($scope, financieraRequest, $translate) {
    var self = this;

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 1,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'CuentaContable.Codigo',
          displayName: $translate.instant('CODIGO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },
        {
          field: 'CuentaContable.Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '30%'
        },
        {
          field: 'TarifaUvt',
          displayName: $translate.instant('UVT'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '5%'
        },
        {
          field: 'Porcentaje',
          displayName: $translate.instant('PORCENTAJE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '9%'
        },
        {
          field: 'Deducible',
          displayName: $translate.instant('DEDUCIBLE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.Deducible" disabled></center>',
          width: '8%'
        },
        {
          field: 'InformacionPersonaJuridica',
          displayName: $translate.instant('PROVEEDOR'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },
        {
          field: 'TipoCuentaEspecial.Nombre',
          displayName: $translate.instant('TIPO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '8%'
        },
        {
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '10%',
          cellTemplate: '<center>' +
            '<a href="" class="editar" ng-click="grid.appScope.crearPlan.mod_editar(row.entity);grid.appScope.editar=true;" data-toggle="modal" data-target="#modalform">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '</center>'
        }
      ]
    };

    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;

    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.cuenta = self.gridApi.selection.getSelectedRows()[0];
      });
    };

    self.cargar = function() {
      financieraRequest.get("cuenta_especial", $.param({
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };

    self.cargar();

    $scope.$watch('[gestionDescuentos.gridOptions.paginationPageSize,gestionDescuentos.gridOptions.data]', function() {
      if ((self.gridOptions.data.length <= self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize == null) && self.gridOptions.data.length > 0) {
        $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
        if (self.gridOptions.data.length <= 5) {
          self.gridOptions.enablePaginationControls = false;
        }
      } else {
        $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
        self.gridOptions.enablePaginationControls = true;
      }
    }, true);

  });
