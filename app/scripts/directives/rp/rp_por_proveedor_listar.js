'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rp/rpPorProveedorListar
 * @description
 * # rp/rpPorProveedorListar
 */
angular.module('financieraClienteApp')
  .directive('rpPorProveedorListar', function (financieraRequest, $timeout) {
    return {
      restrict: 'E',
      scope:{
          beneficiaroid:'=?',
          rpselect: '=?'
        },

      templateUrl: '/views/directives/rp/rp_por_proveedor_listar.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_proveedor = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableFiltering: true,

          columnDefs : [
            {field: 'Id',                             visible : false},
            {field: 'NumeroRegistroPresupuestal',     displayName: 'Numero RP'},
            {field: 'Estado.Nombre',                  displayName: 'Estado'},
            {field: 'Vigencia',                       displayName: 'Vigencia'}
          ]
        };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };

        $scope.$watch('beneficiaroid', function(){
          self.refresh();
          if($scope.beneficiaroid){
            financieraRequest.get('registro_presupuestal',
              $.param({
                  query: "Beneficiario:" + $scope.beneficiaroid,
                  limit: 0,
              })).then(function(response) {
                self.gridOptions_proveedor.data = response.data;
            });
          }
        })


        self.gridOptions_proveedor.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.rpselect = row.entity;
              //consulta rp

            });
          };
          self.gridOptions_proveedor.multiSelect = false;

      //
      },
      controllerAs:'d_rpPorProveedorListar'
    };
  });
