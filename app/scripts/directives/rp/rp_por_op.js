'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rpPorOp
 * @description
 * # rpPorOp
 */
angular.module('financieraClienteApp')
  .directive('rpPorOp', function(financieraRequest, financieraMidRequest) {
    return {
      restrict: 'E',
      scope: {
        op: '=?',
        panel: '=?'
      },
      templateUrl: 'views/directives/rp/rp_por_op.html',

      controller: function($scope) {
        var ctrl = this;


        $scope.$watch('op', function() {

          if($scope.op !== undefined){
              ctrl.op_id = $scope.op;
              ctrl.get_informacion_rp();
          }
        });



        ctrl.get_informacion_rp = function(){

          financieraRequest.get('orden_pago_registro_presupuestal',
            $.param({
              query: "OrdenPago:" + ctrl.op_id,
            })).then(function(response) {
              if(response.data === null){
                ctrl.rps = undefined
              }else{
                ctrl.rps = response.data;
                ctrl.detalle_rp(ctrl.rps[0].RegistroPresupuestal.Id);
              }
          });
        };

        ctrl.detalle_rp = function(rp_id) {

          financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',
            $.param({
              query: "RegistroPresupuestal.Id:" + rp_id,
            })).then(function(response) {
            ctrl.rp_detalle = response.data[0];

            //data necesidad
            financieraMidRequest.get('disponibilidad/SolicitudById/' + ctrl.rp_detalle.DisponibilidadApropiacion.Disponibilidad.Solicitud, '')
              .then(function(response) {
                if(response.data !== null){
                  ctrl.solicitud = response.data[0];
                }

              });
          });
          //Valor total del Rp
          financieraRequest.get('registro_presupuestal/ValorTotalRp/' + rp_id)
            .then(function(response) {
              ctrl.valor_total_rp = response.data;
            });
        }

      },
      controllerAs: 'd_rpPorOp'
    };
  });
