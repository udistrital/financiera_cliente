'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesOrdenCtrl
 * @description
 * # DevolucionesOrdenCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesOrdenCtrl', function ($scope,agoraRequest,wso2Request,financieraMidRequest,financieraRequest,$translate,administrativaRequest,coreRequest) {
   var ctrl = this;
   ctrl.selectedcar = {};
   ctrl.concepto = [];
   $scope.load = false;
   ctrl.encontrado = false;
   ctrl.loadCircle = true;
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

     coreRequest.get('documento', $.param({
       query:"TipoDocumento.CodigoAbreviacion:TD-DEV",
         limit: -1
     })).then(function(response) {
         ctrl.actas = response.data;
     });

     financieraRequest.get('razon_devolucion', $.param({
         limit: -1
     })).then(function(response) {
         ctrl.razonesDevolucion = response.data;
     });

     agoraRequest.get("informacion_persona_juridica_tipo_entidad", $.param({
          query:"TipoEntidadId:1",
         limit: -1
       })).then(function(response) {
         ctrl.bancos = response.data;
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

   $scope.$watch('ordendevolucion.tipoDocSoli', function(newValue){
     if (!angular.isUndefined(newValue) && ctrl.numdocSoli!= undefined) {
        ctrl.consultaPag = true;
     }else{
       ctrl.consultaPag = false;
     }
   },true);

   $scope.$watch('ordendevolucion.numdocBeneficiario', function(newValue){
     if (!angular.isUndefined(newValue)) {
        ctrl.consultaBeneficiario = true;
     }else{
       ctrl.consultaBeneficiario = false;
     }
   },true);

   $scope.$watch('ordendevolucion.tipoDocBen', function(newValue){
     if (!angular.isUndefined(newValue) && ctrl.numdocBeneficiario!= undefined) {
        ctrl.consultaBeneficiario = true;
     }else{
       ctrl.consultaBeneficiario = false;
     }
   },true);


   $scope.$watch('ordendevolucion.concepto[0]', function(newValue,oldValue) {
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
       ctrl.loadCircle = false;
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
                query:"Id:" + ctrl.numdocSoli +",TipoDocumento.Abreviatura: " + ctrl.tipoDocSoli.Abreviatura,
                limit:-1
              })).then(function(response){
                if(!angular.isUndefined(response.data) && response.data!=null){
                    ctrl.nombreSolicitante = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                    ctrl.IdSolicitante = response.data[0].Id;
                    ctrl.encontrado = true;
                    ctrl.loadCircle = true;
                  }else{
                    agoraRequest.get('informacion_persona_juridica',$.param({
                      query:"Id:" + ctrl.numdocSoli,
                      limit:-1
                    })).then(function(response){
                        if(!angular.isUndefined(response.data) && response.data!=null){
                            ctrl.nombreSolicitante = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                            ctrl.IdSolicitante = response.data[0].Id;
                            ctrl.encontrado = true;
                        }else{
                          agoraRequest.get('supervisor_contrato',$.param({
                            query:"Documento:" + ctrl.numdocSoli,
                            limit:-1
                          })).then(function(response){
                              if(!angular.isUndefined(response.data) && response.data!=null){
                                  ctrl.IdSolicitante = response.data[0].Id;
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
          ctrl.loadCircle = true;
        });

        ctrl.consultaPag = false;
     }

   };


   ctrl.consultaBen = function(){
     if (ctrl.consultaBeneficiario === true){
       ctrl.loadCircle = false;
       var parametros = [
      {
           name: "tipo_consulta",
           value: "consulta_pagos"
      },
      {
         name: "tipo_identificacion",
         value: ctrl.tipoDocBen.Abreviatura
       },
       {
           name: "numeroIdentificacion",
           value: ctrl.numdocBeneficiario
       }
     ];
        wso2Request.get("academicaProxy", parametros).then(function(response) {
          financieraMidRequest.post('devoluciones/GetTransformRequest/',response.data.pagosCollection).then(function(dataAcademica) {
            if(!angular.isUndefined(dataAcademica.data) && dataAcademica.data!=null){
              ctrl.nombreBeneficiario = dataAcademica.data.InformacionEstudiante.Nombre;
            }else{
              agoraRequest.get('informacion_persona_natural',$.param({
                query:"Id:" + ctrl.numdocBeneficiario +",TipoDocumento.Id: " + ctrl.tipoDocBen.Id,
                limit:-1
              })).then(function(response){
                if(!angular.isUndefined(response.data) && response.data!=null){
                    ctrl.IdBeneficiario = response.data[0].Id;
                    ctrl.nombreBeneficiario = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                  }else{
                    agoraRequest.get('informacion_persona_juridica',$.param({
                      query:"Id:" + ctrl.numdocBeneficiario,
                      limit:-1
                    })).then(function(response){
                        if(!angular.isUndefined(response.data) && response.data!=null){
                            ctrl.nombreBeneficiario = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                            ctrl.IdBeneficiario = response.data[0].Id;
                        }else{
                          agoraRequest.get('supervisor_contrato',$.param({
                            query:"Documento:" + ctrl.numdocBeneficiario,
                            limit:-1
                          })).then(function(response){
                              if(!angular.isUndefined(response.data) && response.data!=null){
                                  ctrl.nombreBeneficiario = response.data[0].Nombre;
                                  ctrl.IdBeneficiario = response.data[0].Id;
                              }
                            });
                        }
                    });
                  }
              });
            }

          });
          ctrl.loadCircle = true;
        });

        ctrl.consultaBeneficiario = false;
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

   ctrl.crearSolicitud = function(){
     ctrl.SolicitudDevolucion={
       SolicitudDevolucion:{
           FormaPago:ctrl.formaPago,
           Vigencia:ctrl.vigencia,
           UnidadEjecutora:ctrl.unidadejecutora,
           CuentaDevolucion:{
             Banco:ctrl.banco.Id,
             TipoCuenta:ctrl.tipocuenta.Id,
             NumeroCuenta:ctrl.numeroCuenta.toString()
           },
           RazonDevolucion:ctrl.razonDevolucion,
           Observaciones:ctrl.observaciones,
           Soporte:ctrl.soporte.Id
         },
         EstadoDevolucion:{
             Id:6
         },
         TotalInversion: ctrl.valorSolicitado,
         Concepto: ctrl.concepto[0]
       };

       if (angular.isUndefined(ctrl.IdBeneficiario)){
         ctrl.IdBeneficiario = ctrl.numdocBeneficiario;
       }

       if (angular.isUndefined(ctrl.IdSolicitante)){
         ctrl.IdSolicitante = ctrl.numdocSoli;
       }

        ctrl.SolicitudDevolucion.Beneficiario = ctrl.IdBeneficiario;
        ctrl.SolicitudDevolucion.Solicitante = ctrl.IdSolicitante;
        ctrl.SolicitudDevolucion.SolicitudDevolucion.CuentaDevolucion.Titular = ctrl.IdSolicitante;


       angular.forEach(ctrl.movs, function(data) {
           delete data.Id;
       });

       ctrl.SolicitudDevolucion.Movimientos = ctrl.movs;

       financieraRequest.post('solicitud_devolucion/AddDevolution',ctrl.SolicitudDevolucion).then(function(response) {
         if(response.data.Type != undefined){
               swal('',$translate.instant(response.data.Code),response.data.Type);
          }
       });
     }

   });
