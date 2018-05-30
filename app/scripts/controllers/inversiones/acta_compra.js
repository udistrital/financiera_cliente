'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesActaCompraCtrl
 * @description
 * # InversionesActaCompraCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesActaCompraCtrl', function ($scope,$translate,administrativaRequest,financieraRequest,$location,ingresoDoc,coreRequest) {
    var ctrl = this;
    ctrl.filtro_ingresos = "Ingreso";
    ctrl.concepto = [];
    ctrl.Request={};
    ctrl.pactoVenta = false;

    $scope.$watch('actaComprainv.concepto[0]', function(oldValue, newValue) {
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
                };

            ctrl.cargar_titulos = function(){
                financieraRequest.get("titulo_inversion", $.param({
                    limit: -1
                  })).then(function(response) {
                    ctrl.titulos = response.data;
                  });
                };


                ctrl.cargar_vigencia = function() {
                  financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
                    ctrl.vigencia_calendarios = parseInt(response.data);
                    var year = parseInt(response.data) + 1;
                    ctrl.vigencias = [];
                    for (var i = 0; i < 5; i++) {
                      ctrl.vigencias.push(year - i);
                    }
                  });
                };

                ctrl.cargarBancos = function(){
                  coreRequest.get("banco", $.param({
                      limit: -1
                    })).then(function(response) {
                      ctrl.bancos = response.data;
                    });
                };

            ctrl.cargarUnidadesEjecutoras();
            ctrl.cargarTerceros();
            ctrl.cargar_vigencia();
            ctrl.cargar_titulos();
            ctrl.cargarBancos();


    ctrl.cargarInfoPadre = function(){
      ctrl.infoPadre = ingresoDoc.get();
      if (ctrl.infoPadre.Inversion != undefined) {
        ctrl.pactoVenta = true;
        financieraRequest.get("inversion", $.param({
                query:"Id:" + ctrl.infoPadre.Inversion.Id,
                limit: -1,
                sortby: "Id",
                order: "asc"
            })).then(function(response) {
              ctrl.NumOperacion = response.data[0].NumeroTransaccion;
              ctrl.trm = response.data[0].Trm;
              ctrl.tasaNominal=response.data[0].TasaNominal;
              ctrl.ValorNomSaldo=response.data[0].ValorNominalSaldo;
              ctrl.ValorNomSaldoMonNal=response.data[0].ValorNomSaldoMonNal;
              ctrl.ValorActual=response.data[0].ValorActual;
              ctrl.ValorNetoGirar=response.data[0].ValorNetoGirar;
              ctrl.fechaCompra=new Date(response.data[0].FechaCompra);
              ctrl.fechaRedencion=new Date(response.data[0].FechaRedencion);
              ctrl.fechaVencimiento=new Date(response.data[0].FechaVencimiento);
              ctrl.fechaEmision=new Date(response.data[0].FechaEmision);
              ctrl.valorRecompra = response.data[0].ValorRecompra;
              ctrl.observaciones = response.data[0].Observaciones;
              ctrl.vigencia = response.data[0].Vigencia;
              ctrl.unidadejecutora = response.data[0].UnidadEjecutora;
              ctrl.comprador = {Id:response.data[0].Comprador};
              ctrl.tipo = response.data[0].TituloInversion;
              ctrl.vendedor = {Id:response.data[0].Vendedor}
              ctrl.emisor = {Id:response.data[0].Emisor}

            });

      }
    };

    ctrl.cargarInfoPadre();

    ctrl.registrarInversion = function() {
      ctrl.infoPadre = ingresoDoc.get();


      if (angular.isUndefined(ctrl.concepto) || ctrl.concepto[0] == null) {
          swal("", $translate.instant('SELECCIONAR_CONCEPTO_INGRESO'), "error");
          return;
      }

      if (ctrl.concepto[0].validado===false){
        swal("",$translate.instant('PRINCIPIO_PARTIDA_DOBLE_ADVERTENCIA'),"warning");
        return;
      }
        ctrl.inversion = {
          Inversion:{
            Vendedor:parseInt(ctrl.vendedor.Id),
            Emisor:parseInt(ctrl.emisor.Id),
            NumeroTransaccion:ctrl.NumOperacion,
            Trm:ctrl.trm,
            TasaNominal:ctrl.tasaNominal,
            ValorNominalSaldo:ctrl.ValorNomSaldo,
            ValorNomSaldoMonNal:ctrl.ValorNomSaldoMonNal,
            ValorActual:ctrl.ValorActual,
            ValorNetoGirar:ctrl.ValorNetoGirar,
            FechaCompra:ctrl.fechaCompra,
            FechaRedencion:ctrl.fechaRedencion,
            FechaVencimiento:ctrl.fechaVencimiento,
            FechaEmision:ctrl.fechaEmision,
            ValorRecompra:ctrl.valorRecompra,
            FechaVenta:ctrl.fechaVenta,
            FechaPacto:ctrl.fechaPacto,
            Observaciones:ctrl.observaciones,
            UnidadEjecutora:ctrl.unidadejecutora,
            Vigencia:ctrl.vigencia,
            TituloInversion:ctrl.tipo
          },
          EstadoInversion:{
            Estado:{id:1},
            Activo:true
          },
          TotalInversion: ctrl.ValorNetoGirar,
          Concepto: ctrl.concepto[0],
          tipoInversion:1,
          usuario:32132222
        };

        if(!angular.isUndefined(ctrl.comprador)){
            ctrl.inversion.Inversion.Comprador = parseInt(ctrl.comprador.Id);
        }


        if (ctrl.infoPadre.Inversion != undefined) {
          ctrl.inversion.actapadre={Id:ctrl.infoPadre.Inversion.Id};
        }
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

              var tipoAlerta = response.data.Type;

              if (ctrl.infoPadre.Inversion != undefined) {
                financieraRequest.post('inversion_estado_inversion/AddEstadoInv', ctrl.infoPadre).then(function(response) {
                  if(response.data.Type != undefined){
                    if(response.data.Type === "error"){
                        swal('',$translate.instant(response.data.Code),response.data.Type);
                      }else{
                        swal('',$translate.instant(response.data.Code),response.data.Type).then(function(){
                          swal('',templateAlert,tipoAlerta).then(function(){
                            $scope.$apply(function(){
                              $location.path('/inversiones/consulta');
                            })
                          });
                        });
                      }
                    }
                  }).finally(function(){
                    ingresoDoc.set(ctrl.Request);
                  });
              }

              swal('',templateAlert,tipoAlerta).then(function(){
                $scope.$apply(function(){
                  $location.path('/inversiones/consulta');
                })
              });
            }
          }
        })
    };

    $scope.$watch('actaComprainv.concepto[0]', function(oldValue, newValue) {
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

  });
