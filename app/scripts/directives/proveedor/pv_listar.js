'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:proveedor/pvListar
 * @description
 * # proveedor/pvListar
 */
angular.module('financieraClienteApp')
  .directive('pvListar', function () {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: '/views/directives/proveedor/pv_listar.html',
      controller:function(){
        var self = this;
        self.gridOptions_proveedor = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          columnDefs : [
            {field: 'Id',             visible : false},
            {field: 'Nombre',         displayName: 'Nombre'},
            {field: 'Descripcion',    displayName: 'Descripcion'}
          ]
        };

        financieraRequest.get('unidad_ejecutora','limit=0').then(function(response) {
          self.gridOptions_proveedor.data = response.data;
        });

        self.gridOptions_proveedor.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.unidaejecutora = row.entity
            });
          };
          self.gridOptions_proveedor.multiSelect = false;
        //
      },
      controllerAs:'d_pvListar'
    };
  });
