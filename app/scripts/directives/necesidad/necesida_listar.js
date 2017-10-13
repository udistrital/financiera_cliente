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
        outputregistropresupuestal: '=?'
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
              field: 'Necesidad.Estado.Nombre',
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
              } else {
                $scope.outputnecesidad = row.entity.Necesidad;
                $scope.outputvalortotalrp = row.entity.subGridOptions.data[0].ValorTotal;
                $scope.outputregistropresupuestal = row.entity.subGridOptions.data[0].Id;
              };
            });
          }
        };
        //
        administrativaRequest.get('solicitud_disponibilidad',
          $.param({
            query: "Expedida:true,Necesidad.TipoNecesidad.CodigoAbreviacion:N", //necesidades de Nomina (N) -se require un in
            limit: -1
          })).then(function(response) {
          self.gridOptions_necesidad.data = response.data;
          //subGrid
          angular.forEach(self.gridOptions_necesidad.data, function(iterador) {
            iterador.subGridOptions = {
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
            financieraMidRequest.get("disponibilidad/DisponibilidadByNecesidad/" + iterador.Necesidad.Id)
              .then(function(data) {
                iterador.subGridOptions.data = [];
                iterador.subGridOptions.data.push(data.data[0].registro_presupuestal[0]); //primer rp cuando se va por muchos rubros
                // get valor rp
                financieraRequest.get('registro_presupuestal/ValorTotalRp/' + iterador.subGridOptions.data[0].Id)
                  .then(function(response) {
                    iterador.subGridOptions.data[0].ValorTotal = response.data;
                  });
                // fin get valor rp
              });
          });
          //subGrid
        });

        $scope.$watch('outputnecesidad', function() {
          if ($scope.outputnecesidad != undefined && Object.keys($scope.outputnecesidad).length > 0 ) {
            console.log("cambia necesidad");
            //consultamos el tipo de nomina y definimos el sutipo en la op
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
