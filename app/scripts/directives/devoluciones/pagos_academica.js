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
        },

      templateUrl: 'views/directives/devoluciones/pagos_academica.html',
      controller:function($scope,$attrs){
        var ctrl = this;
        ctrl.gridPagos = {
            showColumnFooter: true,
            enableCellEditOnFocus: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            enableSorting: true,
            rowEditWaitInterval: -1,
            columnDefs: [{
                    field: 'Numero_Recibo',
                    displayName: $translate.instant('NUMERO') + " " + $translate.instant('RECIBO'),
                    headerCellClass: 'text-info',
                    enableCellEdit: false,
                    width: '15%'
                },
                {
                    field: 'Periodo',
                    displayName: $translate.instant('PERIODO'),
                    headerCellClass: 'text-info',
                    enableCellEdit: false,
                    width: '40%'
                },
                {
                    field: 'Fecha_Extraordinario',
                    displayName: $translate.instant('FECHA') + $translate.instant('EXTRAORDINARIO'),
                    headerCellClass: 'text-info',
                    enableCellEdit: false,
                    width: '15%'
                },
                {
                    field: 'Fecha_Ordinario',
                    displayName: $translate.instant('FECHA') + $translate.instant('ORDINARIO'),
                    headerCellClass: 'text-info',
                    enableCellEdit: false,
                    width: '15%'
                },
                {
                    field: 'Pago',
                    displayName: $translate.instant('PAGO_REPORTADO'),
                    headerCellClass: 'text-info',
                    enableCellEdit: false,
                    width: '15%'
                },
                {
                    field: 'Total',
                    displayName: $translate.instant('TOTAL'),
                    cellClass: 'input_right',
                    width: '15%',
                    headerCellClass: 'text-info',
                    type: 'number',
                    cellFilter: 'number',
                    enableCellEdit: true,
                    cellTemplate: '<div>{{row.entity.Credito | currency:undefined:0}}</div>',
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellTemplate: '<div> Total {{grid.appScope.d_movimientosContables.suma2 | currency}}</div>',
                    footerCellClass: 'input_right'
                },
            ]
        };

        ctrl.cargarPagos = function(){
        console.log("entra a cargar pagos");
        console.log($scope.inforecibos.InformacionRecibos);
        ctrl.gridPagos.data = $scope.inforecibos.InformacionRecibos;
        };

        ctrl.cargarPagos();

        $scope.$watch('inforecibos',function(newValue){
          console.log("entra a watch");
            ctrl.cargarPagos();
        },true)
      },
      controllerAs:'d_devol_pagosAcademica'
    };
  });
