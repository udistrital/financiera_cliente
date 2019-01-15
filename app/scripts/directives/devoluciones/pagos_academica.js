'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:devoluciones/pagosAcademica
 * @description
 * # devoluciones/pagosAcademica
 */
angular.module('financieraClienteApp')
  .directive('devolPagosAcademica', function ( uiGridConstants, $translate) {
    return {
      restrict: 'E',
      scope:{
          inforecibos: '=?',
          valorsolicitado:'=?'
        },

      templateUrl: 'views/directives/devoluciones/pagos_academica.html',
      controller:function($scope,$attrs){
        var ctrl = this;
        $scope.botones = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg faa-shake animated-hover", titulo: $translate.instant('BTN.VER_PAGOS'), operacion: 'ver', estado: true },
        ];
        ctrl.gridPagos = {

            enableRowSelection: true,
            enableSelectAll: false,
            selectionRowHeaderWidth: 35,
            multiSelect: true,
            enableRowHeaderSelection: true,
            showColumnFooter: true,


            enableHorizontalScrollbar: true,
            enableVerticalScrollbar: 0,

            enableFiltering: true,
            enableSorting: true,


            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,

            onRegisterApi: function(gridApi) {
              ctrl.gridApi = gridApi;
              gridApi.selection.on.rowSelectionChanged($scope, function(row) {

                if(angular.isUndefined($scope.valorsolicitado)){
                    $scope.valorsolicitado = 0;
                }
                if(row.isSelected){
                  $scope.valorsolicitado=$scope.valorsolicitado + row.entity.Total;
                }else{
                  $scope.valorsolicitado=$scope.valorsolicitado - row.entity.Total;
                }
              });

              gridApi.selection.on.rowSelectionChangedBatch($scope, function(row) {
               $scope.valorsolicitado = 0;
               gridApi.selection.getSelectedGridRows().forEach(function(row) {
                 if(row.isSelected){
                   $scope.valorsolicitado=$scope.valorsolicitado + row.entity.Total;
                 }else{
                   $scope.valorsolicitado=$scope.valorsolicitado - row.entity.Total;
                 }
                        });
                });
            },

            columnDefs: [{
                    field: 'Numero_Recibo',
                    displayName: $translate.instant('NUMERO') + " " + $translate.instant('RECIBO'),
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                    enableCellEdit: false,
                    width: '20%'
                },
                {
                    field: 'Periodo',
                    displayName: $translate.instant('PERIODO'),
                    headerCellClass: 'encabezado',
                    enableCellEdit: false,
                    cellClass: 'input_center',
                    width: '10%'
                },
                {
                    field: 'Fecha_Extraordinario',
                    displayName: $translate.instant('FECHA') + " "+$translate.instant('EXTRAORDINARIO'),
                    cellFilter: "date:'yyyy-MM-dd'",
                    headerCellClass: 'encabezado',
                    enableCellEdit: false,
                    cellClass: 'input_center',
                    width: '20%'
                },
                {
                    field: 'Fecha_Ordinario',
                    displayName: $translate.instant('FECHA') + " "+ $translate.instant('ORDINARIO'),
                    cellFilter: "date:'yyyy-MM-dd'",
                    cellClass: 'input_center',
                    headerCellClass: 'encabezado',
                    enableCellEdit: false,
                    width: '20%'
                },
                {
                    field: 'Pago',
                    displayName: $translate.instant('PAGO_REPORTADO'),
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                    enableCellEdit: false,
                    width: '5%'
                },
                {
                    field: 'Total',
                    displayName: $translate.instant('TOTAL'),
                    cellClass: 'input_right',
                    width: '15%',
                    headerCellClass: 'encabezado',
                    type: 'number',
                    cellFilter: 'currency',
                    enableCellEdit: false,
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellTemplate: '<div>{{col.getAggregationValue() | currency}}</div>',
                    footerCellClass: 'input_right'
                },
                {
                    name: $translate.instant('OPCIONES'),
                    width: '10%',
                    headerCellClass: 'encabezado',
                    cellClass: 'input_center',
                    cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
                },
            ]
        };

        ctrl.gridDetallePago = {

            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            multiSelect: true,
            enableRowHeaderSelection: true,
            showColumnFooter: true,


            enableHorizontalScrollbar: true,
            enableVerticalScrollbar: 0,

            enableFiltering: true,
            enableSorting: true,

            paginationPageSizes: [5, 15, 20],
            paginationPageSize: 5,

            columnDefs: [{
                    field: 'Descripcion',
                    displayName: $translate.instant('DESCRIPCION'),
                    headerCellClass: 'encabezado',
                    enableCellEdit: false,
                    width: '50%'
                },
                {
                    field: 'Valor',
                    displayName: $translate.instant('VALOR'),
                    cellClass: 'input_right',
                    width: '50%',
                    headerCellClass: 'encabezado',
                    type: 'number',
                    cellFilter: 'currency',
                    enableCellEdit: false,
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellTemplate: '<div>{{col.getAggregationValue() | currency}}</div>',
                    footerCellClass: 'input_right'
                }
            ]
        };

        ctrl.cargarPagos = function(){
        ctrl.gridPagos.data = $scope.inforecibos.InformacionRecibos;
        };

        ctrl.cargarPagos();

        $scope.loadrow = function(row, operacion) {
          ctrl.operacion = operacion;
          switch (operacion) {
              case "ver":
              $("#DetallePago").modal();
                  ctrl.gridDetallePago.data = row.entity.DesagregaRecibos;
                  break;

              case "otro":

              break;
              default:
          }
        };

        $scope.$watch('inforecibos',function(newValue){
            ctrl.cargarPagos();
        },true)
      },
      controllerAs:'d_devol_pagosAcademica'
    };
  });
