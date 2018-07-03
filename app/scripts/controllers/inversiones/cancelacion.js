'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesCancelacionCtrl
 * @description
 * # InversionesCancelacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesCancelacionCtrl', function ($scope,$translate,financieraRequest,$routeParams) {
    var ctrl = this;
    ctrl.fechaInicio = new Date();
    ctrl.cargar_listas = function() {
      console.log("id inversion",$routeParams.idInversion);
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
    }

    ctrl.registrar = function(){
        var request = {};

        var validar_campos = ctrl.validateFields();

        if(validar_campos != false){
          request = {
            cancelacionInversion:{
              FechaCancelacion:'',
              Vigencia:ctrl.vigencia,
              UsuarioEjecucion:1111,
              UnidadEjecutora:ctrl.unidadejecutora.Id,
              Observaciones:ctrl.valor
            }
          }


          request.IngresoSinSituacionFondos.Rubro.Id = parseInt(ctrl.rubroSeleccionado.Id);
          //financieraMidRequest.post('',request).then(function(response){

          //  if(response.data===null){
          //    swal("",$translate.instant("E_ISF002"),"error");
          //  }else{
          //    var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th>";
          //    templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Id + "</td>" ;
          //    swal('',templateAlert,response.data.Type);
          //  }
          //});

        }
    }

  });
