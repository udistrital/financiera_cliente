'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionCrearFuenteCtrl
 * @description
 * # FuenteFinanciacionCrearFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('crearFuenteCtrl', function($scope, financieraRequest, $translate, oikosRequest, $timeout,$window) {

    var self = this;

    self.fecha = new Date();
    self.year = self.fecha.getFullYear();

    financieraRequest.get("fuente_financiamiento", 'limit=-1&sortby=descripcion&order=asc').then(function(response) {
      self.fuente_financiamiento = response.data;
    });

    financieraRequest.get("fuente_financiamiento_apropiacion", 'limit=-1').then(function(response) {
      self.fuente_financiamiento_apropiacion = response.data;
    });

    financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1').then(function(response) {
      self.movimiento_fuente_financiamiento_apropiacion = response.data;
    });

    financieraRequest.get("apropiacion", 'limit=-1&query=rubro.codigo__startswith:3-3&sortby=rubro&order=asc&query=vigencia:' + self.fecha).then(function(response) {
      self.apropiacion = response.data;
      self.gridOptionsapropiacion.data = response.data;
    });

    oikosRequest.get("dependencia", 'limit=-1&sortby=nombre&order=asc').then(function(response) {
      self.dependencia = response.data;
    });


    self.nueva_fuente = {};
    self.nueva_fuente_apropiacion = {};


    self.gridOptionsapropiacion = {
      enableSorting: true,
      enableFiltering: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 15,

      columnDefs: [{
          displayName: $translate.instant('CODIGO'),
          field: 'Rubro.Codigo',
          width: '50%'
        },
        {
          displayName: $translate.instant('RUBRO'),
          field: 'Rubro.Descripcion',
          width: '50%'
        },
      ]
    };

    self.select_id = {};

    self.gridOptionsapropiacion.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        self.select_id = row.entity;
        self.comprobarRubro(row.entity.Id);
        console.log(self.select_id);
        self.actualizar();
      });
    };

    self.gridOptionsapropiacion.multiSelect = false;

    self.rubros_seleccionados = [];

    self.totalmont = function() {
      self.totalMonto = 0;
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        if (self.rubros_seleccionados[i].ValorAsignado) {
          self.totalMonto = self.totalMonto + self.rubros_seleccionados[i].ValorAsignado;
        }
      }
      console.log(self.totalMonto);
      return self.totalMonto;
    };


    self.comprobarRubro = function(id) {
      var repetido = true;
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        console.log(self.rubros_seleccionados[i].Id);
        if ((self.rubros_seleccionados[i].Id) == id) {
          repetido = false;
        }
      }
      if (repetido == true) {

        self.rubros_seleccionados.push(self.select_id);
        var data = {
          Rubro: id,
          Valor: "",
          Dependencia: "",
          NomDependencia: ""
        }
        self.rubros_seleccionados[self.rubros_seleccionados.length - 1].seleccionado = [];
        self.rubros_seleccionados[self.rubros_seleccionados.length - 1].seleccionado.push(data);
      }
    };

    self.agregar_dependencia = function(id) {

      for (var i = 0; i < self.rubros_seleccionados.length; i++) {

        if (self.rubros_seleccionados[i].Id == id) {
          var data = {
            Rubro: id,
            Valor: "",
            Dependencia: "",
            NomDependencia: ""
          }

          self.rubros_seleccionados[i].seleccionado.push(data);

        }
      }
      console.log(self.rubros_seleccionados)
      self.actualizar();
    };


    self.quitarRubro = function(id) {


      for (var i = 0; i < self.rubros_seleccionados.length; i++) {

        if (self.rubros_seleccionados[i].Id == id) {
          self.rubros_seleccionados.splice(i, 1)
        }
      }
    }

    self.quitarDependencia = function(rubro, dep) {

      console.log(rubro, dep);
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {

        if (self.rubros_seleccionados[i].Id == rubro) {

          for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {

            if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == dep) {

              self.rubros_seleccionados[i].seleccionado.splice(j, 1)
            }
          }
        }
      }
    }

    self.montoAsignado = function() {

      self.totalMonto = 0;
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
          for (var k = 0; k < self.dependencia.length; k++) {
            if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == self.dependencia[k].Id) {
              self.rubros_seleccionados[i].seleccionado[j].NomDependencia = self.dependencia[k].Nombre;
            }
          }

          self.totalMonto = self.totalMonto + parseInt(self.rubros_seleccionados[i].seleccionado[j].Valor);
          console.log(self.totalMonto);
        }
      }
      console.log(self.totalMonto);
      if (self.totalMonto == self.nueva_fuente_apropiacion.Monto) {
        console.log("si");
        return true;
      } else {
        console.log("no");
        return false;
      }
    };

    self.comprobar_fuente = function() {

      self.registrar = true;

      if (self.nueva_fuente.Codigo == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_CODIGO'), "error");
      } else if (self.nueva_fuente.Nombre == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_NOMBRE'), "error");
      } else if (self.nueva_fuente.Descripcion == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_DESCRIPCION'), "error");
      } else if (self.nueva_fuente_apropiacion.Monto == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_TOTAL'), "error");
      } else if (self.nueva_fuente_apropiacion.Fechainicio == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_FECHA_REGISTRO'), "error");
      } else if (self.rubros_seleccionados.length == 0) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_RUBROS_FUENTE'), "error");
      } else {


        for (var i = 0; i < self.rubros_seleccionados.length; i++) {
          for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
            if (self.rubros_seleccionados[i].seleccionado[j].Valor == 0) {
              swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_DEPENDENCIA'), "error");
              self.registrar = false;
            } else if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == 0) {
              swal($translate.instant('ERROR'), $translate.instant('INGRESE_DEPENDENCIA'), "error");
              self.registrar = false;
            }
          }
        }
        if (self.registrar) {
          if (self.montoAsignado()) {
            $("#myModal").modal();
          } else {
            swal($translate.instant('ERROR'), $translate.instant('MONTO_MAYOR_FUENTE_FINANCIAMIENTO'), "error");
          }
        }
      }
    };

    self.cerrar_ventana = function() {
      $("#myModal").modal('hide');
    };

    self.crear_fuente = function() {

      self.fuente_encontrada = false;
      self.cerrar_ventana();
      if(self.fuente_financiamiento){
      for (var i = 0; i < self.fuente_financiamiento.length; i++) {
        if (self.fuente_financiamiento[i].Codigo == self.nueva_fuente.Codigo) {
          self.asignar_rubros(self.fuente_financiamiento[i].Id);
          self.fuente_encontrada = true;
          swal($translate.instant('PROCESO_COMPLETADO'), $translate.instant('REGISTRO_CORRECTO'), "success").then(function() {
            $window.location.href = '#/fuente_financiacion/consulta_fuente';
          });


        }
      }
    }
      var data = {
        Codigo: self.nueva_fuente.Codigo,
        Nombre: self.nueva_fuente.Nombre,
        Descripcion: self.nueva_fuente.Descripcion
      }

      if (!self.fuente_encontrada) {

        financieraRequest.post("fuente_financiamiento", data).then(function(response) {
          self.fuente_financiamiento = response.data;
          console.log("resultado =]");
          console.log(response.data);
          console.log(response.data.Id);
          self.id = response.data.Id;
          self.asignar_rubros(self.id);
          swal($translate.instant('PROCESO_COMPLETADO'), $translate.instant('REGISTRO_CORRECTO'), "success").then(function() {
            $window.location.href = '#/fuente_financiacion/consulta_fuente';
          });

        });
      }



    };

    self.asignar_rubros = function(id) {

      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        console.log("rubro");

        console.log(id);
        console.log(self.rubros_seleccionados[i].seleccionado);


        for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {

          self.crear_fuente_apropiacion(id, self.rubros_seleccionados[i].seleccionado[j].Rubro, self.rubros_seleccionados[i].seleccionado[j].Dependencia, self.rubros_seleccionados[i].seleccionado[j].Valor);

        }
      }
    };

    self.crear_fuente_apropiacion = function(fuente, rubro, dependencia, valor) {

      var data = {

        Dependencia: parseInt(dependencia),

        Apropiacion: {
          Id: parseInt(rubro)
        },
        FuenteFinanciamiento: {
          Id: parseInt(fuente)
        }
      }

      console.log(data);

      financieraRequest.post("fuente_financiamiento_apropiacion", data).then(function(response) {
        self.fuente_financiamiento_apropiacion=response.data;
        console.log(response.data);
        self.id = response.data.Id;
        self.crear_Movimiento_apropiacion(self.id, valor, 1);
        console.log('resul: ' + self.id);
      });

    };

    self.crear_Movimiento_apropiacion = function(apropiacion, valor, tipo) {

      var data = {
        Valor: parseInt(valor),
        Fecha: self.nueva_fuente_apropiacion.Fechainicio,
        TipoMovimiento: {
          Id: parseInt(tipo)
        },
        FuenteFinanciamientoApropiacion: {
          Id: parseInt(apropiacion)
        }
      }

      financieraRequest.post("movimiento_fuente_financiamiento_apropiacion", data).then(function(response) {
        self.movimiento_fuente_financiamiento_apropiacion=response.data;
        console.log(response.data);
      });
    };


    self.actualizar = function() {
      $timeout(function() {
        $('.selectpicker').selectpicker('refresh');
      },10);
    };


  });
