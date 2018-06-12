'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesCancelacionCtrl
 * @description
 * # InversionesCancelacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesCancelacionCtrl', function ($scope,$translate,financieraRequest) {
    var ctrl = this;
    ctrl.cargar_listas = function() {

      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        ctrl.vigencia_calendarios = parseInt(response.data);
        var year = parseInt(response.data) + 1;
        ctrl.vigencias = [];
        for (var i = 0; i < 5; i++) {
          ctrl.vigencias.push(year - i);
        }
      });

      financieraRequest.get('unidad_ejecutora', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.unidadesejecutoras = response.data;
      });

    };
    ctrl.cargar_listas();

        $scope.$watch('inversionesCancelacion.concepto[0]', function(newValue,oldValue) {
                    if (!angular.isUndefined(newValue)) {
                        financieraRequest.get('concepto', $.param({
                            query: "Id:" + newValue.Id,
                            fields: "Rubro",
                            limit: -1
                        })).then(function(response) {
                            $scope.actaComprainv.concepto[0].Rubro = response.data[0].Rubro;
                        });
                    }
                }, true);

  });
