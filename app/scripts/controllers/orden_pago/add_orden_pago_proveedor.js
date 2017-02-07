'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoAddOrdenPagoProveedorCtrl
 * @description
 * # OrdenPagoAddOrdenPagoProveedorCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AddOrdenPagoProveedorCtrl', function ($scope, financieraRequest, administrativaRequest) {
    $scope.ordenPago = {};
    $scope.consultaOrdenPago = {};
    $scope.visible_campo_convenio = false;
    // get data
    financieraRequest.get("unidad_ejecutora", "")
      .then(function(response){
        $scope.unidad_ejecutora = response.data;
      });
    administrativaRequest.get("convenio", "")  //pending: por definir si vieene del rp
      .then(function(response){
        $scope.convenio = response.data;
      });

    //Operaciones que disparan los select
    $scope.convenio_select = function(Id){ //pending: por definir si vieene del rp
      $scope.consultaOrdenPago.ConvenioDescripcion = null;
      administrativaRequest.get("convenio", "query=Id%3A" + Id)
      .then(function(response){
        if(response.data){
          $scope.ordenPago.Convenio = {'Id': parseInt(Id)};
          $scope.consultaOrdenPago.ConvenioDescripcion = response.data[0]['NOMBRE'];
        }
      });
    }
    $scope.unidad_ejecutora_select = function(unidad_ejecutora){
      if(unidad_ejecutora){
        $scope.ordenPago.UnidadEjecutora = {'Id': unidad_ejecutora.Id}
        if(unidad_ejecutora.Id == 2){
          $scope.visible_campo_convenio = true;
        }else{
          $scope.visible_campo_convenio = false;
        }
      }
    }
    //
    $scope.tercero_por_tipo_persona = function(tipo_persona){
      if(tipo_persona){
        administrativaRequest.get("informacion_proveedor", "query=Tipopersona%3A" + tipo_persona)
          .then(function(response){
            $scope.tercero = response.data;
          });
      }
    }
    $scope.tercero_by_cc_select = function(num_cedula){
      if(num_cedula){
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


    // Insert
    $scope.addOrdenPagoProveedor = function(){
      $scope.ordenDePago.TipoIdentificacionTercero = "CC";
      $scope.ordenDePago.Estado = {Id:1};

      $http.post(api_path02 + "ordenes_de_pago/", $scope.ordenDePago)
          .success(function (data, status, header) {
              $scope.ServerResponse = data;
              $location.url('ordenes_de_pago');
          })
          .error(function (data, status, header, config) {
              $scope.ServerResponse =  status  + "----" + header + "----" + data;
              console.log(status  + "----" + header + "----" + data + '----' + config)
          });
    };
    //
    $scope.go = function(path){
      $location.url(path);
    };

  });
