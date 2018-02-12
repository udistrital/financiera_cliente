'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoGirosGirosViewAllCtrl
 * @description
 * # OrdenPagoGirosGirosViewAllCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpGirosViewAllCtrl', function($scope, financieraRequest, $window, $translate, $location, coreRequest, uiGridConstants) {
    var self = this;
    self.selectEstadoGiro = [];

    self.gridGiros = {
      showColumnFooter: false,
      enableRowSelection: true,
      enableRowHeaderSelection: true,

      paginationPageSizes: [15, 30, 45],
      paginationPageSize: null,

      enableFiltering: true,
      enableSelectAll: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      minRowsToShow: 15,
      useExternalPagination: false,

      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'Consecutivo',
          displayName: $translate.instant('CODIGO'),
          width: '10%',
          cellClass: 'input_center'
        },
        {
          field: 'Vigencia',
          width: '10%',
          cellClass: 'input_center',
          displayName: $translate.instant('VIGENCIA'),
        },
        {
          field: 'FechaRegistro',
          width: '10%',
          cellFilter: "date:'yyyy-MM-dd'",
          displayName: $translate.instant('FECHA_CREACION'),
          cellClass: 'input_center',
        },
        {
          field: 'FormaPago.CodigoAbreviacion',
          displayName: $translate.instant('FORMA_PAGO'),
          width: '10%',
          cellClass: 'input_center'
        },
        {
          field: 'ValorTotal',
          displayName: $translate.instant('VALOR'),
          width: '10%',
          cellFilter: 'currency',
          cellClass: 'input_right',
        },
        {
          field: 'CuentaBancaria.NumeroCuenta',
          displayName: $translate.instant('CUENTA_BANCARIA'),
          width: '10%',
          cellClass: 'input_center'
        },
        {
          field: 'Sucursal.Banco.DenominacionBanco',
          displayName: $translate.instant('BANCO'),
          width: '10%',
          cellClass: 'input_center'
        },
        {
          field: 'GiroEstadoGiro[0].EstadoGiro.Nombre',
          width: '10%',
          displayName: $translate.instant('ESTADO'),
          filter: {
            //term: 'Elaborado',
            type: uiGridConstants.filter.SELECT,
            selectOptions: self.selectEstadoGiro
          }
        },
        {
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '10%',
          cellTemplate: '<center>' +
            '<a class="ver" ng-click="grid.appScope.opGirosViewAll.detalle(row)">' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a class="editar" ng-click="grid.appScope.opViewAll.op_editar(row);" data-toggle="modal" data-target="#myModal">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover" aria-hidden="true"></i></a> ' +
            '</center>'
        },
      ]
    };
    self.gridGiros.multiSelect = true;
    self.gridGiros.enablePaginationControls = true;
    self.gridGiros.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        $scope.outputopselect = self.gridApi.selection.getSelectedRows();
      });
    };
    // data GridGiros
    financieraRequest.get('giro',
      $.param({
        limit: -1
      })
    ).then(function(response) {
      self.gridGiros.data = response.data;
      angular.forEach(self.gridGiros.data, function(iterador) {
        coreRequest.get('sucursal',
          $.param({
            query: "Id:" + iterador.CuentaBancaria.Sucursal,
            limit: 1,
          })).then(function(response) {
          iterador.Sucursal = response.data[0];
        })
      })
    })
    // dataFilter
    // datos Estados Giros
    financieraRequest.get("estado_giro",
      $.param({
        sortby: "NumeroOrden",
        limit: -1,
        order: "asc",
      })
    ).then(function(response) {
      angular.forEach(response.data, function(tipo) {
        self.selectEstadoGiro.push({
          value: tipo.Nombre,
          label: tipo.Nombre,
        });
      });
    });

    // refrescar
    self.refresh = function() {
      $scope.refresh = true;
      $timeout(function() {
        $scope.refresh = false;
      }, 0);
    };
    //
    self.detalle = function(row) {
      var path = "/orden_pago/giros/ver/"
      $location.url(path + row.entity.Id)
    }
    self.editar = function(row) {
      var path = "/homologacion_concepto/actualizar/"
      $location.url(path + row.entity.Id)
    }

    //f
  });
