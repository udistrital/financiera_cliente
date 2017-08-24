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
          multiSelect: false,
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [10, 50, 100],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 10,
          useExternalPagination: false,

          onRegisterApi: function(gridApi) {
            self.gridApi = gridApi;
          }
        };
        self.gridOrdenesDePago.columnDefs = [{
            field: 'Id',
            visible: false
          },
          {
            field: 'Consecutivo',
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
            cellClass: 'input_center',
            cellFilter: "date:'yyyy-MM-dd'",
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
            field: 'Nomina',
            displayName: $translate.instant('NOMINA')
          },
          {
            field: 'EstadoOrdenPago.Nombre',
            displayName: $translate.instant('ESTADO')
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: $translate.instant('OPERACION'),
            enableFiltering: false,
            cellTemplate: '<center>' +
            '<a class="ver" ng-click="grid.appScope.d_opListarTodas.op_detalle(row)">' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.d_opListarTodas.op_editar(row);" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' +
            '</center>'
          }
        ];
        // OP Proveedores
        self.op_detalle = function(row) {
          if(row.entity.Nomina  == 'SEGURIDAD SOCIAL'){
            var path = "/orden_pago/seguridad_social/ver/";
            $location.url(path + row.entity.Id);
          }
          if(row.entity.Nomina  == 'PROVEEDOR'){
            var path = "/orden_pago/proveedor/ver/";
            $location.url(path + row.entity.Id);
          }
          if(row.entity.Nomina  == 'PLANTA'){
            var path = "/orden_pago/planta/ver/";
            $location.url(path + row.entity.Id);
          }
        }
        self.op_editar = function(row) {
          if(row.entity.Nomina  == 'PROVEEDOR'){
            var path_update = "/orden_pago/proveedor/actualizar/";
            $location.url(path_update + row.entity.Id);
          }
        }
        // data OP
        financieraRequest.get('orden_pago', 'limit=-1').then(function(response) {
          self.gridOrdenesDePago.data = response.data;
        });
        //
      },
      controllerAs: 'd_opListarTodas'
    };
  });
