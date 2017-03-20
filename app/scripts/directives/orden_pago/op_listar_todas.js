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
        self.gridOrdenesDePago = {
          enableFiltering: true,
          onRegisterApi: function(gridApi){
            self.gridApi = gridApi;
          }
        };
        self.gridOrdenesDePago.columnDefs = [
            {field: 'Id',                                                       displayName: 'Código'},
            {field: 'Vigencia',                                                 displayName: 'Vigencia'},
            {field: 'FechaCreacion',                                            displayName: 'Fecha Creacion'},
            {field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',          displayName: 'Registro Presupuestal'},
            {field: 'TipoOrdenPago.Nombre',                                     displayName: 'Tipo Documento'},
            {field: 'EstadoOrdenPago.Nombre',                                   displayName: 'Estado'},
            {
              //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
              name: 'Operacion',
              enableFiltering: false,
              cellTemplate:
              '<center>\
                <button ng-click="grid.appScope.d_opListarTodas.hola(row)" type="button" class="btn btn-primary btn-circle"><i class="glyphicon glyphicon-search"></i></button>\
                <button ng-click="grid.appScope.d_opListarTodas.hola(row)" type="button" class="btn btn-success btn-circle"><i class="glyphicon glyphicon-pencil"></i></button>\
              </center>'
            }
          ];
        self.hola = function(row){
          console.log("hola");
          console.log(row.entity);
        }
        financieraRequest.get('orden_pago','limit=0').then(function(response) {
          self.gridOrdenesDePago.data = response.data;
        });
      //
      },
      controllerAs:'d_opListarTodas'
    };
  });
