'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionModificacionFuenteCtrl
 * @description
 * # FuenteFinanciacionModificacionFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('modificacionFuenteCtrl', function($window, $scope, financieraRequest, $translate, oikosRequest, $timeout) {

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

    oikosRequest.get("dependencia", 'limit=-1').then(function(response) {
      self.dependencia = response.data;
    });

    financieraRequest.get("tipo_movimiento", 'limit=-1').then(function(response) {
      self.tipo = response.data;

      for (var i = 0; i < self.tipo.length; i++) {
        if (self.tipo[i].Nombre == "Registro") {
          self.tipo.splice(i,1)
        }
      }

    });

    self.anulacion = false;
    self.traslado = false;
    self.adicion = false;
    self.registro = false;


    self.cambiar_estado = function() {

      self.anulacion = false;
      self.traslado = false;
      self.adicion = false;
      self.registro = false;


      for (var i = 0; i < self.tipo.length; i++) {

        console.log(self.tipo_fuente)
        if (self.tipo[i].Id == self.tipo_fuente) {
          if (self.tipo[i].Nombre == "Cancelación") {
            self.anulacion = true;
            self.mostrar_rubros();
          } else if (self.tipo[i].Nombre == "Traslado") {
            self.traslado = true;
            self.mostrar_rubros();
          } else if (self.tipo[i].Nombre == "Adición") {
            self.adicion = true;
            self.mostrar_rubros();
          } else if (self.tipo[i].Nombre == "Registro") {
            self.rubros_seleccionados=[];
            self.registro = true;
          }
        }
      }
    };

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

    self.gridOptionsapropiacion.multiSelect = false;
    self.select_id = {};

    self.gridOptionsapropiacion.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        if (!self.anulacion) {
          self.select_id = row.entity;
          self.comprobarRubro(row.entity);
          self.actualizar();
        }
      });
    };

    self.rubros_seleccionados = [];
    self.rubros_seleccionados_origen = [];

    self.comprobarRubro = function(apropiacion) {
      var repetido = true;
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        if ((self.rubros_seleccionados[i].Id) == apropiacion.Rubro.Id) {
          repetido = false;
        }
      }
      if (repetido == true) {
        self.rubros_seleccionados.push(self.select_id);
        var data = {
          Apropiacion: apropiacion.Id,
          ValorTotal: 0,
          Valor: "",
          Dependencia: "",
          NomDependencia: ""
        }
        self.rubros_seleccionados[self.rubros_seleccionados.length - 1].seleccionado = [];
        self.rubros_seleccionados[self.rubros_seleccionados.length - 1].seleccionado.push(data);
      }
    };

    self.mostrar_rubros = function() {
      self.rubros_seleccionados = [];
      for (var i = 0; i < self.fuente_financiamiento_apropiacion.length; i++) {
        self.codigo_rubro = self.fuente_financiamiento_apropiacion[i].Apropiacion;
        if (self.fuente_financiamiento_apropiacion[i].FuenteFinanciamiento.Id == self.modificar_fuente) {
          var repetido = false;
          for (var j = 0; j < self.rubros_seleccionados.length; j++) {
            if (self.rubros_seleccionados[j].Id == self.codigo_rubro.Id) {
              repetido = true;
            }
          }
          if (!repetido) {
            self.rubros_seleccionados.push(self.codigo_rubro);
            self.rubros_seleccionados[self.rubros_seleccionados.length - 1].seleccionado = [];
          }
        }
      }
      self.valor_total = 0;
      self.valor_dependencia = 0;
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        for (var j = 0; j < self.fuente_financiamiento_apropiacion.length; j++) {
          if (self.fuente_financiamiento_apropiacion[j].FuenteFinanciamiento.Id == self.modificar_fuente && self.rubros_seleccionados[i].Id == self.fuente_financiamiento_apropiacion[j].Apropiacion.Id) {
            for (var k = 0; k < self.movimiento_fuente_financiamiento_apropiacion.length; k++) {
              console.log("-", self.movimiento_fuente_financiamiento_apropiacion[k].FuenteFinanciamientoApropiacion.Id)
              if (self.movimiento_fuente_financiamiento_apropiacion[k].FuenteFinanciamientoApropiacion.Id == self.fuente_financiamiento_apropiacion[j].Id) {
                self.valor_total = self.valor_total+self.movimiento_fuente_financiamiento_apropiacion[k].Valor;
                self.valor_dependencia = self.movimiento_fuente_financiamiento_apropiacion[k].Valor;
              }
            }
            self.agregar_dependencia(self.rubros_seleccionados[i].Id, self.fuente_financiamiento_apropiacion[j].Dependencia, self.valor_dependencia, self.fuente_financiamiento_apropiacion[j].Apropiacion.Id);
          }
        }
      }
    };

    self.mostrar_rubros_origen = function() {

      self.rubros_seleccionados_origen = [];
      for (var i = 0; i < self.fuente_financiamiento_apropiacion.length; i++) {
        self.codigo_rubro = self.fuente_financiamiento_apropiacion[i].Apropiacion;
        if (self.fuente_financiamiento_apropiacion[i].FuenteFinanciamiento.Id == self.fuente_origen) {
          var repetido = false;
          for (var j = 0; j < self.rubros_seleccionados_origen.length; j++) {
            if (self.rubros_seleccionados_origen[j].Id == self.codigo_rubro.Id) {
              repetido = true;
            }
          }
          if (!repetido) {
            self.rubros_seleccionados_origen.push(self.codigo_rubro);
            self.rubros_seleccionados_origen[self.rubros_seleccionados_origen.length - 1].seleccionado = [];
          }
        }
      }

      self.valor_total1 = 0;
      self.valor_dependencia=0;
      for (var i = 0; i < self.rubros_seleccionados_origen.length; i++) {
        for (var j = 0; j < self.fuente_financiamiento_apropiacion.length; j++) {
          if (self.fuente_financiamiento_apropiacion[j].FuenteFinanciamiento.Id == self.fuente_origen && self.rubros_seleccionados_origen[i].Id == self.fuente_financiamiento_apropiacion[j].Apropiacion.Id) {
            for (var k = 0; k < self.movimiento_fuente_financiamiento_apropiacion.length; k++) {

              if (self.movimiento_fuente_financiamiento_apropiacion[k].FuenteFinanciamientoApropiacion.Id == self.fuente_financiamiento_apropiacion[j].Id) {
                self.valor_total1 = self.valor_total1+self.movimiento_fuente_financiamiento_apropiacion[k].Valor;
                self.valor_dependencia = self.movimiento_fuente_financiamiento_apropiacion[k].Valor;
              }
            }
            self.agregar_dependencia_origen(self.rubros_seleccionados_origen[i].Id, self.fuente_financiamiento_apropiacion[j].Dependencia, self.valor_dependencia, self.fuente_financiamiento_apropiacion[j].Apropiacion.Id);
          }
        }
      }
    };

    self.agregar_dependencia_origen = function(id, dependencia, valor, apropiacion) {
      for (var i = 0; i < self.rubros_seleccionados_origen.length; i++) {
        if (self.rubros_seleccionados_origen[i].Id == id) {
          self.rep = true;
          var data = {
            Apropiacion: apropiacion,
            ValorTotal: valor,
            Valor: "",
            Dependencia: dependencia,
            NomDependencia: ""
          }
          for (var j = 0; j < self.rubros_seleccionados_origen[i].seleccionado.length; j++) {
            if (dependencia == self.rubros_seleccionados_origen[i].seleccionado[j].Dependencia) {
              self.rep = false;
              self.rubros_seleccionados_origen[i].seleccionado[j].ValorTotal = valor + self.rubros_seleccionados_origen[i].seleccionado[j].ValorTotal;
            }
          }
          if (self.rep) {
            self.rubros_seleccionados_origen[i].seleccionado.push(data);
          }
        }
      }
      self.actualizar();
    };

    self.agregar_dependencia = function(id, dependencia, valor, apropiacion) {
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        if (self.rubros_seleccionados[i].Id == id) {
          self.rep = true;
          var data = {
            Apropiacion: apropiacion,
            ValorTotal: valor,
            Valor: "",
            Dependencia: dependencia,
            NomDependencia: ""
          }
          for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
            if (dependencia == self.rubros_seleccionados[i].seleccionado[j].Dependencia) {
              self.rep = false;
              self.rubros_seleccionados[i].seleccionado[j].ValorTotal = valor + self.rubros_seleccionados[i].seleccionado[j].ValorTotal;
            }
          }
          if (self.rep) {
            self.rubros_seleccionados[i].seleccionado.push(data);
          }
        }
      }
      self.actualizar();
      console.log(self.rubros_seleccionados)
    };

    self.agregar_dep = function(id) {

      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        if (self.rubros_seleccionados[i].Id == id) {
            var data = {
            Apropiacion: id,
            ValorTotal: 0,
            Valor: "",
            Dependencia: "",
            NomDependencia: ""
          }
          self.rubros_seleccionados[i].seleccionado.push(data);
        }
        self.actualizar();
      }
    };

    self.quitarRubro = function(id) {
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        if (self.rubros_seleccionados[i].Id == id) {
          self.rubros_seleccionados.splice(i, 1)
        }
      }
    }

    self.quitarRubroOrigen = function(id) {

      for (var i = 0; i < self.rubros_seleccionados_origen.length; i++) {
        if (self.rubros_seleccionados_origen[i].Id == id) {
          self.rubros_seleccionados_origen.splice(i, 1)
        }
      }
    }

    self.quitarDependenciaOrigen = function(rubro, dep) {

      console.log(rubro, dep);
      for (var i = 0; i < self.rubros_seleccionados_origen.length; i++) {
          for (var j = 0; j < self.rubros_seleccionados_origen[i].seleccionado.length; j++) {
            if (self.rubros_seleccionados_origen[i].seleccionado[j].Dependencia == dep) {
              self.rubros_seleccionados_origen[i].seleccionado.splice(j, 1)
            }
          }

      }
    }

    self.quitarDependencia = function(rubro, dep) {

      console.log(rubro, dep);
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
          for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
            if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == dep) {
              self.rubros_seleccionados[i].seleccionado.splice(j, 1)
            }
          }
      }
    }

    self.registrar = true;

    self.montoAsignado = function() {
      self.valorTotal=0;
      self.totalMonto = 0;

      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
          for (var k = 0; k < self.dependencia.length; k++) {
            if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == self.dependencia[k].Id) {
              self.rubros_seleccionados[i].seleccionado[j].NomDependencia = self.dependencia[k].Nombre;
            }
          }
          self.totalMonto = self.totalMonto + parseInt(self.rubros_seleccionados[i].seleccionado[j].Valor);
        }
      }
      self.valorTotal=self.totalMonto+self.valor_total;
      if (self.totalMonto == self.nueva_fuente_apropiacion.Monto) {
        return true;
      } else {
        return false;
      }
    };

    self.montoAsignadoOrigen = function() {
      self.valorTotal=0;
      self.valorTotal1=0;
      self.totalMontoOrigen = 0;
      self.totalMontoDestino = 0;

      for (var i = 0; i < self.rubros_seleccionados_origen.length; i++) {
        for (var j = 0; j < self.rubros_seleccionados_origen[i].seleccionado.length; j++) {
          for (var k = 0; k < self.dependencia.length; k++) {
            if (self.rubros_seleccionados_origen[i].seleccionado[j].Dependencia == self.dependencia[k].Id) {
              self.rubros_seleccionados_origen[i].seleccionado[j].NomDependencia = self.dependencia[k].Nombre;
            }
          }
          self.totalMontoOrigen = self.totalMontoOrigen + parseInt(self.rubros_seleccionados_origen[i].seleccionado[j].Valor);
        }
      }
      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
          for (var k = 0; k < self.dependencia.length; k++) {
            if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == self.dependencia[k].Id) {
              self.rubros_seleccionados[i].seleccionado[j].NomDependencia = self.dependencia[k].Nombre;
            }
          }
          self.totalMontoDestino = self.totalMontoDestino + parseInt(self.rubros_seleccionados[i].seleccionado[j].Valor);
        }
      }
      self.valorTotal=self.valor_total1-self.totalMontoOrigen;
      self.valorTotal1=self.valor_total+self.totalMontoDestino;

      if (self.totalMontoOrigen == self.nueva_fuente_apropiacion.Monto && self.totalMontoDestino == self.totalMontoOrigen) {
        return true;
      } else {
        return false;
      }
    };


    self.comprobar_traslado = function() {

      self.registrar = true;

      if (self.modificar_fuente == null) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_FUENTE_FINANCIAMIENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.Monto == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_TOTAL'), "error");
      } else if (self.rubros_seleccionados.length == 0) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_RUBROS_FUENTE'), "error");
      } else {

        for (var i = 0; i < self.rubros_seleccionados_origen.length; i++) {
          for (var j = 0; j < self.rubros_seleccionados_origen[i].seleccionado.length; j++) {
            if (self.rubros_seleccionados_origen[i].seleccionado[j].Valor == 0) {
              swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_DEPENDENCIA'), "error");
              self.registrar = false;
            }
          }
        }

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
          if (self.montoAsignadoOrigen()) {
            $("#myModal1").modal();
          } else {
            swal($translate.instant('ERROR'), $translate.instant('MONTO_MAYOR_FUENTE_FINANCIAMIENTO'), "error");
          }
        }
      }
      for (var i = 0; i < self.fuente_financiamiento.length; i++) {
        if (self.fuente_financiamiento[i].Id == self.modificar_fuente) {
          self.Codigo = self.fuente_financiamiento[i].Codigo;
          self.Nombre = self.fuente_financiamiento[i].Nombre;
          self.Descripcion = self.fuente_financiamiento[i].Descripcion;
        }
        if (self.fuente_financiamiento[i].Id == self.fuente_origen) {
          self.Codigo1 = self.fuente_financiamiento[i].Codigo;
          self.Nombre1 = self.fuente_financiamiento[i].Nombre;
          self.Descripcion1 = self.fuente_financiamiento[i].Descripcion;
        }
      }

    };

    self.nueva_fuente_apropiacion = {};

    self.comprobar_fuente = function(){

      self.registrar = true;

      if (self.modificar_fuente == null) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_FUENTE_FINANCIAMIENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.Monto == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_TOTAL'), "error");
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
      for (var i = 0; i < self.fuente_financiamiento.length; i++) {
        if (self.fuente_financiamiento[i].Id == self.modificar_fuente) {
          self.Codigo = self.fuente_financiamiento[i].Codigo;
          self.Nombre = self.fuente_financiamiento[i].Nombre;
          self.Descripcion = self.fuente_financiamiento[i].Descripcion;

        }
      }
    };


    self.cerrar_ventana = function() {
      $("#myModal").modal('hide');
      $("#myModal1").modal('hide');
    };

    self.crear_fuente = function() {
      self.cerrar_ventana();
      for (var i = 0; i < self.fuente_financiamiento.length; i++) {
        if (self.fuente_financiamiento[i].Id == self.modificar_fuente) {
          self.asignar_rubros(self.fuente_financiamiento[i].Id);
        }
        if(self.fuente_origen){
          if (self.fuente_financiamiento[i].Id == self.fuente_origen) {
            self.asignar_rubros_origen(self.fuente_financiamiento[i].Id);
          }
        }
      }
      swal($translate.instant('PROCESO_COMPLETADO'), $translate.instant('REGISTRO_CORRECTO'), "success").then(function() {
        $window.location.href = '#/fuente_financiacion/consulta_fuente';
      });
    };


    self.asignar_rubros = function(id) {

      for (var i = 0; i < self.rubros_seleccionados.length; i++) {
        for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
          self.crear_fuente_apropiacion(id, self.rubros_seleccionados[i].seleccionado[j].Apropiacion, self.rubros_seleccionados[i].seleccionado[j].Dependencia, self.rubros_seleccionados[i].seleccionado[j].Valor);
        }
      }
    };

    self.asignar_rubros_origen = function(id) {

      for (var i = 0; i < self.rubros_seleccionados_origen.length; i++) {
        for (var j = 0; j < self.rubros_seleccionados_origen[i].seleccionado.length; j++) {
          self.crear_fuente_apropiacion(id, self.rubros_seleccionados_origen[i].seleccionado[j].Apropiacion, self.rubros_seleccionados_origen[i].seleccionado[j].Dependencia, -1*(self.rubros_seleccionados_origen[i].seleccionado[j].Valor));
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
        self.fuente_financiamiento_apropiacion = response.data;
        console.log(response.data);
        self.id = response.data.Id;
        self.crear_Movimiento_apropiacion(self.id, valor, self.tipo_fuente);
        console.log('resul: ' + self.id);
      });

    };

    self.crear_Movimiento_apropiacion = function(apropiacion, valor, tipo) {

      var data = {
        Valor: parseInt(valor),
        Fecha: self.fecha,
        Descripcion: self.nueva_fuente_apropiacion.Descripcion,
        TipoMovimiento: {
          Id: parseInt(tipo)
        },
        FuenteFinanciamientoApropiacion: {
          Id: parseInt(apropiacion)
        }
      }

      financieraRequest.post("movimiento_fuente_financiamiento_apropiacion", data).then(function(response) {
        self.movimiento_fuente_financiamiento_apropiacion = response.data;
        console.log(response.data);
      });
    };

    self.actualizar = function() {
      $timeout(function() {
        $('.selectpicker').selectpicker('refresh');
      });
      console.log("si")
    };

    self.actualizar();


  });
