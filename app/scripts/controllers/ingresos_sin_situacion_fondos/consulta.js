'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosSinSituacionFondosConsultaCtrl
 * @description
 * # IngresosSinSituacionFondosConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosSinSituacionFondosConsultaCtrl', function ($scope,$translate) {
    var ctrl = this;

    $scope.botones = [
        {clase_color:"ver",clase_css:"fa fa-product-hunt fa-lg faa-shake animated-hover",titulo:$translate.instant("ESTADO"),operacion:"proceso",estado:true}
    ];

    ctrl.gridIngresoNoSF = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [
          {
              field: 'Id',
              displayName:$translate.instant('NUMERO_OPERACION'),
              cellClass: 'input_center',
              headerCellClass:'text-info',
              width: '15%'
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass:'input_center',
              headerCellClass:'text-info',
              width: '17%'
          },
          {
              field: 'UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              cellClass:'input_center',
              headerCellClass:'text-info',
              width: '17%'
          },
          {
              field: 'UnidadEjecutora.Nombre',
              displayName: $translate.instant('RUBRO'),
              cellClass:'input_center',
              headerCellClass:'text-info',
              width: '17%'
          },
          {
              field: 'ValorTotal',
              displayName: $translate.instant('VALOR'),
              width: '17%',
              cellFilter:"currency",
              headerCellClass:'text-info',
              cellClass: 'input_right'
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '17%',
              headerCellClass:'text-info',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ]
    };
  });
