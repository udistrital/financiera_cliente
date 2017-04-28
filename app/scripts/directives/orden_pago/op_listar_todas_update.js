'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opListarTodasUpdate
 * @description
 * # ordenPago/opListarTodasUpdate
 */
angular.module('financieraClienteApp')
  .directive('opListarTodasUpdate', function(financieraRequest, $location, $translate) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'views/directives/orden_pago/op_listar_todas_update.html',
      controller: function() {
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
                <button ng-click="grid.appScope.d_opListarTodasUpdate.op_editar(row)" type="button" class="btn btn-primary btn-circle"><i class="glyphicon glyphicon-pencil"></i></button>\
               </center>'
          }
        ];
        self.op_editar = function(row) {
          var path_update = "";
          console.log("Editar");
          console.log(row.entity);
        }
        financieraRequest.get('orden_pago', 'limit=-1').then(function(response) {
          self.gridOrdenesDePago.data = response.data;
        });
        // fin
      },
      controllerAs: 'd_opListarTodasUpdate'
    };
  });
