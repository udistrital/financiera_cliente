'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistroCtrl
 * @description
 * # IngresosIngresoRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosIngresoRegistroCtrl', function(financieraRequest,pagosRequest) {
    var self = this;
    self.cargandoDatosPagos = false;
    self.gridOptions = {};
    self.gridOptions.columnDefs = [
      { name: 'VIGENCIA', displayName: 'Vigencia'  },
      { name: 'IDENTIFICACION', displayName: 'Identificación'  },
      { name: 'NOMBRE', displayName: 'Nombre' },
      //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
      { name: 'NUMERO_CUENTA', displayName: 'N° Cuenta'  },
      { name: 'TIPO_INGRESO', displayName: 'Ingreso' },
    ];




    self.ingreso = {};
    self.cargarTiposIngreso = function(){
      financieraRequest.get('forma_ingreso', $.param({
        limit: -1
      })).then(function(response) {
        self.tiposIngreso = response.data;
      });
    };

    self.registrarIngreso = function(){
      self.ingreso = {};
      self.ingreso.FormaIngreso = self.tipoIngresoSelec;
      self.ingreso.FechaIngreso = self.fechaConsignacion;
      console.log("day: "+(self.ingreso.FechaIngreso.getDate()));
      console.log("month: "+(self.ingreso.FechaIngreso.getMonth()+1));
      console.log("year: "+self.ingreso.FechaIngreso.getFullYear());
    };

    self.consultarPagos= function(){
      var parametros = {
        'dia': self.fechaConsignacion.getDate(),
        'mes': self.fechaConsignacion.getMonth()+1,
        'anio': self.fechaConsignacion.getFullYear(),
        'rango_ini': self.rango_inicial,
        'rango_fin': self.rango_fin

      };
      self.rta=null;
      self.pagos=null;
      self.cargandoDatosPagos = true;
      pagosRequest.get(parametros).then(function(response){
        if(response!=null){
          if(typeof response==="string"){

            console.log(response);
            self.rta=response;
          }else{

            self.pagos=response;
            self.gridOptions.data = self.pagos;

          }
        }else{

        }

      }).finally(function() {
        // called no matter success or failure
        self.cargandoDatosPagos = false;
  });;

    }

  });
