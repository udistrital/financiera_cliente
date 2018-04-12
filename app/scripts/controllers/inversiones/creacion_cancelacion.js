'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesCreacionCancelacionCtrl
 * @description
 * # InversionesCreacionCancelacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesCreacionCancelacionCtrl', function ($scope,$translate,administrativaRequest,financieraRequest,$location, $window,ingresoDoc) {
    var ctrl = this;

    ctrl.infoPadre = ingresoDoc.get();
    ctrl.filtro_ingresos = "Ingreso";
    ctrl.concepto = [];
    $scope.$watch('creacionCancelacion.concepto[0]', function(oldValue, newValue) {
                if (!angular.isUndefined(newValue)) {
                    financieraRequest.get('concepto', $.param({
                        query: "Id:" + newValue.Id,
                        fields: "Rubro",
                        limit: -1
                    })).then(function(response) {
                        $scope.creacionCancelacion.concepto[0].Rubro = response.data[0].Rubro;
                    });
                }
            }, true);

            ctrl.cargarUnidadesEjecutoras = function() {
                      financieraRequest.get('unidad_ejecutora', $.param({
                          limit: -1
                      })).then(function(response) {
                          ctrl.unidadesejecutoras = response.data;
                      });
                  };

            ctrl.cargarTerceros = function(){

                  administrativaRequest.get("informacion_persona_juridica", $.param({
                      fields: "Id,DigitoVerificacion,NomProveedor",
                      limit: -1
                    })).then(function(response) {
                      ctrl.terceros = response.data;
                    });
                }
            ctrl.cargarUnidadesEjecutoras();
            ctrl.cargarTerceros();

    ctrl.registrarInversion = function() {

      if (ctrl.concepto == null) {
          swal("", $translate.instant('SELECCIONAR_CONCEPTO_INGRESO'), "error");
          return;
      }

        ctrl.inversion = {
          Inversion:{
            Vendedor:ctrl.vendedor.Id,
            Emisor:ctrl.emisor.Id,
            NumOperacion:ctrl.NumOperacion,
            ValorNomSaldo:ctrl.ValorReinversion,
            Observaciones:ctrl.observaciones
          },
          EstadoInversion:{
            Estado:{id:1},
            Activo:true
          },
          TotalInversion: ctrl.total,
          Concepto: ctrl.concepto[0],
          tipoInversion:3,
          actapadre:{Id:ctrl.infoPadre.Inversion.Id,
                      valorInversion:ctrl.infoPadre.Inversion.ValorTotal
          },
          usuario:"admin"
        };


        angular.forEach(ctrl.movs, function(data) {
            delete data.Id;
        });

        ctrl.inversion.Movimientos = ctrl.movs;

        financieraRequest.post('inversiones_acta_inversion/CreateInversion', ctrl.inversion).then(function(response) {
          if(response.data.Type != undefined){
            if(response.data.Type === "error"){
                swal('',$translate.instant(response.data.Code),response.data.Type);
            }else{
              var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th>";
              templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Id + "</td>" ;
              swal('',templateAlert,response.data.Type).then(function(){

                financieraRequest.post('inversion_estado_inversion/AddEstadoInv', ctrl.infoPadre).then(function(response) {
                  if(response.data.Type != undefined){
                    if(response.data.Type === "error"){
                        swal('',$translate.instant(response.data.Code),response.data.Type);
                      }else{
                        swal('',$translate.instant(response.data.Code),response.data.Type);
                      }
                    }
                  });
                $scope.$apply(function(){
                  $location.path('/inversiones/consulta');
                })
              })
            }
          }
        })
    };
});
