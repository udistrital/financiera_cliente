'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesConsultaCtrl
 * @description
 * # InversionesConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesConsultaCtrl', function ($scope, financieraRequest, $localStorage, agoraRequest, $location, $translate, uiGridConstants, $window) {

   var ctrl = this;

    $scope.estado_select = [];
    $scope.estados = [];
    $scope.tipos = [];
    $scope.estado_select = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.senDataEstado = {};
    $scope.senDataEstado.Usuario = {
      'Id': 1
    }

    ctrl.gridInversiones = {
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
      useExternalPagination: false
    };


      ctrl.gridInversiones.columnDefs = [
        {
          displayName: 'Vendedor',
          width: '7%',
          cellClass: 'input_center'
        },
        {
          displayName: 'Fecha compra',
          cellClass: 'input_center',
          cellFilter: "date:'yyyy-MM-dd'",
          width: '8%',
        },
        {
          displayName: $translate.instant('Valor'),
          width: '7%',
          cellClass: 'input_center'
        },
        {
          width: '5%',
          displayName: 'Comprador'
        },
        {
          width: '7%',
          displayName: $translate.instant('ESTADO'),
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.estado_select
          }
        }
      ];





  });
