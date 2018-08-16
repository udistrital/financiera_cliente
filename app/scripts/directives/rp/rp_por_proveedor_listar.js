'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rp/rpPorProveedorListar
 * @description
 * # rp/rpPorProveedorListar
 */
angular.module('financieraClienteApp')
  .directive('rpPorProveedorListar', function(financieraRequest, financieraMidRequest, $timeout, $translate, $interval) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputbeneficiaroid: '=?',
        outputrpselect: '=?',
      },

      templateUrl: 'views/directives/rp/rp_por_proveedor_listar.html',
      controller: function($scope) {
        var self = this;
        $scope.outputrpselect = [];
        self.posicion_actual = 0;
        self.rp_seleccionado = [];
        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
        ];

        self.gridOptions_rp = {
          enableRowSelection: true,
          enableRowHeaderSelection: true,
          enableSelectAll: true,
          enableFiltering : true,
          paginationPageSizes: [5, 10, 20],
          paginationPageSize: 10,
          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'NumeroRegistroPresupuestal',
              displayName: $translate.instant('NO_CRP'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Estado.Nombre',
              displayName: $translate.instant('ESTADO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
                field: 'Opciones',
                displayName: $translate.instant('OPCIONES'),
                cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro><center>',
                headerCellClass: 'text-info'
            }
          ]
        };

        self.gridOptions_rp.multiSelect = true;
        self.gridOptions_rp.onRegisterApi = function(gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {

              $scope.outputrpselect = self.gridApi.selection.getSelectedRows();
          });
        };

        $scope.loadrow = function(row, operacion) {
            self.operacion = operacion;
            switch (operacion) {
                case "ver":
                    self.rp_seleccionado = row.entity;
                    self.get_detalle_rp();
                    $("#modal_ver").modal("show");
                    break;
                case "otro":

                    break;
              default:
            }
        };

        self.get_detalle_rp = function(){
          financieraRequest.get('registro_presupuestal/ValorTotalRp/' + self.rp_seleccionado .Id)
          .then(function(response) {
            self.rp_seleccionado.valor_total_rp = response.data;
          });
          financieraMidRequest.get('disponibilidad/SolicitudById/' + self.rp_seleccionado.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.DisponibilidadProcesoExterno[0].ProcesoExterno, '')
          .then(function(response) {
            self.rp_seleccionado.necesidadInfo = response.data;
          });

        };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        // refrescar

        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
              $scope.a = $scope.inputpestanaabierta;
          }
        })

        $scope.$watch('a', function() {
          $interval( function() {
                self.gridApi.core.handleWindowResize();
              }, 500, 2);

        })


        //
        $scope.$watch('inputbeneficiaroid', function() {
          self.refresh();
          if ($scope.inputbeneficiaroid != undefined) {
            financieraRequest.get('registro_presupuestal',
              $.param({
                query: "Estado.Nombre__not_in:Agotado,Beneficiario:" + $scope.inputbeneficiaroid,
                sortby: "Vigencia",
                order: "desc",
              })).then(function(response) {
                if (response.data === null) {
                    self.hayData = false;
                    self.cargando = false;
                    self.gridOptions_rp.data  = [];
                } else {
                    self.hayData = true;
                    self.cargando = false;
                    self.gridOptions_rp.data = response.data;
                }

            });
          } else {
            self.hayData = false;
            self.cargando = false;
            self.gridOptions_rp.data  = [];
          }
        })


        //
      },
      controllerAs: 'd_rpPorProveedorListar'
    };
  });
