'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:proveedor/pvListar
 * @description
 * # proveedor/pvListar
 */
angular.module('financieraClienteApp')
  .directive('pvListar', function(agoraRequest, coreRequest, $translate) {
    return {
      restrict: 'E',
      scope: {
        proveedor: '='
      },

      templateUrl: 'views/directives/proveedor/pv_listar.html',
      controller: function($scope) {
        var self = this;
        self.gridOptions_proveedor = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [13, 50, 100],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 13,
          useExternalPagination: false,

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Tipopersona',
              displayName: $translate.instant('TIPO_PERSONA')
            },
            {
              field: 'NumDocumento',
              displayName: $translate.instant('NO_DOCUMENTO')
            },
            {
              field: 'NomProveedor',
              displayName: $translate.instant('NOMBRE')
            }
          ]
        };
        //
        agoraRequest.get('informacion_proveedor',
          $.param({
            query: "Estado.ValorParametro:ACTIVO",
            limit: -1
          })).then(function(response) {
          self.gridOptions_proveedor.data = response.data;
        });
        //
        self.gridOptions_proveedor.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.proveedor = row.entity
            // datos banco
            self.get_info_banco($scope.proveedor.IdEntidadBancaria)
            // dato telefono
            self.get_tel_provee($scope.proveedor.Id)
          });
        };
        self.gridOptions_proveedor.multiSelect = false;
        // control ocultar paginación
        $scope.$watch('[d_pvListar.gridOptions_proveedor.paginationPageSize, d_pvListar.gridOptions_proveedor.data]', function() {
          if ((self.gridOptions_proveedor.data.length <= self.gridOptions_proveedor.paginationPageSize || self.gridOptions_proveedor.paginationPageSize == null) && self.gridOptions_proveedor.data.length > 0) {
            $scope.gridHeight = self.gridOptions_proveedor.rowHeight * 2 + (self.gridOptions_proveedor.data.length * self.gridOptions_proveedor.rowHeight);
            if (self.gridOptions_proveedor.data.length <= 5) {
              self.gridOptions_proveedor.enablePaginationControls = false;
            }
          } else {
            $scope.gridHeight = self.gridOptions_proveedor.rowHeight * 3 + (self.gridOptions_proveedor.paginationPageSize * self.gridOptions_proveedor.rowHeight);
            self.gridOptions_proveedor.enablePaginationControls = true;
          }
        }, true);
        //
        self.get_info_banco = function(id_banco) {
          coreRequest.get('banco',
            $.param({
              query: "Id:" + id_banco,
            })).then(function(response) {
            self.banco_proveedor = response.data[0];
          });
        }
        //
        self.get_tel_provee = function(id_prove) {
          agoraRequest.get('proveedor_telefono',
            $.param({
              query: "Id:" + id_prove,
            })).then(function(response) {
            self.tel_proveedor = response.data[0];
          });
        }
      },
      controllerAs: 'd_pvListar'
    };
  });
