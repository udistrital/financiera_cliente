'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesSolicitudLegalizacionPracticaAcademicaCtrl
 * @description
 * # TesoreriaAvancesSolicitudLegalizacionPracticaAcademicaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('legalizacionPracAcademicaCtrl', function ($scope,wso2Request,financieraRequest,$localStorage,$translate,$location) {
    var ctrl = this;
    $scope.encontrado = true;
    $scope.solicitud = $localStorage.avance;
    ctrl.concepto = [];

    ctrl.limpiar_practica = function() {
        $scope.encontrado = undefined;
        $scope.estudiante_cargado = undefined;
        ctrl.LegalizacionPracticaAcademica = null;
    };

    $scope.$watch('legalizacionPracAcademica.concepto[0].Id', function(newValue,oldValue) {
                if (!angular.isUndefined(newValue)) {
                    financieraRequest.get('concepto', $.param({
                        query: "Id:" + newValue,
                        fields: "Rubro",
                        limit: -1
                    })).then(function(response) {
                        ctrl.concepto[0].Rubro = response.data[0].Rubro;
                    });
                }
            }, true);


    ctrl.cargar_estudiante = function() {
        $scope.encontrado = false;
        $scope.estudiante_cargado = false;
        ctrl.LegalizacionPracticaAcademica.Estudiante = null;
        if (ctrl.LegalizacionPracticaAcademica.Tercero.length === 11) {
            $scope.estudiante_cargado = true;
            var parametros = [{
                name: "Información básica",
                value: "info_basica"
            }, {
                name: "codigo estudiante",
                value: ctrl.LegalizacionPracticaAcademica.Tercero
            }];
            wso2Request.get("bienestarProxy", parametros).then(function(response) {

                if (!angular.isUndefined(response.data.datosCollection.datos)) {
                    ctrl.LegalizacionPracticaAcademica.Estudiante = response.data.datosCollection.datos[0];
                    $scope.encontrado = true;
                } else {
                    $scope.encontrado = false;
                }
            });
        }
    };

    ctrl.camposObligatorios = function() {
      var respuesta;
      ctrl.MensajesAlerta = '';
      if($scope.practicas.$invalid){
        angular.forEach($scope.practicas.$error,function(controles,error){
          angular.forEach(controles,function(control){
            control.$setDirty();
          });
        });
        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS") + "</li>";
      }else{
        if(ctrl.LegalizacionPracticaAcademica.Estudiante === null || angular.isUndefined(ctrl.LegalizacionPracticaAcademica.Estudiante)){
            ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("ESTUDIANTE_NO_ENCONTRADO") + "</li>";
        }
      }


      if(angular.isUndefined(ctrl.concepto[0])){
        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("MSN_DEBE_CONCEPTO") + "</li>";
      }else{
        if (ctrl.concepto[0].validado === false) {
          ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("PRINCIPIO_PARTIDA_DOBLE_ADVERTENCIA") + "</li>";
        }
      }
      if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
        respuesta = true;
      } else {
        respuesta =  false;
      }

      return respuesta;
     }


    ctrl.guardar = function(){
      var request ={};
      var templateAlert;
      if(!ctrl.camposObligatorios()){
        swal({
          title:'¡Error!',
          html:'<ol align="left">'+ctrl.MensajesAlerta+"</ol>",
          type:'error'
        });
        return;
      }
      ctrl.LegalizacionPracticaAcademica.TipoAvanceLegalizacion = { Id: 1 };
      request.Avance = { Id: $scope.solicitud.Id };
      request.Valor = parseFloat(ctrl.LegalizacionPracticaAcademica.Valor);
      request.ValorLegalizadoAvance = $scope.solicitud.valorLegalizado;
      request.ValorTotalAvance = $scope.solicitud.Total;
      request.Movimientos = []
      angular.forEach(ctrl.concepto[0].movimientos, function(data) {
        delete data.Id;
        request.Movimientos.push(data);
      });
      request.AvanceLegalizacionTipo = ctrl.LegalizacionPracticaAcademica;
      request.Concepto=ctrl.concepto[0];
      request.TipoDocAfectanteNO = 9;
      request.Usuario = 111111;
      console.log(request);
     financieraRequest.post("avance_legalizacion_tipo/AddEntireAvanceLegalizacionTipo", request)
         .then(function(info) {
             if(angular.equals(info.data.Type,"success")){
               templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('LEGALIZACION') + "</th><th>" + $translate.instant('LEGALIZACION_PRACTICA_ACADEMICA') + "</th>"+ "</th><th>" + $translate.instant('DETALLE');
               templateAlert = templateAlert + "<tr class='success'><td>" + info.data.Body.AvanceLegalizacion.Legalizacion + "</td>" + "<td>" + info.data.Body.Id+ "</td>" + "<td>" + $translate.instant(info.data.Code) + "</td></tr>" ;
               templateAlert = templateAlert + "</table>";
               swal('',templateAlert,info.data.Type).then(function() {
                 $scope.$apply(function(){
                     $location.path('/tesoreria/avances/legalizacion');
                 });
               })
             }else{
               swal('',info.data.Code,info.data.Type);
             }

         });
    }

  });
