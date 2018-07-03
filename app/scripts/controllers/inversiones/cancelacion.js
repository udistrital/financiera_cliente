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
    ctrl.fechaInicio= new Date();
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

    ctrl.validateFields = function(){

        if($scope.datosOblig.$invalid){
          angular.forEach($scope.datosOblig.$error,function(controles,error){
            angular.forEach(controles,function(control){
              control.$setDirty();
            });
          });
          swal("", $translate.instant("CAMPOS_OBLIGATORIOS"),"error");
          return false;
        }
        if (angular.isUndefined(ctrl.concepto) || ctrl.concepto[0] == null) {
            swal("", $translate.instant('SELECCIONAR_CONCEPTO_INGRESO'), "error");
            return false;
        }

        if (ctrl.concepto[0].validado===false){
          swal("",$translate.instant('PRINCIPIO_PARTIDA_DOBLE_ADVERTENCIA'),"warning");
          return false;
        }
    }

    ctrl.registrar = function(){
     var request = {};

     var validar_campos = ctrl.validateFields();

     if(validar_campos != false){
       request = {
         cancelacionInversion:{
           FechaCancelacion:ctrl.fechaInicio,
           Observaciones:ctrl.observaciones,
           Vigencia:ctrl.vigencia,
           UnidadEjecutora:ctrl.unidadejecutora.Id,
           UsuarioEjecucion:111,
         },
         Concepto: ctrl.concepto[0]
       }

       angular.forEach(ctrl.movs, function(data) {
           delete data.Id;
       });

       ctrl.request.Movimientos = ctrl.movs;

     }
    }

  });
