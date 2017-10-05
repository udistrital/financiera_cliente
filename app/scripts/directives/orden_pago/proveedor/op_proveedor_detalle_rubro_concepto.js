'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/proveedor/opProveedorDetalleRubroConcepto
 * @description
 * # ordenPago/proveedor/opProveedorDetalleRubroConcepto
 */
angular.module('financieraClienteApp')
  .directive('opProveedorDetalleRubroConcepto', function(financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputordenpagoid: '=?'
      },

      templateUrl: 'views/directives/orden_pago/proveedor/op_proveedor_detalle_rubro_concepto.html',
      controller: function($scope) {
        var self = this;

        self.gridOptions_rubros = {
          enableRowSelection: false,
          multiSelect: false,
          enableRowHeaderSelection: false,

          paginationPageSizes: [10, 50, 100],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          //minRowsToShow: 10,
          useExternalPagination: false,

          // inicio sub tabla
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
          onRegisterApi: function(gridApi) {
            gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
              if (row.isExpanded) {
                row.entity.subGridOptions = {
                  multiSelect: true,
                  columnDefs: [{
                      field: 'Id',
                      visible: false,
                      enableCellEdit: false
                    },
                    {
                      field: 'Codigo',
                      displayName: $translate.instant('CODIGO') + ' ' + $translate.instant('CONCEPTO'),
                      enableCellEdit: false,
                      width: '10%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'Nombre',
                      displayName: $translate.instant('NOMBRE'),
                      enableCellEdit: false
                    },
                    {
                      field: 'Descripcion',
                      displayName: $translate.instant('DESCRIPCION'),
                      enableCellEdit: false
                    },
                    {
                      field: 'TipoConcepto.Nombre',
                      displayName: $translate.instant('TIPO'),
                      enableCellEdit: false,
                      width: '10%',
                    },
                  ],
                  onRegisterApi: function(gridApi) {
                    self.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged(gridApi.grid.appScope, function(row2) {
                      $scope.outputconceptos = self.gridApi.selection.getSelectedRows();
                    });
                  }
                };
                //
                financieraRequest.get('concepto',
                  $.param({
                    query: "Rubro.Id:" + row.entity.DisponibilidadApropiacion.Apropiacion.Rubro.Id,
                    limit: 0
                  })
                ).then(function(response) {
                  row.entity.subGridOptions.data = response.data;
                  //asociar RegistroPresupuestalDisponibilidadApropiacion
                  angular.forEach(row.entity.subGridOptions.data, function(subGridData) {
                    subGridData.RegistroPresupuestalDisponibilidadApropiacion = row.entity.Id
                  });
                });
              } // if
            });
          },
          // fin sub tabla
          columnDefs: [{
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Id',
              visible: false
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
              displayName: $translate.instant('CODIGO') + ' ' + $translate.instant('RUBRO'),
              cellClass: 'input_center'
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '5%',
              cellClass: 'input_center'
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',
              displayName: $translate.instant('DESCRIPCION')
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.Valor',
              displayName: $translate.instant('VALOR'),
              cellFilter: 'currency',
              width: '14%',
              cellClass: 'input_right'
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.FuenteFinanciamiento.Descripcion',
              displayName: $translate.instant('FUENTES_FINANCIACION')
            },
            {
              field: 'RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.FuenteFinanciamiento.Codigo',
              displayName: $translate.instant('FUENTE_FINANCIACION_CODIGO'),
              width: '7%',
              cellClass: 'input_center'
            },
          ]
        };

        $scope.$watch('inputordenpagoid', function() {
          if ($scope.inputordenpagoid != undefined) {
            financieraRequest.get('concepto_orden_pago',
              $.param({
                query: "OrdenDePago.Id:" + $scope.inputordenpagoid,
                limit: 0
              })
            ).then(function(response) {
              console.log(response.data);
              //quitar repetidos
              var hash = {};
              response.data = response.data.filter(function(current) {
                var exists = !hash[current.RegistroPresupuestalDisponibilidadApropiacion.Id] || false;
                hash[current.RegistroPresupuestalDisponibilidadApropiacion.Id] = true;
                return exists;
              });
              console.log("sinRepeti");
              console.log(response.data);
              //fin quitar repetidos
              self.gridOptions_rubros.data = response.data;
            });
          }
        })


        //fin
      },
      controllerAs: 'd_opProveedorDetalleRubroConcepto'
    };
  });
