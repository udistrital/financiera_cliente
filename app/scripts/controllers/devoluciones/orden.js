'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesOrdenCtrl
 * @description
 * # DevolucionesOrdenCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesOrdenCtrl', function ($scope,agoraRequest,wso2Request) {
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
     var parametros2 = [{
         name: "tipo_recibo",
         value: "ingresos_concepto/CODIGO%20DE%20BARRAS"
     }, {
         name: "facultad",
         value: 33
     }, {
         name: "fecha_inicio",
         value: "24-04-18"
     }, {
         name: "fecha_fin",
         value: "25-04-18"
     }];

     wso2Request.get("academicaProxyService", parametros2).then(function(response) {
        console.log(response);
     });

        wso2Request.get("servicios_academicos", parametros).then(function(response) {
          console.log(response);
        });


     }

   };

  });
