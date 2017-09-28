'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opListarTodas
 * @description
 * # ordenPago/opListarTodas
 */
angular.module('financieraClienteApp')
  .directive('opListarTodas', function(financieraRequest, agoraRequest, $location, $translate, uiGridConstants) {
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
            width: '7%',
            cellClass: 'input_center'
          },
          {
            field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
            width: '8%',
            displayName: $translate.instant('TIPO'),
            filter: {
              term: 'OP-PROV',
              type: uiGridConstants.filter.SELECT,
              selectOptions: [{value: 'OP-PROV', label: 'OP-PROV'},{value: 'OP-PLAN', label: 'OP-PLAN'} ]
            }
          },
          {
            field: 'Vigencia',
            displayName: $translate.instant('VIGENCIA'),
            width: '7%',
            cellClass: 'input_center'
          },
          {
            field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
            displayName: $translate.instant('FECHA_CREACION'),
            cellClass: 'input_center',
            cellFilter: "date:'yyyy-MM-dd'",
            width: '8%',
          },
          {
            field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
            displayName: $translate.instant('NO_CRP'),
            width: '7%',
            cellClass: 'input_center'
          },
          {
            field: 'FormaPago.CodigoAbreviacion',
            width: '5%',
            displayName: $translate.instant('FORMA_PAGO')
          },
          {
            field: 'Proveedor.Tipopersona',
            width: '10%',
            displayName: $translate.instant('TIPO_PERSONA')
          },
          {
            field: 'Proveedor.NomProveedor',
            displayName: $translate.instant('NOMBRE')
          },
          {
            field: 'Proveedor.NumDocumento',
            width: '10%',
            cellClass: 'input_center',
            displayName: $translate.instant('NO_DOCUMENTO')
          },
          {
            field: 'ValorTotal',
            width: '10%',
            cellFilter: 'currency',
            cellClass: 'input_right',
            displayName: $translate.instant('VALOR')
          },
          {
            field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
            width: '7%',
            displayName: $translate.instant('ESTADO')
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: $translate.instant('OPERACION'),
            enableFiltering: false,
            width: '5%',
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
          if (row.entity.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion == 'SEGURIDAD SOCIAL') {
            var path = "/orden_pago/seguridad_social/ver/";
            $location.url(path + row.entity.Id);
          }
          if (row.entity.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion == 'OP-PROV') {
            var path = "/orden_pago/proveedor/ver/";
            $location.url(path + row.entity.Id);
          }
          if (row.entity.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion  == 'OP-PLAN') {
            var path = "/orden_pago/planta/ver/";
            $location.url(path + row.entity.Id);
          }
        }
        self.op_editar = function(row) {
          if (row.entity.SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion == 'OP-PROV') {
            var path_update = "/orden_pago/proveedor/actualizar/";
            $location.url(path_update + row.entity.Id);
          }
        }
        // data OP
        financieraRequest.get('orden_pago', 'limit=-1').then(function(response) {
          self.gridOrdenesDePago.data = response.data;
          // data proveedor
          angular.forEach(self.gridOrdenesDePago.data, function(iterador) {
            agoraRequest.get('informacion_proveedor',
              $.param({
                query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
              })
            ).then(function(response) {
              iterador.Proveedor = response.data[0];
            });
            financieraRequest.post('orden_pago/ValorTotal/' + iterador.Id).then(function(response) {
              iterador.ValorTotal = response.data;
            });
          })
          // data proveedor
        });
        //
      },
      controllerAs: 'd_opListarTodas'
    };
  });
