'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opListarTodas
 * @description
 * # ordenPago/opListarTodas
 */
angular.module('financieraClienteApp')
  .directive('opListarTodas', function (financieraRequest) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'views/directives/orden_pago/op_listar_todas.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_unidad_ejecutora = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableFiltering: true,

          columnDefs : [
            {field: 'Id',                                                       displayName: 'Código'},
            {field: 'Vigencia',                                                 displayName: 'Vigencia'},
            {field: 'FechaCreacion',                                            displayName: 'Fecha Creacion'},
            {field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',          displayName: 'Registro Presupuestal'},
            {field: 'TipoOrdenPago.Nombre',                                     displayName: 'Tipo Documento'},
            {field: 'EstadoOrdenPago.Nombre',                                   displayName: 'Estado'}
          ]
        };

        financieraRequest.get('orden_pago','limit=0').then(function(response) {
          self.gridOptions_unidad_ejecutora.data = response.data;
        });

        self.gridOptions_unidad_ejecutora.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.unidaejecutora = row.entity
            });
          };
          self.gridOptions_unidad_ejecutora.multiSelect = false;      //
      },
      controllerAs:'d_opListarTodas'
    };
  });
