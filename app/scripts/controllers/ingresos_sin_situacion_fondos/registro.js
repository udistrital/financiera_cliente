'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosSinSituacionFondosRegistroCtrl
 * @description
 * # IngresosSinSituacionFondosRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosSinSituacionFondosRegistroCtrl', function ($scope,financieraRequest,$translate) {
    var ctrl  = this;

    ctrl.cargarListas = function(){

      financieraRequest.get('unidad_ejecutora', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.unidadesejecutoras = response.data;
      });

      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        var year = parseInt(response.data);
        ctrl.anos = [];
        for (var i = 0; i < 5; i++) {
          ctrl.anos.push(year - i);
        }
      });
    }

    ctrl.cargarListas();

    ctrl.registrar = function(){
      if(angular.isUndefined(ctrl.rubroSeleccionado)){
        swal("", $translate.instant("E_RB003"),"error");
      }
      if($scope.myForm.$invalid){
        console.log("no enviar");
      }
    }

    $scope.$watch('ingresosSinSitFnReg.rubroSeleccionado',function(oldvalue,newvalue){
      console.log("rubro seleccionado",newvalue)
    },true);
  });
