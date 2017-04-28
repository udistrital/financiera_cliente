'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opListarTodas
 * @description
 * # ordenPago/opListarTodas
 */
angular.module('financieraClienteApp')
  .directive('opListarTodas', function(financieraRequest, $location, $translate) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'views/directives/orden_pago/op_listar_todas.html',
      controller: function($scope) {
        var self = this;
        self.gridOrdenesDePago = {
          enableFiltering: true,
          onRegisterApi: function(gridApi) {
            self.gridApi = gridApi;
          }
        };
        self.gridOrdenesDePago.columnDefs = [{
            field: 'Id',
            displayName: $translate.instant('CODIGO'),
            width: '8%',
            cellClass: 'input_center'
          },
          {
            field: 'Vigencia',
            displayName: $translate.instant('VIGENCIA'),
            width: '8%',
            cellClass: 'input_center'
          },
          {
            field: 'FechaCreacion',
            displayName: $translate.instant('FECHA_CREACION'),
            cellClass: 'input_center'
          },
          {
            field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
            displayName: $translate.instant('NO_CRP'),
            width: '8%',
            cellClass: 'input_center'
          },
          {
            field: 'TipoOrdenPago.Nombre',
            displayName: $translate.instant('TIPO_DOCUMENTO')
          },
          {
            field: 'EstadoOrdenPago.Nombre',
            displayName: $translate.instant('ESTADO')
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: $translate.instant('OPERACION'),
            enableFiltering: false,
            cellTemplate: '<center>\
                <button ng-click="grid.appScope.d_opListarTodas.op_detalle(row)" type="button" class="btn btn-primary btn-circle"><i class="glyphicon glyphicon-search"></i></button>\
               </center>'
          }
        ];
        self.op_detalle = function(row) {
          var path = "/orden_pago/proveedor/ver/";
          $location.url(path + row.entity.Id);
        }
        financieraRequest.get('orden_pago', 'limit=0').then(function(response) {
          self.gridOrdenesDePago.data = response.data;
        });
        //
      },
      controllerAs: 'd_opListarTodas'
    };
  });
