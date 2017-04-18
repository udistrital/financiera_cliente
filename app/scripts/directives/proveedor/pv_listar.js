'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:proveedor/pvListar
 * @description
 * # proveedor/pvListar
 */
angular.module('financieraClienteApp')
  .directive('pvListar', function (agoraRequest, coreRequest) {
    return {
      restrict: 'E',
      scope:{
          proveedor:'='
        },

      templateUrl: 'views/directives/proveedor/pv_listar.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_proveedor = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableFiltering: true,

          columnDefs : [
            {field: 'Id',              visible : false},
            {field: 'Tipopersona',     displayName: 'Tipo Persona'},
            {field: 'NumDocumento',    displayName: 'No. Documento'},
            {field: 'NomProveedor',    displayName: 'Nombe'}
          ]
        };
        //
        agoraRequest.get('informacion_proveedor',
        $.param({
          query: "Estado.ValorParametro:ACTIVO",
          limit:0
        })).then(function(response) {
          self.gridOptions_proveedor.data = response.data;
        });
        //
        self.gridOptions_proveedor.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.proveedor = row.entity
              // datos banco
              self.get_info_banco($scope.proveedor.IdEntidadBancaria)
              // dato telefono
              self.get_tel_provee ($scope.proveedor.Id)
            });
          };
          self.gridOptions_proveedor.multiSelect = false;
        //
        self.get_info_banco = function(id_banco){
          coreRequest.get('banco',
          $.param({query: "Id:" + id_banco,
          })).then(function(response) {
            self.banco_proveedor = response.data[0];
          });
        }
        //
        self.get_tel_provee = function(id_prove){
          agoraRequest.get('proveedor_telefono',
          $.param({query: "Id:" + id_prove,
          })).then(function(response) {
            self.tel_proveedor = response.data[0];
          });
        }
      },
      controllerAs:'d_pvListar'
    };
  });
