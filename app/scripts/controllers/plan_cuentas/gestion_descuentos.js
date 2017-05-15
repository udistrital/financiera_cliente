'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasGestionDescuentosCtrl
 * @description
 * # PlanCuentasGestionDescuentosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionDescuentosCtrl', function ($scope, financieraRequest, $translate ) {
    var self = this;

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'CuentaContable.Codigo',
          displayName: 'Codigo',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width:'20%'
        },
        {
          field: 'TipoCuentaEspecial.Nombre',
          displayName: 'Tipo',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width:'20%'
        },
        {
          field: 'InformacionPersonaJuridica',
          displayName: 'Proveedor',
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width:'45%'
        },
        {
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '15%',
          cellTemplate: '<center>' +
            '<a href="" class="ver" data-toggle="modal" data-target="#modalverplan">' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a href="" class="editar" ng-click="grid.appScope.crearPlan.mod_editar(row.entity);grid.appScope.editar=true;" data-toggle="modal" data-target="#modalform">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '</center>'
        }
      ]
    };

    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
  //  self.gridOptions.noUnselect = true;


    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.cuenta = self.gridApi.selection.getSelectedRows()[0];
      });
    };


    self.cargar = function() {
      financieraRequest.get("cuenta_especial",$.param({
        limit:-1
      })).then(function(response) {
        self.gridOptions.data= response.data;
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
