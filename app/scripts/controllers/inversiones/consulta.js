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


      ctrl.cargarEstados = function() {
          financieraRequest.get("estado_inversion", $.param({
                  sortby: "NumeroOrden",
                  limit: -1,
                  order: "asc"
              }))
              .then(function(response) {
                  $scope.estados = [];
                  $scope.aristas = [];
                  ctrl.estados = response.data;
                  angular.forEach(ctrl.estados, function(estado) {
                      $scope.estados.push({
                          id: estado.NumeroOrden,
                          label: estado.Nombre
                      });
                      $scope.estado_select.push({
                          value: estado.Nombre,
                          label: estado.Nombre,
                          estado: estado
                      });
                  });
                  $scope.aristas = [{
                          from: 1,
                          to: 2
                      },
                      {
                          from: 1,
                          to: 3
                      },
                      {
                          from: 2,
                          to: 4
                      },
                      {
                          from: 2,
                          to: 5
                      },
                      {
                          from: 4,
                          to: 6
                      },
                      {
                          from: 4,
                          to: 7
                      }
                  ];
              });
      };

      ctrl.cargarEstados();

  });
