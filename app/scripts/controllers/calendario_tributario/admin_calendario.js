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
        //console.log(response);
      });
    };

    self.cargar_calendario();



    self.expandableRowTemplate = '<div ui-grid="row.entity.subGridOptions"  ui-grid-auto-resize></div>';

    self.gridOptions2 = {
      expandableRowTemplate: self.expandableRowTemplate,
      //expandableRowHeight: 150,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableFiltering: true,
      //subGridVariable will be available in subGrid scope
      /*expandableRowScope: {
        subGridVariable: 'subGridScopeVariable'
      }*/
    };

    self.gridOptions2.columnDefs = [{
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
        self.gridOptions2.data =self.calendario_movimientos;
        console.log(response.data);
        for (var i = 0; i < self.gridOptions2.data.length; i++) {                    
          self.gridOptions2.data[i].subGridOptions = {
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
            data: self.gridOptions2.data[i].Movimientos
          };
        }
      });
    };

    self.cargar_movimientos();

    self.gridOptions2.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
    };

  });
