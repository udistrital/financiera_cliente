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
   $scope.load = false;
   ctrl.encontrado = false;
   ctrl.carreras=[];

   ctrl.consultarListas= function(){
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

     financieraRequest.get('unidad_ejecutora', $.param({
         limit: -1
     })).then(function(response) {
         ctrl.unidadesejecutoras = response.data;
     });
  }

  ctrl.consultarListas();

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
         value: ctrl.tipoDocSoli.Abreviatura
       },
       {
           name: "numeroIdentificacion",
           value: ctrl.numdocSoli
       }
     ];
        wso2Request.get("academicaProxy", parametros).then(function(response) {
          financieraMidRequest.post('devoluciones/GetTransformRequest/',response.data.pagosCollection).then(function(dataAcademica) {
            if(!angular.isUndefined(dataAcademica.data) && dataAcademica.data!=null){
              ctrl.nombreSolicitante = dataAcademica.data.InformacionEstudiante.Nombre;
              ctrl.carreras = dataAcademica.data.InformacionCarrera;
              ctrl.encontrado = true;
            }else{
              agoraRequest.get('informacion_persona_natural',$.param({
                query:"Id:" + ctrl.numdocSoli +",TipoDocumento.Id: " + ctrl.tipoDocSoli.Id,
                limit:-1
              })).then(function(response){
                if(!angular.isUndefined(response.data) && response.data!=null){
                    ctrl.nombreSolicitante = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                    ctrl.encontrado = true;
                  }else{
                    agoraRequest.get('informacion_persona_juridica',$.param({
                      query:"Id:" + ctrl.numdocSoli,
                      limit:-1
                    })).then(function(response){
                        if(!angular.isUndefined(response.data) && response.data!=null){
                            ctrl.nombreSolicitante = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                            ctrl.encontrado = true;
                        }else{
                          agoraRequest.get('supervisor_contrato',$.param({
                            query:"Documento:" + ctrl.numdocSoli,
                            limit:-1
                          })).then(function(response){
                              if(!angular.isUndefined(response.data) && response.data!=null){
                                  ctrl.nombreSolicitante = response.data[0].Nombre;
                                  ctrl.encontrado = true;
                              }else{
                                ctrl.encontrado = false;
                              }
                            });
                        }
                    });
                  }
              });
            }

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
