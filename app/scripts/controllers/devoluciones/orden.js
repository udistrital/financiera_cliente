'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesOrdenCtrl
 * @description
 * # DevolucionesOrdenCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesOrdenCtrl', function ($scope,agoraRequest,wso2Request,financieraMidRequest,financieraRequest,$translate,administrativaRequest,coreRequest,$location) {
   var ctrl = this;
   ctrl.selectedcar = {};
   ctrl.concepto = [];
   $scope.load = false;
   ctrl.cargando_nombre = false;

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

   ctrl.camposObligatorios = function() {
     var respuesta;
     self.MensajesAlerta = '';


     if($scope.datosSolicitante.$invalid){
       angular.forEach($scope.datosSolicitante.$error,function(controles,error){
         angular.forEach(controles,function(control){
           control.$setDirty();
         });
       });

       self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS_SOLICITANTE") + "</li>";


     }else{
       if(ctrl.encontrado === false){
         self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant("MSN_SOL_NO_ENC") + "</li>";
       }
     }

     if($scope.datosBeneficiario.$invalid){
       angular.forEach($scope.datosBeneficiario.$error,function(controles,error){
         angular.forEach(controles,function(control){
           control.$setDirty();
         });
       });

       self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS_BENEFICIARIO") + "</li>";


     }else{
       if(ctrl.encontrado_ben === false){
         self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant("MSN_BEN_NO_ENC") + "</li>";
       }
     }

     if($scope.datosOblig.$invalid){
       angular.forEach($scope.datosBeneficiario.$error,function(controles,error){
         angular.forEach(controles,function(control){
           control.$setDirty();
         });
       });

       self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS") + "</li>";


     }

     if(ctrl.concepto[0] === undefined){
       self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant("MSN_DEBE_CONCEPTO") + "</li>";

     }

     if(ctrl.concepto[0] !== undefined){
       if(ctrl.concepto[0].validado === false){
         self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant("PRINCIPIO_PARTIDA_DOBLE_ADVERTENCIA") + "</li>";
       }
     }


     // Operar
     if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
       respuesta = true;
     } else {
       respuesta =  false;
     }

     return respuesta;
   };


   $scope.$watch('ordendevolucion.concepto[0]', function(newValue,oldValue) {
       if (!angular.isUndefined(newValue)) {
            ctrl.movs=undefined;
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


       ctrl.encontrado=false;
       ctrl.cargando_sol = true;
       ctrl.nombreSolicitante = null;

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
              ctrl.cargando_sol = false;
            }else{
              agoraRequest.get('informacion_persona_natural',$.param({
                query:"Id:" + ctrl.numdocSoli +",TipoDocumento.Id: " + ctrl.tipoDocSoli.Id,
                limit:-1
              })).then(function(response){
                if(!angular.isUndefined(response.data) && typeof(response.data) !== "string"){

                    ctrl.nombreSolicitante = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;

                    ctrl.IdSolicitante = response.data[0].Id;
                    ctrl.encontrado = true;
                    ctrl.cargando_sol = false;
                  }else{
                    agoraRequest.get('informacion_persona_juridica',$.param({
                      query:"Id:" + ctrl.numdocSoli,
                      limit:-1
                    })).then(function(response){
                        if(!angular.isUndefined(response.data) && typeof(response.data) !== "string"){

                            ctrl.nombreSolicitante = response.data[0].NomProveedor;
                            ctrl.IdSolicitante = response.data[0].Id;
                            ctrl.encontrado = true;
                            ctrl.cargando_sol = false;
                        }else{
                          agoraRequest.get('supervisor_contrato',$.param({
                            query:"Documento:" + ctrl.numdocSoli,
                            limit:-1
                          })).then(function(response){
                              if(!angular.isUndefined(response.data) && typeof(response.data) !== "string"){
                                  ctrl.IdSolicitante = response.data[0].Id;
                                  ctrl.nombreSolicitante = response.data[0].Nombre;
                                  ctrl.encontrado = true;
                                  ctrl.cargando_sol = false;
                              }else{
                                ctrl.encontrado = false;
                                ctrl.cargando_sol = false;
                                ctrl.nombreSolicitante = $translate.instant('NO_ENCONTRADO');
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



   };


   ctrl.consultaBen = function(){
       ctrl.encontrado_ben = false;
       ctrl.cargando_ben = true;
       ctrl.nombreBeneficiario = null;

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
              ctrl.encontrado_ben = true;
              ctrl.cargando_ben = false;
              ctrl.nombreBeneficiario = dataAcademica.data.InformacionEstudiante.Nombre;
            }else{
              agoraRequest.get('informacion_persona_natural',$.param({
                query:"Id:" + ctrl.numdocBeneficiario +",TipoDocumento.Id: " + ctrl.tipoDocBen.Id,
                limit:-1
              })).then(function(response){
                if(!angular.isUndefined(response.data) &&  typeof(response.data) !== "string"){
                   ctrl.encontrado_ben = true;
                    ctrl.cargando_ben = false;
                    ctrl.IdBeneficiario = response.data[0].Id;
                    ctrl.nombreBeneficiario = response.data[0].PrimerNombre + " " + response.data[0].SegundoNombre + " " + response.data[0].PrimerApellido + " "+ response.data[0].SegundoApellido;
                  }else{
                    agoraRequest.get('informacion_persona_juridica',$.param({
                      query:"Id:" + ctrl.numdocBeneficiario,
                      limit:-1
                    })).then(function(response){
                        if(!angular.isUndefined(response.data) && typeof(response.data) !== "string"){
                           ctrl.encontrado_ben = true;
                            ctrl.cargando_ben = false;
                            ctrl.nombreBeneficiario = response.data[0].NomProveedor;
                            ctrl.IdBeneficiario = response.data[0].Id;
                        }else{
                          agoraRequest.get('supervisor_contrato',$.param({
                            query:"Documento:" + ctrl.numdocBeneficiario,
                            limit:-1
                          })).then(function(response){
                              if(!angular.isUndefined(response.data) &&  typeof(response.data) !== "string"){
                                  ctrl.encontrado_ben = true;
                                  ctrl.cargando_ben = false;
                                  ctrl.nombreBeneficiario = response.data[0].Nombre;
                                  ctrl.IdBeneficiario = response.data[0].Id;
                              }else{
                                 ctrl.encontrado_ben = false;
                                  ctrl.cargando_ben = false;
                                  ctrl.nombreBeneficiario = $translate.instant('NO_ENCONTRADO');
                              }
                            });
                        }
                    });
                  }
              });
            }

          });

        });


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


     var validar_campos = ctrl.camposObligatorios();
     if(validar_campos != false){
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

        ctrl.SolicitudDevolucion.SolicitudDevolucion.Beneficiario = parseInt(ctrl.IdBeneficiario);
        ctrl.SolicitudDevolucion.SolicitudDevolucion.Solicitante = parseInt(ctrl.IdSolicitante);
        ctrl.SolicitudDevolucion.SolicitudDevolucion.CuentaDevolucion.Titular = ctrl.IdSolicitante;

        console.log(ctrl.SolicitudDevolucion);

       angular.forEach(ctrl.movs, function(data) {
           delete data.Id;
       });

       ctrl.SolicitudDevolucion.Movimientos = ctrl.movs;

       financieraRequest.post('solicitud_devolucion/AddDevolution',ctrl.SolicitudDevolucion).then(function(response) {
         var templateAlert ;
         if(response.data.Type != undefined){
           templateAlert = $translate.instant(response.data.Code);
           if(response.data.Type === "success"){
              templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
              templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Id + "</td>" + "<td>" + $translate.instant(response.data.Code) + "</td></tr>" ;
              templateAlert = templateAlert + "</table>";
            }
               swal('',templateAlert,response.data.Type).then(function(){
                 if(response.data.Type === "success"){
                   $scope.$apply(function(){
                       $location.path('/devoluciones/consulta_relacion');
                   });
                 }
               });
          }
       });
     }else {
       // mesnajes de error campos obligatorios
       swal({
         title: '¡Error!',
         html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
         type: 'error'
       })
     }
 };

   });
