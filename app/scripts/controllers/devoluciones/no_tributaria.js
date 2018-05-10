'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesNoTributariaCtrl
 * @description
 * # DevolucionesNoTributariaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesNoTributariaCtrl', function ($scope,$translate,uiGridConstants,financieraRequest,agoraRequest) {
    var ctrl = this;

    ctrl.gridOrdenesDePago = {
      enableRowSelection: true,
      enableSelectAll: true,
      selectionRowHeaderWidth: 35,
      multiSelect: true,
      enableRowHeaderSelection: true,
      showColumnFooter: true,
      paginationPageSizes: [10, 50, 100],
      paginationPageSize: null,

      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      minRowsToShow: 10,
      useExternalPagination: false,

      columnDefs: [{
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
            //term: 'OP-PROV',
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.tipos
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
          field: 'ValorBase',
          width: '10%',
          cellFilter: 'currency',
          cellClass: 'input_right',
          displayName: $translate.instant('VALOR')
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '7%',
          displayName: $translate.instant('ESTADO'),
          filter: {
            //term: 'Elaborado',
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.estado_select

          }
        },
        {
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '5%',
          cellTemplate: '<center>' +
            '<a class="ver" ng-click="grid.appScope.opViewAll.op_detalle(row)">' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.opViewAll.op_editar(row);" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' +
            '</center>'
        },

      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          $scope.estado = row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago;
        });
      }
    };

    ctrl.consultarListas= function(){
      financieraRequest.get('forma_pago',
        $.param({
          limit:'-1'
        })
      ).then(function(response){
        ctrl.formasPago = response.data;
      });
      financieraRequest.get('tipo_cuenta_bancaria',
        $.param({
          limit:'-1'
        })
      ).then(function(response){
        ctrl.tiposCuenta = response.data;
      });

      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        var year = parseInt(response.data);
        ctrl.anos = [];
        for (var i = 0; i < 5; i++) {
          ctrl.anos.push(year - i);
        }
      });

      financieraRequest.get('unidad_ejecutora', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.unidadesejecutoras = response.data;
      });

      financieraRequest.get('acta_devolucion', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.actas = response.data;
      });

      financieraRequest.get('razon_devolucion', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.razonesDevolucion = response.data;
      });
   }

   ctrl.consultarListas();



ctrl.cargarOrdenesPago = function (){

    financieraRequest.get('orden_pago', $.param({
        limit: -1
    })).then(function(response) {
      ctrl.gridOrdenesDePago.data = response.data;
      // data proveedor
      angular.forEach(ctrl.gridOrdenesDePago.data, function(iterador) {
        agoraRequest.get('informacion_proveedor',
          $.param({
            query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
          })
        ).then(function(response) {
          iterador.Proveedor = response.data[0];
        });
      });
    });
};

ctrl.cargarOrdenesPago();

  });
