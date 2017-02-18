'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoAddOrdenPagoProveedorCtrl
 * @description
 * # OrdenPagoAddOrdenPagoProveedorCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AddOrdenPagoProveedorCtrl', function ($scope, financieraRequest, administrativaRequest, goLink, $location) {
    $scope.ordenPago = {};
    $scope.consultaOrdenPago = {};
    $scope.ordenPago.Vigencia = new Date().getFullYear();
    // get data
    financieraRequest.get("unidad_ejecutora", "")
      .then(function(response){
        $scope.unidad_ejecutora = response.data;
      });
    financieraRequest.get("tipo_orden_pago", "query=EstadoActivo%3Atrue")
      .then(function(response){
        $scope.tipo_orden_pago = response.data;
      });

    //Operaciones que disparan los select
    $scope.unidad_ejecutora_select = function(unidad_ejecutora){
      if(unidad_ejecutora){
        //$scope.ordenPago.UnidadEjecutora = {'Id': unidad_ejecutora.Id}
        financieraRequest.get("unidad_ejecutora", "query=Id%3A" + unidad_ejecutora)
          .then(function(response){
            $scope.ordenPago.UnidadEjecutora  = response.data[0];
          });
      }
    }
    $scope.tercero_por_tipo_persona = function(tipo_persona){
      if(tipo_persona){
        $scope.inicializar_data_tercero_select();
        $scope.inicializar_data_rp_select();
        administrativaRequest.get(
          "informacion_proveedor",
          $.param({
            query: "Tipopersona:"+tipo_persona,
            limit:0
          })
        ).then(function(response){
            $scope.tercero = response.data;
          });
      }
    }
    $scope.tercero_by_cc_select = function(num_cedula){
      if(num_cedula){
        $scope.inicializar_data_rp_select();
        administrativaRequest.get("informacion_proveedor", "query=NumDocumento%3A" + num_cedula)
          .then(function(response){
            if(response.data){
              $scope.consultaOrdenPago.TerceroNombre = response.data[0]['NomProveedor'];
              $scope.consultaOrdenPago.TerceroDireccion = response.data[0]['Direccion'];
              $scope.consultaOrdenPago.TerceroTelefono = response.data[0]['TelAsesor'];
              $scope.consultaOrdenPago.TerceroNumeroCuenta = response.data[0]['NumCuentaBancaria'];
              $scope.consultaOrdenPago.TerceroBanco = response.data[0]['IdEntidadBancaria']['NombreBanco'];
              $scope.consultaOrdenPago.TerceroTipoCuenta = response.data[0]['TipoCuentaBancaria'];

              $scope.rp_by_tercero(num_cedula);
            }
          });
      }
    };
    //
    $scope.rp_by_tercero = function(num_cedula){
      administrativaRequest.get("registo_presupuestal", "query=Beneficiario%3A" + num_cedula)
        .then(function(response){
          if(response.data){
            $scope.rp_by_tercero_data = response.data;
          }
        });
    }
    $scope.get_data_rp_select = function(numero_rp){
      if (numero_rp.Id) {
        $scope.ordenPago.RegistroPresupuestal = numero_rp.Id;
        administrativaRequest.get("registo_presupuestal", "query=Id%3A" + numero_rp.Id)
          .then(function(response){
            if(response.data){
              $scope.consultaOrdenPago.RP_valor = response.data[0].Valor;
              $scope.consultaOrdenPago.RubroCodigo = response.data[0].Rubro.Codigo;
              $scope.consultaOrdenPago.RubroDescripcion = response.data[0].Rubro.Descripcion;
              $scope.consultaOrdenPago.DisponibilidadNumeroDisponibilidad = response.data[0].Disponibilidad.NumeroDisponibilidad;
              $scope.consultaOrdenPago.DisponibilidadObjeto = response.data[0].Disponibilidad.Objeto;
              $scope.consultaOrdenPago.VigenciaPresupuestal = response.data[0].Vigencia;
            }
          });
      }
    }
    $scope.inicializar_data_rp_select = function(){
      $scope.rp_by_tercero_data = null;
      $scope.ordenPago.RegistroPresupuestal = null;
      $scope.consultaOrdenPago.RP_valor = null;
      $scope.consultaOrdenPago.RubroCodigo = null;
      $scope.consultaOrdenPago.RubroDescripcion = null;
      $scope.consultaOrdenPago.DisponibilidadNumeroDisponibilidad = null;
      $scope.consultaOrdenPago.DisponibilidadObjeto = null;
      $scope.consultaOrdenPago.VigenciaPresupuestal = null;
    }
    $scope.inicializar_data_tercero_select = function(){
      $scope.consultaOrdenPago.TerceroNombre = null;
      $scope.consultaOrdenPago.TerceroDireccion = null;
      $scope.consultaOrdenPago.TerceroTelefono = null;
      $scope.consultaOrdenPago.TerceroNumeroCuenta = null;
      $scope.consultaOrdenPago.TerceroBanco = null;
      $scope.consultaOrdenPago.TerceroTipoCuenta = null;
    }

    $scope.get_valor_bruto  = function (valor_base, iva){
      if(valor_base == null || valor_base == 0){
        $scope.ValorIva = 0;
        $scope.ValorBruto =0;
      }else if(iva == null || iva == 0) {
        $scope.ValorIva = 0;
        $scope.ValorBruto =0;
      }else{
        $scope.Iva = parseInt(iva);
        $scope.ValorIva = ( parseInt(valor_base) * ( parseInt(iva)/100) );
        $scope.ValorBruto = parseInt(valor_base) + parseInt($scope.ValorIva);
        $scope.ordenPago.ValorTotal = parseInt(valor_base) + parseInt($scope.ValorIva);
      }
    }
    // function link
    $scope.go = function(path){
      $location.url(path);
    };
    // Insert Orden Pago
    $scope.addOpProveedor = function(){
      //$scope.ordenPago.RegistroPresupuestal = 1;
      //$scope.ordenPago.ValorTotal = 10000;
      $scope.ordenPago.PersonaElaboro = 1;
      //$scope.ordenPago.TipoOrdenPago = {'Id':1};
      //$scope.ordenPago.UnidadEjecutora = {'Id': 1};
      $scope.ordenPago.EstadoOrdenPago = {'Id': 1};
      //console.log($scope.ordenPago)

      financieraRequest.post("orden_pago", $scope.ordenPago)
        .then(function(data) {   //error con el success
          goLink.go('orden_pago_all')
        })
        /*.error(function(data, status, headers, config) {
          console.log("error");
        })*/
    }
    //
  });
