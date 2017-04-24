'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubros/rubrosPorRpSeleccionMultiple
 * @description
 * # rubros/rubrosPorRpSeleccionMultiple
 */
angular.module('financieraClienteApp')
  .directive('rubrosPorRpSeleccionMultiple', function (financieraRequest, $timeout, $translate) {
    return {
      restrict: 'E',
      scope:{
        rpid:'=?',
        rubros:'=?',
        rubrosobj:'=?'
        },

      templateUrl: 'views/directives/rubros/rubros_por_rp_seleccion_multiple.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_rubros = {
          enableRowSelection: true,
          enableRowHeaderSelection: true,
          enableSelectAll: true,
          columnDefs : [
            {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Id',           visible : false},
            {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',       displayName: $translate.instant('CODIGO')},
            {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Vigencia',     displayName: $translate.instant('VIGENCIA'), width:'8%'},
            {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',  displayName: $translate.instant('DESCRIPCION')},
            {field: 'Valor',                                                    displayName: $translate.instant('VALOR'), cellFilter: 'currency'},
            {field: 'Saldo',                                                    displayName: $translate.instant('SALDO'), cellFilter: 'currency'} //obtenido por servicio financieraRequest.post('registro_presupuestal/SaldoRp',rpData)
          ]
        };
        self.gridOptions_rubros.multiSelect = true;
        //
        self.gridOptions_rubros.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.rubros = [];
              $scope.apropiacion_ids = [];
              $scope.rubros_seleccion = self.gridApi.selection.getSelectedRows();
              $scope.rubrosobj = self.gridApi.selection.getSelectedRows();
              angular.forEach($scope.rubros_seleccion, function(rr){
                $scope.rubros.push(rr.DisponibilidadApropiacion.Apropiacion.Rubro.Id)
                $scope.apropiacion_ids.push(rr.DisponibilidadApropiacion.Apropiacion.Id)
              })
            });
          };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        //
        $scope.$watch('rpid', function(){
          //self.refresh();
          if ($scope.rpid != undefined){
            financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',
            $.param({
              query: "RegistroPresupuestal.Id:" + $scope.rpid,
              limit:0
            })
            ).then(function(response) {
              self.gridOptions_rubros.data = response.data;
              $scope.gridHeight = self.gridOptions_rubros.rowHeight * 2 + (self.gridOptions_rubros.data.length * self.gridOptions_rubros.rowHeight);
              // get saldos de lor rp
              angular.forEach(self.gridOptions_rubros.data, function(data){
                var rpData = {
                  Rp : data.RegistroPresupuestal,
                  Apropiacion : data.DisponibilidadApropiacion.Apropiacion
                };
                financieraRequest.post('registro_presupuestal/SaldoRp',rpData).then(function(response){
                  data.Saldo  = response.data;
                });
              });
              //fin get saldos de lor rp
            });
          }
        })
        // fin
      },
      controllerAs:'d_rubrosPorRpSeleccionMultiple'
    };
  });
