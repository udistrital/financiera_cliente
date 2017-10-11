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
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
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
              //quitar repetidos
              var hash = {};
              response.data = response.data.filter(function(current) {
                var exists = !hash[current.RegistroPresupuestalDisponibilidadApropiacion.Id] || false;
                hash[current.RegistroPresupuestalDisponibilidadApropiacion.Id] = true;
                return exists;
              });
              //fin quitar repetidos
              self.gridOptions_rubros.data = response.data;
              // recorrer para subgrip
              angular.forEach(self.gridOptions_rubros.data, function(iterador) {
                iterador.subGridOptions = {
                  columnDefs: [{
                      field: 'Concepto.Id',
                      visible: false,
                      enableCellEdit: false
                    },
                    {
                      field: 'Concepto.Codigo',
                      displayName: $translate.instant('CODIGO') + ' ' + $translate.instant('CONCEPTO'),
                      enableCellEdit: false,
                      width: '15%',
                      cellClass: 'input_center'
                    },
                    {
                      field: 'Concepto.Nombre',
                      displayName: $translate.instant('NOMBRE'),
                      enableCellEdit: false
                    },
                    {
                      field: 'Concepto.Descripcion',
                      displayName: $translate.instant('DESCRIPCION'),
                      enableCellEdit: false
                    },
                    {
                      field: 'Concepto.TipoConcepto.Nombre',
                      displayName: $translate.instant('TIPO'),
                      enableCellEdit: false,
                      width: '10%',
                    },
                    {
                      field: 'Valor',
                      displayName: $translate.instant('AFECTACION'),
                      enableCellEdit: false,
                      width: '10%',
                      cellFilter: 'currency',
                      cellClass: 'input_right'
                    },
                  ]
                };
                //
                financieraRequest.get('concepto_orden_pago',
                  $.param({
                    query: "OrdenDePago.Id:" + $scope.inputordenpagoid + ",RegistroPresupuestalDisponibilidadApropiacion.Id:" + iterador.RegistroPresupuestalDisponibilidadApropiacion.Id,
                    limit: 0
                  })
                ).then(function(response) {
                  iterador.subGridOptions.data = response.data;
                });
              }) //recorrer para subgrip
            });
          }
        })
      //fin
      },
      controllerAs: 'd_opProveedorDetalleRubroConcepto'
    };
  });
