'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:avances/legalizacionPracticaVe
 * @description
 * # avances/legalizacionPracticaVe
 */
angular.module('financieraClienteApp')
  .directive('legalizacionPracticaVe', function () {
    return {
      restrict: 'E',
      scope:{
          legalizacion :'=?'
        },

      templateUrl: 'views/directives/avance/legalizacion_practica_ve.html',
      controller:function($scope,financieraRequest){
        var ctrl = this;
        $scope.encontrado = true;
        ctrl.concepto = [];
        ctrl.LegalizacionPracticaAcademica = $scope.legalizacion;

        ctrl.getConcepto=function(){
          financieraRequest.get('concepto_avance_legalizacion_tipo',$.param({
            query:"AvanceLegalizacion.Id:"+ctrl.LegalizacionPracticaAcademica.Id,
            limit:1
          })).then(function(response){
              ctrl.concepto[0]=response.data[0].Concepto;
              $scope.nodo = response.data[0].Concepto;
              ctrl.cargarMovimientos();
          });
        }
        ctrl.getConcepto();
        ctrl.cargarMovimientos=function(){
            financieraRequest.get('avance_legalizacion_tipo/GetTaxesMovsLegalization',$.param({
              noTipoDoc:9,
              idLegTipo:ctrl.LegalizacionPracticaAcademica.Id
            })).then(function(response){
              console.log("respuesta",response);
              ctrl.concepto[0].movimientos = response.data.movimientos;
            });
        }

      },
      controllerAs:'d_avancesLegaPracticaVe'
    };
  });
