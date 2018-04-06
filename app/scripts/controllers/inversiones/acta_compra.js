'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesActaCompraCtrl
 * @description
 * # InversionesActaCompraCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesActaCompraCtrl', function ($scope,$translate,administrativaRequest,financieraRequest) {
    var ctrl = this;
    ctrl.filtro_ingresos = "Ingreso";
    ctrl.concepto = [];

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

    ctrl.registrarInversion = function() { 
        ctrl.inversion = {
          Inversion:{
            Vendedor:ctrl.vendedor,
            Emisor:ctrl.emisor,
            NumOperacion:ctrl.NumOperacion,
            Trm:ctrl.trm,
            TasaNominal:ctrl.tasaNominal,
            ValorNomSaldo:ctrl.ValorNomSaldo,
            ValorNomSaldoMonNal:ctrl.ValorNomSaldoMonNal,
            ValorActual:ctrl.ValorActual,
            ValorNetoGirar:ctrl.ValorNetoGirar,
            FechaCompra:ctrl.fechaCompra,
            FechaRedencion:ctrl.fechaRedencion,
            FechaVencimiento:ctrl.fechaVencimiento,
            FechaEmision:ctrl.fechaEmision,
            Comprador:ctrl.comprador,
            ValorRecompra:ctrl.valorRecompra,
            FechaVenta:ctrl.fechaVenta,
            FechaPacto:ctrl.fechaPacto,
            Observaciones:ctrl.observaciones
          },
          tipoInversion:1,
          usuario:"admin"
        };
        console.log(ctrl.ingreso);
        financieraRequest.post('InversionesActaInversion/CreateInversion', ctrl.inversion).then(function(response) {
          if(response.data.Type != undefined){
            if(response.data.Type === "error"){
                swal('',$translate.instant(response.data.code),response.data.type);
            }else{
              var templateAlert = "<table class='table table-bordered'><th><th>" + $translate.instant('CONSECUTIVO') + "</th>";
              templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Id + "</td>" ;
              swal('',templateAlert,response.data.type);
            }
          }
        })
    };

  });
