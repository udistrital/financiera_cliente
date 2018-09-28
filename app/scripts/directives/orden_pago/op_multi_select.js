'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opMultiSelect
 * @description
 * # ordenPago/opMultiSelect
 */
angular.module('financieraClienteApp')
  .directive('opMultiSelect', function(financieraRequest, agoraRequest, $timeout, $translate, uiGridConstants, $interval) {
    return {
      restrict: 'E',
      scope: {
        inputestado: '=?',
        outputopselect: '=?',
        outputvisible: '=?'
      },
      templateUrl: 'views/directives/orden_pago/op_multi_select.html',
      controller: function($scope) {
        var ctrl = this;
        ctrl.hayData_detalle = true;
        ctrl.cargando_detalle = true;
        //
        ctrl.cargar_vigencia = function() {
          financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
            ctrl.vigencia_calendarios = parseInt(response.data);
            var year = parseInt(response.data) + 1;
            ctrl.vigencias = [];
            for (var i = 0; i < 5; i++) {
              ctrl.vigencias.push(year - i);
            }
          });
        };
        ctrl.cargar_vigencia();
        //
        $scope.outputvisible = true;
        ctrl.confirmar = function() {
          if ($scope.outputopselect.length > 0) {
            $scope.outputvisible = false;
          } else {
            swal({
              title: $translate.instant('GIROS'),
              text: $translate.instant('MSN_DEBE_OP_GIRO'),
              type: "error",
            })
          }
        }
        //
        financieraRequest.get('tipo_orden_pago',
          $.param({
            limit: -1,
          })
        ).then(function(response) {
          ctrl.tipoOrdenPagoData = response.data;
        })
        financieraRequest.get('forma_pago',
          $.param({
            limit: -1,
          })
        ).then(function(response) {
          ctrl.formaPagoData = response.data;
        })
        //
        ctrl.consultar = function() {
          if (ctrl.tipoOrdenPagoSelect != undefined && ctrl.formaPagoSelect != undefined && $scope.inputestado != undefined && ctrl.vigenciaSelect != undefined) {
            financieraRequest.get("orden_pago/GetOrdenPagoByEstado/",
              $.param({
                codigoEstado: $scope.inputestado,
                vigencia: ctrl.vigenciaSelect,
                tipoOp: ctrl.tipoOrdenPagoSelect.Id,
                formaPago: ctrl.formaPagoSelect.Id,
              })
            ).then(function(response) {
              ctrl.refresh();
              if (response.data != null) {
                ctrl.gridOptions_op.data = response.data;
                ctrl.hayData_detalle = true;
                ctrl.cargando_detalle = false;
                // data
                angular.forEach(ctrl.gridOptions_op.data, function(iterador) {
                  agoraRequest.get('informacion_proveedor',
                    $.param({
                      query: "Id:" + iterador.OrdenPagoRegistroPresupuestal[0].RegistroPresupuestal.Beneficiario, //SubaTours Example TODO:22487
                    })
                  ).then(function(response) {
                    iterador.Proveedor = response.data[0];
                  });
                  financieraRequest.post('orden_pago/ValorTotal/' + iterador.Id).then(function(response) {
                    iterador.ValorTotal = response.data;
                  });
                })
                // data proveedor
              } else {
                ctrl.gridOptions_op.data = null;
                ctrl.hayData_detalle = false;
                ctrl.cargando_detalle = false;
                ctrl.refresh();
              }
            });
          } else {
            ctrl.gridOptions_op.data = null;
            ctrl.hayData_detalle = false;
            ctrl.cargando_detalle = false;
            ctrl.refresh();
          }
        }
        //
        ctrl.gridOptions_op = {
          showColumnFooter: false,
          enableRowSelection: true,
          enableRowHeaderSelection: true,

          paginationPageSizes: [15, 30, 45],
          paginationPageSize: 15,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 15,
          useExternalPagination: false,

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Consecutivo',
              displayName: $translate.instant('CODIGO'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
              width: '8%',
              displayName: $translate.instant('TIPO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
              displayName: $translate.instant('FECHA_CREACION'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '8%',
            },
            {
              field: 'OrdenPagoRegistroPresupuestal[0].RegistroPresupuestal.NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              width: '7%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'FormaPago.CodigoAbreviacion',
              width: '5%',
              displayName: $translate.instant('FORMA_PAGO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.Tipopersona',
              width: '10%',
              displayName: $translate.instant('TIPO_PERSONA'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.NomProveedor',
              displayName: $translate.instant('NOMBRE'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Proveedor.NumDocumento',
              width: '10%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado',
              displayName: $translate.instant('NO_DOCUMENTO')
            },
            {
              field: 'ValorTotal',
              width: '10%',
              cellFilter: 'currency',
              cellClass: 'input_right',
              displayName: $translate.instant('VALOR'),
              headerCellClass: 'encabezado'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
              width: '7%',
              displayName: $translate.instant('ESTADO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
          ],
          onRegisterApi: function(gridApi) {
            ctrl.gridOptions_op  = gridApi;
          },          
        };
        ctrl.gridOptions_op.multiSelect = true;
        ctrl.gridOptions_op.enablePaginationControls = true;
        ctrl.gridOptions_op.onRegisterApi = function(gridApi) {
          ctrl.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputopselect = ctrl.gridApi.selection.getSelectedRows();
          });
        };
        ctrl.ajustarGrid = function(gridApi) {
            $interval( function() {
              gridApi.core.handleWindowResize();
            }, 500, 2);
        };
        // refrescar
        ctrl.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };

        ctrl.consultar();
        $scope.$watch('outputvisible', function() {
          if($scope.outputvisible){
            $interval( function() {
                ctrl.gridApi.core.handleWindowResize();
              }, 500, 2);
          }
        });
        // fin
      },
      controllerAs: 'd_opMultiSelect'
    };
  });
