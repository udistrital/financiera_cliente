'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CalendarioTributarioAdminCalendarioCtrl
 * @description
 * # CalendarioTributarioAdminCalendarioCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AdminCalendarioCtrl', function($scope, $translate, uiGridConstants) {
    var self = this;

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      showColumnFooter: true,
      enableFiltering: false,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'tipo',
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          displayName: $translate.instant('TIPO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '8%'
        },
        {
          field: 'numero',
          displayName: $translate.instant('NO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '7%'
        },
        {
          field: 'tercero',
          displayName: $translate.instant('TERCERO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '65%'
        },
        {
          field: 'valor_base',
          displayName: $translate.instant('VALOR_BASE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '10%'
        },
        {
          field: 'valor',
          displayName: $translate.instant('VALOR'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '10%',
          aggregationType: uiGridConstants.aggregationTypes.sum
        }
      ]
    };

    //opciones extras para el control del grid
    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
    self.gridOptions.enablePaginationControls = false;
    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.cuenta = self.gridApi.selection.getSelectedRows()[0];
      });
    };

    self.calendario = {
      Descripcion: "Calendario prueba mes Enero de 2017 ",
      FechaInicio: "01-05-2015",
      FechaFin: "30-06-2015",
      Vigencia: 2015,
      Entidad: {
        CodigoEntidad: "209",
        Nombre: "Universidad Distrital"
      },
      EstadoCalendario: {
        Nombre: "Sin pagar"
      },
      Responsable: 19654664
    };

    self.gridOptions.data = [{
        tipo: "OP",
        numero: 154,
        tercero: "cc 1515646 Francisco Hurtado Meyer",
        valor_base: 15000000,
        valor: 150000

      },
      {
        tipo: "OP",
        numero: 154,
        tercero: "cc 1515646 Francisco Hurtado Meyer",
        valor_base: 15000000,
        valor: 150000

      },
      {
        tipo: "OP",
        numero: 154,
        tercero: "cc 1515646 Francisco Hurtado Meyer",
        valor_base: 15000000,
        valor: 150000

      }
    ];

    ////////////////////////////////////////////////////////////////////////




    self.expandableRowTemplate = '<div ui-grid="row.entity.subGridOptions"  ui-grid-auto-resize></div>';

    self.gridOptions2 = {
      expandableRowTemplate: self.expandableRowTemplate,
      //expandableRowHeight: 150,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0
      //subGridVariable will be available in subGrid scope
      /*expandableRowScope: {
        subGridVariable: 'subGridScopeVariable'
      }*/
    };

    self.gridOptions2.columnDefs = [{
        name: 'Codigo',
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
      },
      {
        name: 'Nombre',
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
      },
      {
        name: 'Proveedor',
        headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
      }
    ];

    self.gridOptions2.data = [{
        Codigo: "2-4-03",
        Nombre: "Retencion Fuente x",
        Proveedor: "DIAN",
        Movimientos: [{
            tipo: "OP",
            numero: 154,
            tercero: "cc 1515646 Francisco Hurtado Meyer",
            valor_base: 15000000,
            valor: 150000
          },
          {
            tipo: "OP",
            numero: 152,
            tercero: "cc 1515646 Francisco Hurtado Meyer",
            valor_base: 15000000,
            valor: 150000
          }
        ]
      },
      {
        Codigo: "2-4-03",
        Nombre: "Retencion LEY x",
        Proveedor: "DIAN",
        Movimientos: [{
            tipo: "OP",
            numero: 154,
            tercero: "cc 1515646 Francisco Hurtado Meyer",
            valor_base: 12000000,
            valor: 120000
          },
          {
            tipo: "OP",
            numero: 152,
            tercero: "cc 1515646 Francisco Hurtado Meyer",
            valor_base: 25000000,
            valor: 250000
          }
        ]
      },
      {
        Codigo: "2-4-03",
        Nombre: "Retencion LEY x",
        Proveedor: "DIAN",
        Movimientos: [{
            tipo: "OP",
            numero: 154,
            tercero: "cc 1515646 Francisco Hurtado Meyer",
            valor_base: 12000000,
            valor: 120000
          },
          {
            tipo: "OP",
            numero: 152,
            tercero: "cc 1515646 Francisco Hurtado Meyer",
            valor_base: 25000000,
            valor: 250000
          }
        ]
      },
      {
        Codigo: "2-4-03",
        Nombre: "Retencion LEY x",
        Proveedor: "DIAN",
        Movimientos: [{
            tipo: "OP",
            numero: 154,
            tercero: "cc 1515646 Francisco Hurtado Meyer",
            valor_base: 12000000,
            valor: 120000
          },
          {
            tipo: "OP",
            numero: 152,
            tercero: "cc 1515646 Francisco Hurtado Meyer",
            valor_base: 25000000,
            valor: 250000
          }
        ]
      }
    ];

    for (var i = 0; i < self.gridOptions2.data.length; i++) {
      self.gridOptions2.data[i].subGridOptions = {
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        showColumnFooter: true,
        enablePaginationControls: false,
        columnDefs: [{
          name: "Tipo",
          field: "tipo"
        }, {
          name: "Numero",
          field: "numero"
        }, {
          name: "Tercero",
          field: "tercero"
        }, {
          name: "Valor Base",
          field: "valor_base"
        }, {
          name: "Valor",
          field: "valor",
          aggregationType: uiGridConstants.aggregationTypes.sum
        }],
        data: self.gridOptions2.data[i].Movimientos
      };
    }

    self.gridOptions2.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
    };

  });
