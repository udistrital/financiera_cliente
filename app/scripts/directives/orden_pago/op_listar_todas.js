'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opListarTodas
 * @description
 * # ordenPago/opListarTodas
 */
angular.module('financieraClienteApp')
  .directive('opListarTodas', function (financieraRequest, $location, $translate) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'views/directives/orden_pago/op_listar_todas.html',
      controller:function($scope){
        var self = this;
        console.log(self.pp);
        self.gridOrdenesDePago = {
          enableFiltering: true,
          onRegisterApi: function(gridApi){
            self.gridApi = gridApi;
          }
        };
        self.gridOrdenesDePago.columnDefs = [
            {field: 'Id',                                                       displayName: $translate.instant('CODIGO')},
            {field: 'Vigencia',                                                 displayName: $translate.instant('VIGENCIA')},
            {field: 'FechaCreacion',                                            displayName: $translate.instant('FECHA_CREACION')},
            {field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',          displayName: $translate.instant('NO_CRP')},
            {field: 'TipoOrdenPago.Nombre',                                     displayName: $translate.instant('TIPO_DOCUMENTO')},
            {field: 'EstadoOrdenPago.Nombre',                                   displayName: $translate.instant('ESTADO')},
            {
              //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
              name: $translate.instant('OPERACION'),
              enableFiltering: false,
              cellTemplate:
              '<center>\
                <button ng-click="grid.appScope.d_opListarTodas.op_detalle(row)" type="button" class="btn btn-primary btn-circle"><i class="glyphicon glyphicon-search"></i></button>\
               </center>'
            }
          ];
        self.op_detalle = function(row){
          var path = "/orden_pago/proveedor/"
          $location.url(path + row.entity.Id);
        }
        self.op_editar = function(row){
          console.log("Editar");
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
