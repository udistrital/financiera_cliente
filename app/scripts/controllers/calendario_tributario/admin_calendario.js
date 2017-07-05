'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CalendarioTributarioAdminCalendarioCtrl
 * @description
 * # CalendarioTributarioAdminCalendarioCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AdminCalendarioCtrl', function($scope, $translate, $routeParams, uiGridConstants, financieraRequest) {
    var self = this;

    self.idCalendario = $routeParams.Id;

    self.cargar_calendario=function(){
      financieraRequest.get('calendario_tributario',$.param({
        query: 'Id:'+self.idCalendario
      })).then(function(response){
        self.calendario=response.data[0];
      });
    };

    self.cargar_calendario();

    self.expandableRowTemplate = '<div ui-grid="row.entity.subGridOptions"  ui-grid-auto-resize></div>';

    self.gridOptions = {
      expandableRowTemplate: self.expandableRowTemplate,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableFiltering: true,
    };

    self.gridOptions.columnDefs = [{
        displayName: $translate.instant('CODIGO'),
        field: 'Impuesto.CuentaContable.Codigo',
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        cellClass: 'text-success',
        width: '20%'
      },
      {
        displayName: $translate.instant('NOMBRE'),
        field: 'Impuesto.CuentaContable.Nombre',
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        cellClass: 'text-success',
        width: '35%'
      },
      {
        displayName: $translate.instant('PROVEEDOR'),
        field: 'Impuesto.InformacionPersonaJuridica',
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
        cellClass: 'text-success',
        width: '43%'
      }
    ];

    self.cargar_movimientos=function(){
      financieraRequest.get('calendario_tributario/movimientos/'+self.idCalendario,"").then(function(response){
        self.calendario_movimientos=response.data;
        self.gridOptions.data =self.calendario_movimientos;
        console.log(response.data);
        self.calendario.MontoCalendario=0;
        angular.forEach(self.gridOptions.data,function(item){
          item.subGridOptions = {
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            showColumnFooter: true,
            enablePaginationControls: false,
            columnDefs: [{
              displayName: $translate.instant('TIPO'),
              field: "TipoDocumentoAfectante.Nombre",
              width: '15%'
            }, {
              displayName: $translate.instant('NO'),
              field: "CodigoDocumentoAfectante",
              width: '10%'
            }, {
              displayName: $translate.instant('TERCERO'),
              field: "tercero",
              width: '43%'
            }, {
              displayName: $translate.instant('CREDITO'),
              field: "Credito",
              width: '15%'
            }, {
              displayName: $translate.instant('DEBITO'),
              field: "Debito",
              aggregationType: uiGridConstants.aggregationTypes.sum,
              width: '15%'
            }],
            data: item.Movimientos
          };
          item.MontoCuenta=0;
          angular.forEach(item.Movimientos,function(movs){
            console.log("entro credito=",movs.Debito);
            item.MontoCuenta+=movs.Debito;
          });
          self.calendario.MontoCalendario+=item.MontoCuenta;
        });
        self.calendario.MontoRedondeado=Math.round(self.calendario.MontoCalendario);
        self.calendario.DiferenciaMonto= self.calendario.MontoCalendario-self.calendario.MontoRedondeado;
      });
    };

    self.cargar_movimientos();

    self.gridOptions.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
    };

  });
