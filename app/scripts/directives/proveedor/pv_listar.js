'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:proveedor/pvListar
 * @description
 * # proveedor/pvListar
 */
angular.module('financieraClienteApp')
  .directive('pvListar', function (agoraRequest) {
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
            {field: 'NumDocumento',    displayName: 'Num Documento'},
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
          // datos banco
        });
        //
        self.get_info_bamco = function (id_banco){
          agoraRequest.get('banco',$.param({query: "id":id_banco})
            ).then(function(response) {
              self.banco.data = response.data;
                console.log('banco')
                console.log(self.banco.data)
          });

        }
        self.gridOptions_proveedor.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.proveedor = row.entity
            });
          };
          self.gridOptions_proveedor.multiSelect = false;
        //
      },
      controllerAs:'d_pvListar'
    };
  });
