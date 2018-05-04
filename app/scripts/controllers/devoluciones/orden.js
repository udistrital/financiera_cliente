'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesOrdenCtrl
 * @description
 * # DevolucionesOrdenCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesOrdenCtrl', function ($scope,agoraRequest,wso2Request,financieraMidRequest,financieraRequest) {
   var ctrl = this;
   ctrl.selectedcar = {};
   ctrl.concepto = [];

   ctrl.consultarFormaPago = function(){
     financieraRequest.get('forma_pago',
       $.param({
         limit:'-1'
       })
     ).then(function(response){
       ctrl.formasPago = response.data;
     });
     financieraRequest.get('tipo_cuenta_bancaria',
       $.param({
         limit:'-1'
       })
     ).then(function(response){
       ctrl.tiposCuenta = response.data;
     });

     financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
       var year = parseInt(response.data);
       ctrl.anos = [];
       for (var i = 0; i < 5; i++) {
         ctrl.anos.push(year - i);
       }
     });
  }

  ctrl.consultarFormaPago();
   ctrl.cargarTiposDoc = function(){
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


   $scope.$watch('ordendevolucion.concepto[0]', function(oldValue, newValue) {
       if (!angular.isUndefined(newValue)) {
           financieraRequest.get('concepto', $.param({
               query: "Id:" + newValue.Id,
               fields: "Rubro",
               limit: -1
           })).then(function(response) {
               $scope.ordendevolucion.concepto[0].Rubro = response.data[0].Rubro;
           });
       }
   }, true);

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
           value: "1104704188"
       }
     ];
        wso2Request.get("academicaProxy", parametros).then(function(response) {
          financieraMidRequest.post('devoluciones/GetTransformRequest/',response.data.pagosCollection).then(function(response2) {
            console.log(response2.data);
            ctrl.nombreSolicitante = response2.data.InformacionEstudiante.Nombre;
            ctrl.carreras = response2.data.InformacionCarrera;
          });
          //console.log(response.data.pagosCollection);
        });

        ctrl.consultaPag = false;
     }

   };

   ctrl.setSelectedCar = function(carrera){
     ctrl.selectedcar=carrera;
     ctrl.seleccion = true;
   }

   ctrl.changeStatePagos= function(){
     ctrl.pagos=!ctrl.pagos;
     if(ctrl.seleccion==true){
       ctrl.seleccion = !ctrl.seleccion;
     }

   }

  });
