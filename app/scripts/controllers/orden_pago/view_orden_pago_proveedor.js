'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoViewOrdenPagoProveedorCtrl
 * @description
 * # OrdenPagoViewOrdenPagoProveedorCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ViewOrdenPagoProveedorCtrl', function ($scope, $routeParams, $location, financieraRequest, administrativaRequest) {
    $scope.ordenPago = {}
    $scope.consultaOrdenPago =  {}
    // get data
    financieraRequest.get("unidad_ejecutora", "")
      .then(function(response){
        $scope.unidad_ejecutora = response.data;
      });
    financieraRequest.get("tipo_orden_pago", "query=EstadoActivo%3Atrue")
      .then(function(response){
        $scope.tipo_orden_pago = response.data;
      });
    //
    financieraRequest.get("orden_pago", "query=Id%3A" + $routeParams.Id)
      .then(function(response){
        $scope.ordenPago = response.data[0];
        console.log($scope.ordenPago)
        //informacion RP
        $scope.getDataRp($scope.ordenPago.RegistroPresupuestal)
      });

    $scope.getDataRp = function(rp){
      administrativaRequest.get("registo_presupuestal", "query=Id%3A" + String(rp))
        .then(function(response){
          $scope.rp_seleccion = response.data[0];
          $scope.consultaOrdenPago.RP_valor = response.data[0].Valor;
          $scope.consultaOrdenPago.RubroCodigo = response.data[0].Rubro.Codigo;
          $scope.consultaOrdenPago.RubroDescripcion = response.data[0].Rubro.Descripcion;
          $scope.consultaOrdenPago.DisponibilidadNumeroDisponibilidad = response.data[0].Disponibilidad.NumeroDisponibilidad;
          $scope.consultaOrdenPago.DisponibilidadObjeto = response.data[0].Disponibilidad.Objeto;
          $scope.consultaOrdenPago.VigenciaPresupuestal = response.data[0].Vigencia;
          // infromacion proveedor
          $scope.getDataTercero(response.data[0].Beneficiario)
        });
    }
    $scope.getDataTercero = function(num_cedula){
      administrativaRequest.get("registo_presupuestal", "query=Beneficiario%3A" + num_cedula)
        .then(function(response){
          if(response.data){
            $scope.rp_by_tercero_data = response.data;
          }
        });
      administrativaRequest.get("informacion_proveedor", "query=NumDocumento%3A" + num_cedula)
        .then(function(response){
          $scope.tipo_tercero_seleccion = response.data[0].Tipopersona
          $scope.numero_identificacion_seleccion = num_cedula;
          $scope.consultaOrdenPago.TerceroNombre = response.data[0]['NomProveedor'];
          $scope.consultaOrdenPago.TerceroDireccion = response.data[0]['Direccion'];
          $scope.consultaOrdenPago.TerceroTelefono = response.data[0]['TelAsesor'];
          $scope.consultaOrdenPago.TerceroNumeroCuenta = response.data[0]['NumCuentaBancaria'];
          $scope.consultaOrdenPago.TerceroBanco = response.data[0]['IdEntidadBancaria']['NombreBanco'];
          $scope.consultaOrdenPago.TerceroTipoCuenta = response.data[0]['TipoCuentaBancaria'];
        });
    }
    // function link
    $scope.go = function(path){
      $location.url(path);
    };
  });
