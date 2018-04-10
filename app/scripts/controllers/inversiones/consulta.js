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

    $scope.botones = [
        //{ clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
        { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
        //{ clase_color: "ver", clase_css: "fa fa-check fa-lg faa-shake animated-hover", titulo: $translate.instant('LEGALIZAR'), operacion: 'legalizar', estado: true }

    ];

    ctrl.gridInversiones = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [{
              field: 'Id',
              displayName: 'Consecutivo',
              width: '5%',
          },
          {
              field: 'Vendedor',
              displayName: 'Vendedor',
              width: '10%',
          },
          {
              field: 'Emisor',
              displayName: 'Emisor',
              width: '15%',
          },
          {
              field: 'NumOperacion',
              displayName: 'Numero Operación',
              width: '10%'
          },
          {
              field: 'Trm',
              displayName: 'TRM',
              width: '14%'
          },
          {
              field: 'TasaNominal',
              displayName: 'Tasa Nominal',
              width: '14%'
          },
          {
              field: 'ValorNomSaldo',
              displayName: 'Valor Nom. Saldo',
              width: '8%',
          },
          {
              field: 'ValorNomSaldoMonNal',
              displayName: 'Valor Nom. Saldo Mon. Nal',
              width: '8%',
          },
          {
              field: 'ValorActual',
              displayName: 'Valor Actual',
              width: '8%',
          },
          {
              field: 'ValorNetoGirar',
              displayName: 'Valor Neto Girar',
              width: '8%',
          },
          {
              field: 'FechaCompra',
              displayName: 'Fecha Compra',
              width: '8%',
          },
          {
              field: 'FechaRedencion',
              displayName: 'Fecha Redencion',
              width: '8%',
          },
          {
              field: 'FechaVencimiento',
              displayName: 'Fecha Vencimiento',
              width: '8%',
          },
          {
              field: 'Comprador',
              displayName: 'Comprador',
              width: '8%',
          },
          {
              field: 'ValorRecompra',
              displayName: 'Valor Recompra',
              width: '8%',
          },
          {
              field: 'FechaPacto',
              displayName: 'Fecha Pacto',
              width: '8%',
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '8%',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ]
    };

    ctrl.getInversiones = function() {
        financieraRequest.get("inversion", $.param({
                limit: -1,
                sortby: "Id",
                order: "asc"
            })).then(function(response) {
              ctrl.gridInversiones.data = response.data;
            });

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
                          id: estado.Id,
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


      ctrl.getInversiones();
      ctrl.cargarEstados();

      $scope.loadrow = function(row, operacion) {
          $scope.solicitud = row.entity;

          switch (operacion) {
              case "proceso":
              console.log($scope.solicitud);
                  $scope.estado = [{Id:	1,
                                    Nombre:	"Elaborado",
                                    Descripcion:	"Creación orden de compra inversión",
                                    Activo:	true,
                                    CodigoAbreviacion:	"EL",
                                    NumeroOrden:	1}];
                  break;
              default:
          }
      };

  });
