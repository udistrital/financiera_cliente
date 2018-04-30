'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesOrdenCtrl
 * @description
 * # DevolucionesOrdenCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesOrdenCtrl', function ($scope,agoraRequest,wso2Request,financieraMidRequest) {
   var ctrl = this;

   ctrl.cargarTiposDoc = function(){
     console.log("consulta tipo doc");
        agoraRequest.get('parametro_estandar',$.param({
          query:"ClaseParametro:Tipo Documento",
          limit:-1
        })).then(function(response){
          ctrl.tiposdoc = response.data;
        });
   };
   ctrl.cargarTiposDoc();

   $scope.$watch('ordendevolucion.numdocSoli', function(newValue){
     if (!angular.isUndefined(newValue)) {
        ctrl.consultaPag = true;
     }else{
       ctrl.consultaPag = false;
     }
   },true);

   ctrl.consultaPagos = function(){
     if (ctrl.consultaPag === true){
       var parametros = [
      {
           name: "tipo_consulta",
           value: "consulta_pagos"
      },
      {
         name: "tipo_identificacion",
         value: "CC"
       },
       {
           name: "numeroIdentificacion",
           value: "1018453423"
       }
     ];
        wso2Request.get("academicaProxy", parametros).then(function(response) {
          financieraMidRequest.post('devoluciones/GetTransformRequest/',response.data.pagosCollection).then(function(response) {
            console.log(response);
          });
          console.log(response.data.pagosCollection);
        });

        ctrl.consultaPag = false;
     }

   };

  });
