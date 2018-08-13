'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaChequesGestionChequeCtrl
 * @description
 * # TesoreriaChequesGestionChequeCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaChequesGestionChequeCtrl', function ($scope,$translate,financieraRequest) {
    var ctrl = this;
    $scope.botones = [
      { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true }
    ];
    ctrl.gridCheque = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: true,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      enableRowHeaderSelection: false,
      columnDefs: [
          {
              field: 'CodigoHomologado',
              displayName: $translate.instant('CONSECUTIVO'),
              headerCellClass:'text-info',
              width: '14%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('CHEQUERA'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('ORDEN_PAGO'),
              headerCellClass:'text-info',
              width: '14%'
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('BENEFICIARIO'),
              headerCellClass:'text-info',
              width: '20%',
          },
          {
              field: 'NombreHomologado',
              displayName: $translate.instant('FECHA_VENCIMIENTO'),
              headerCellClass:'text-info',
              width: '17%',
          },
          {
            name: $translate.instant('OPCIONES'),
            width: '*',
            headerCellClass:'text-info',
            cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>',
            width: '12%'
          }
      ]
    }

    $scope.$watch('tesoreriaGestionCheque.concepto[0]', function(oldValue, newValue) {
        if (!angular.isUndefined(newValue)) {
            financieraRequest.get('concepto', $.param({
                query: "Id:" + newValue.Id,
                fields: "Rubro",
                limit: -1
            })).then(function(response) {
                $scope.tesoreriaGestionCheque.concepto[0].Rubro = response.data[0].Rubro;
            });
        }
    }, true);


  });
