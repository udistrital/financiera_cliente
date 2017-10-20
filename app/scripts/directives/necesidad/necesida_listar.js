'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:necesidad/necesidaListar
 * @description
 * # necesidad/necesidaListar
 */
angular.module('financieraClienteApp')
  .directive('necesidaListar', function($translate, administrativaRequest, agoraRequest, financieraMidRequest, financieraRequest) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        outputnecesidad: '=?',
        outputvalortotalrp: '=?',
        outputregistropresupuestal: '=?',
        outputsubtipoordenpago: '=?',
        outputnecesidadprocesoexterno: '=?'
      },

      templateUrl: 'views/directives/necesidad/necesida_listar.html',
      controller: function($scope) {
        var self = this;
        self.gridOptions_necesidad = {
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
          enableRowHeaderSelection: false,
          multiSelect: false,
          columnDefs: [{
              field: 'Necesidad.Id',
              visible: true
            },
            {
              field: 'Necesidad.TipoNecesidad.Nombre',
              displayName: $translate.instant('TIPO'),
              cellClass: 'input_center',
              width: '11%',
            },
            {
              field: 'Necesidad.Numero',
              displayName: $translate.instant('DOCUMENTO'),
              cellClass: 'input_center',
              width: '11%',
            },
            {
              field: 'Necesidad.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass: 'input_center',
              width: '9%',
            },
            {
              field: 'Necesidad.Valor',
              displayName: $translate.instant('VALOR'),
              cellFilter: 'currency',
              width: '11%',
              cellClass: 'input_right',
            },
            {
              field: 'Necesidad.DiasDuracion',
              displayName: $translate.instant('DURACION'),
              width: '9%',
              cellClass: 'input_center',
            },
            {
              field: 'Necesidad.EstadoNecesidad.Nombre',
              displayName: $translate.instant('ESTADO'),
              width: '10%',
            },
            {
              field: 'Necesidad.Objeto',
              displayName: $translate.instant('OBJETO'),
            },
            {
              field: 'Necesidad.Justificacion',
              displayName: $translate.instant('JUSTIFICACION'),
            },
          ],
          onRegisterApi: function(gridApi) {
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
              if (row.isSelected == false) {
                $scope.outputnecesidad = {};
                $scope.outputvalortotalrp = 0;
                $scope.outputregistropresupuestal = {};
                $scope.outputnecesidadprocesoexterno = {};
              } else {
                $scope.outputnecesidad = row.entity.Necesidad;
                $scope.outputvalortotalrp = row.entity.subGridOptions.data[0].ValorTotal;
                $scope.outputregistropresupuestal = row.entity.subGridOptions.data[0];
                administrativaRequest.get('necesidad_proceso_externo',
                  $.param({
                    query: 'Necesidad.Id:' + $scope.outputnecesidad.Id,
                  })).then(function(response) {
                  $scope.outputnecesidadprocesoexterno = response.data[0];
                });
              };
            });
          }
        };
        //
        financieraMidRequest.get('registro_presupuestal/ListaNecesidadesByRp/2017',
          $.param({
            tipoNecesidad:"N", //necesidades de Nomina (N) -se require un in
            limit: -1
          })).then(function(response) {
            self.gridOptions_necesidad.data = response.data;
          //subGrid
          angular.forEach(self.gridOptions_necesidad.data, function(iterador) {
            iterador.subGridOptions = {
              enableRowHeaderSelection: false,
              multiSelect: false,
              columnDefs: [{
                  field: 'registro_presupuestal.Id',
                  visible: false
                },
                {
                  field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',
                  displayName: $translate.instant('NO_CDP'),
                  width: '10%',
                  cellClass: 'input_center'
                },
                {
                  field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.Estado.Nombre',
                  displayName: $translate.instant('CDP') + " " + $translate.instant('ESTADO'),
                  width: '10%',
                  cellClass: 'input_center'
                },
                {
                  field: 'NumeroRegistroPresupuestal',
                  displayName: $translate.instant('NO_CRP'),
                  width: '11%',
                  cellClass: 'input_center'
                },
                {
                  field: 'Vigencia',
                  displayName: $translate.instant('CRP') + " " + $translate.instant('VIGENCIA'),
                  width: '11%',
                  cellClass: 'input_center'
                },
                {
                  field: 'Estado.Nombre',
                  displayName: $translate.instant('CRP') + " " + $translate.instant('ESTADO'),
                  width: '11%',
                  cellClass: 'input_center'
                },
                {
                  field: 'Responsable',
                  displayName: $translate.instant('CRP') + " " + $translate.instant('RESPONSABLE'),
                  cellClass: 'input_center'
                },
                {
                  field: 'ValorTotal',
                  displayName: $translate.instant('CRP') + " " + $translate.instant('VALOR'),
                  cellFilter: 'currency',
                  cellClass: 'input_right'
                },
              ]
            };
            //
            iterador.subGridOptions.data = [];
            iterador.subGridOptions.data.push(iterador.InfoRp); //llega un solo objeto (InfoRp)
            // get valor rp
            financieraRequest.get('registro_presupuestal/ValorTotalRp/' + iterador.subGridOptions.data[0].Id)
              .then(function(response) {
                iterador.subGridOptions.data[0].ValorTotal = response.data;
              });
            // fin get valor rp
          }); //forEach
          //subGrid
        });

        $scope.$watch('outputnecesidad', function() {
          if ($scope.outputnecesidad != undefined && Object.keys($scope.outputnecesidad).length > 0) {
            self.subTipoOrdenPago = "";
            if ($scope.outputnecesidad.TipoNecesidad.CodigoAbreviacion == 'N') { //Nomina planta Administrativa
              self.subTipoOrdenPago = "OP-PLAN-ADMI";
            } else if ($scope.outputnecesidad.TipoNecesidad.CodigoAbreviacion == 'NPD') {
              self.subTipoOrdenPago = "OP-PLAN-DOCE";
            }
            financieraRequest.get('sub_tipo_orden_pago',
              $.param({
                query: "CodigoAbreviacion:" + self.subTipoOrdenPago,
                limit: -1
              })).then(function(response) {
              $scope.outputsubtipoordenpago = response.data[0];
            })
          }else{
            $scope.outputsubtipoordenpago = {};
          }
        })

        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
        // fin
      },
      controllerAs: 'd_necesidaListar'
    };
  });
