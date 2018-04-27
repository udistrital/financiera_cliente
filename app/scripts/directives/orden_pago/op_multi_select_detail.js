'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/opMultiSelectDetail
 * @description
 * # ordenPago/opMultiSelectDetail
 */
angular.module('financieraClienteApp')
  .directive('opMultiSelectDetail', function(financieraRequest, agoraRequest, $timeout, $translate, uiGridConstants, coreRequest, $window) {
    return {
      restrict: 'E',
      scope: {
        inputopselect: '=?',
        inputvisible: '=?'
      },

      templateUrl: 'views/directives/orden_pago/op_multi_select_detail.html',
      controller: function($scope) {
        var self = this;
        self.giro = {};
        //
        self.regresar = function() {
          $scope.inputvisible = !$scope.inputvisible;
        }
        self.gridOptions_op_detail = {
          showColumnFooter: true,
          enableRowSelection: false,
          enableRowHeaderSelection: false,

          paginationPageSizes: [15, 30, 45],
          paginationPageSize: null,

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
              cellClass: 'input_center'
            },
            {
              field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
              width: '8%',
              displayName: $translate.instant('TIPO'),
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width: '7%',
              cellClass: 'input_center'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
              displayName: $translate.instant('FECHA_CREACION'),
              cellClass: 'input_center',
              cellFilter: "date:'yyyy-MM-dd'",
              width: '8%',
            },
            {
              field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              width: '7%',
              cellClass: 'input_center'
            },
            {
              field: 'FormaPago.CodigoAbreviacion',
              width: '5%',
              displayName: $translate.instant('FORMA_PAGO')
            },
            {
              field: 'Proveedor.Tipopersona',
              width: '10%',
              displayName: $translate.instant('TIPO_PERSONA')
            },
            {
              field: 'Proveedor.NomProveedor',
              displayName: $translate.instant('NOMBRE')
            },
            {
              field: 'Proveedor.NumDocumento',
              width: '10%',
              cellClass: 'input_center',
              displayName: $translate.instant('NO_DOCUMENTO')
            },
            {
              field: 'ValorTotal',
              width: '10%',
              cellFilter: 'currency',
              cellClass: 'input_right',
              displayName: $translate.instant('VALOR'),

              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellFilter: 'currency',
              footerCellClass: 'input_right'
            },
            {
              field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
              width: '7%',
              displayName: $translate.instant('ESTADO')
            },
          ]
        };
        self.gridOptions_op_detail.enablePaginationControls = true;
        self.gridOptions_op_detail.onRegisterApi = function(gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputopselect = row.entity;
          });
        };
        // cuentas bancarias
        self.gridOptions_cuenta_bancaria = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          paginationPageSizes: [15, 30, 45],
          enableFiltering: true,
          minRowsToShow: 8,
          useExternalPagination: false,
          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'NumeroCuenta',
              //width: '8%',
              displayName: $translate.instant('NUMERO'),
            },
            {
              field: 'TipoCuentaBancaria.Nombre',
              displayName: $translate.instant('TIPO'),
              cellClass: 'input_center'
            },
            {
              field: 'SucursalData[0].Nombre',
              displayName: $translate.instant('SUCURSAL'),
              cellClass: 'input_center'
            },
            {
              field: 'SucursalData[0].Banco.DenominacionBanco',
              displayName: $translate.instant('BANCO'),
              cellClass: 'input_center'
            },
          ]
        };
        self.gridOptions_cuenta_bancaria.multiSelect = false;
        self.gridOptions_cuenta_bancaria.onRegisterApi = function(gridApi) {
          self.gridApi2 = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if (self.gridApi2.selection.getSelectedRows()[0] != undefined) {
              self.giro.CuentaBancaria = self.gridApi2.selection.getSelectedRows()[0];
            } else {
              delete self.giro['CuentaBancaria']
            }
          });
        };
        financieraRequest.get('cuenta_bancaria',
          $.param({
            query: "EstadoActivo:true", //unidad ejecutora entra por usuario logueado
            limit: -1,
          })).then(function(response) {
          self.gridOptions_cuenta_bancaria.data = response.data;
          //data sucursal, banco
          angular.forEach(self.gridOptions_cuenta_bancaria.data, function(iterador) {
            coreRequest.get('sucursal',
              $.param({
                query: "Id:" + iterador.Sucursal,
                limit: -1,
              })).then(function(response) {
              iterador.SucursalData = response.data;
            })
          })
        });
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        // data
        $scope.$watch('inputopselect', function() {
          if (Object.keys($scope.inputopselect).length > 0) {
            self.gridOptions_op_detail.data = [];
            self.gridOptions_op_detail.data = $scope.inputopselect;
            self.giro.ValorTotal = 0;
            self.giro.FormaPago = self.gridOptions_op_detail.data[0].FormaPago;
            self.giro.Vigencia = self.gridOptions_op_detail.data[0].Vigencia;
            // calculo totales
            angular.forEach(self.gridOptions_op_detail.data, function(iterador) {
              self.giro.ValorTotal = self.giro.ValorTotal + iterador.ValorTotal;
            })
          }
        }, true)
        // Funcion encargada de validar la obligatoriedad de los campos
        self.camposObligatorios = function() {
          var respuesta;
          self.MensajesAlerta = '';
          if (self.giro.CuentaBancaria == undefined) {
            self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_NOMINA') + "</li>";
          }
          // Operar
          if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
            respuesta =  true;
          } else {
            respuesta =  false;
          }

          return respuesta;
        }

        self.confirmar = function() {
          if (self.camposObligatorios()) {
            self.dataGiroSend = {};
            self.dataGiroSend.Giro = self.giro;
            self.dataGiroSend.OrdenPago = $scope.inputopselect;
            console.log("registrar");
            console.log(self.dataGiroSend);
            console.log("registrar");
            financieraRequest.post('giro/RegistrarGiro', self.dataGiroSend)
              .then(function(response) {
                self.resultado = response.data;
                console.log("Resultado");
                console.log(self.resultado);
                console.log("Resultado");
                swal({
                  title: $translate.instant('GIRO'),
                  text: $translate.instant(self.resultado.Code) + self.resultado.Body,
                  type: self.resultado.Type,
                }).then(function() {
                  $window.location.href = '#/orden_pago/giros/ver_todos';
                })
              })
          } else {
            swal({
              title: 'Error!',
              html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
              type: 'error'
            })
          }
        }
        // fin
      },
      controllerAs: 'd_opMultiSelectDetail'
    };
  });
