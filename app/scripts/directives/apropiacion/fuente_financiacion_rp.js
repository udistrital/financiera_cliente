'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/fuenteFinanciacionRp
 * @description
 * # apropiacion/fuenteFinanciacionRp
 */
angular.module('financieraClienteApp')
  .directive('fuenteFinanciacionRp', function (presupuestoRequest,presupuestoMidRequest) {
    return {
      restrict: 'E',
      scope:{
          apropiacion:'=',
          rp: '=',
          resumen: '=?'
        },
      templateUrl: 'views/directives/apropiacion/fuente_financiacion_rp.html',
      controller:function($scope){
        var self = this;
        self.resumen_afectacion_presupuestal = [];
        $scope.resumen = [];
        $scope.$watch('apropiacion', function(){
          self.resumen_afectacion_presupuestal = [];
          console.log($scope.rp);
          if ($scope.rp != undefined && $scope.apropiacion != undefined){
            console.log($scope.rp);
            angular.forEach($scope.apropiacion, function(apropiacion_data) {
              presupuestoRequest.get('registro_presupuestal_disponibilidad_apropiacion',$.param({
                query: "RegistroPresupuestal.Id:"+$scope.rp+",DisponibilidadApropiacion.Apropiacion.Id:"+apropiacion_data,
                limit: -1
              })).then(function(response) {
                self.rubros_afectados = response.data;
                console.log(self.rubros_afectados);
                angular.forEach(self.rubros_afectados, function(rubros_data) {
                  $scope.resumen.push(rubros_data);
                  presupuestoRequest.get('apropiacion',$.param({
                    query: "Id:"+rubros_data.DisponibilidadApropiacion.Apropiacion.Id,
                    limit: 1
                  })).then(function(response) {
                    rubros_data.Apropiacion = response.data[0];
                  });

                  rubros_data.FuenteFinanciamiento = rubros_data.DisponibilidadApropiacion.FuenteFinanciamiento;
                  var rp = {
                    Rp : rubros_data.RegistroPresupuestal,
                    Apropiacion : rubros_data.DisponibilidadApropiacion.Apropiacion,
                    FuenteFinanciacion : rubros_data.DisponibilidadApropiacion.FuenteFinanciamiento
                  };
                  presupuestoMidRequest.get('registro_presupuestal/SaldoRp/'+ rp.Rp.Id+'/'+ rp.Apropiacion.Rubro.Codigo,$.param({
                    fuente: rp.FuenteFinanciacion.Codigo
                  })).then(function(response){
                    rubros_data.Saldo  = response.data.saldo;
                    rubros_data.Comprometido = response.data.comprometido;
                    rubros_data.Anulado = response.data.TotalAnuladoRp;
                    rubros_data.AnuladoOp = response.data.TotalAnuladoOp;
                    rubros_data.Valor = response.data.Valor
                  });
                });

                self.resumen_afectacion_presupuestal.push(self.rubros_afectados);
              });

            });
          }
        },true);
      },
      controllerAs:'fuenteFinanciacionRp'
    };
  });
