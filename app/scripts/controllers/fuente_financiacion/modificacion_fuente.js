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
      self.gridOptionsfuente.data = response.data;
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
          self.tipo.splice(i, 1)
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
            self.rubros_seleccionados = [];
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

    self.gridOptionsfuente = {
      enableSorting: true,
      enableFiltering: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 15,

      columnDefs: [{
          displayName: $translate.instant('CODIGO'),
          field: 'Codigo',
          width: '20%'
        },
        {
          displayName: $translate.instant('NOMBRE'),
          field: 'Nombre',
          width: '80%'
        },
      ]
    };

    self.gridOptionsapropiacion.multiSelect = false;
    self.gridOptionsfuente.multiSelect = false;

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

    self.gridOptionsfuente.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        self.select_id = row.entity;
        self.comprobar_fuente(row.entity);
        self.actualizar();
      });
    };

    self.rubros_seleccionados = [];
    self.fuentes_seleccionadas = [];

    self.comprobar_fuente = function(fuente) {
      var repetido = true;
      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        if ((self.fuentes_seleccionadas[i].Id) == fuente.Id) {
          repetido = false;
        }
      }
      if (repetido == true) {
        self.fuentes_seleccionadas.push(fuente);
        var data = {
          Apropiacion: self.adicion_rubro,
          Fuente: fuente.Id,
          ValorTotal: 0,
          Valor: 0,
          Dependencia: "",
          NomDependencia: ""
        }
        self.fuentes_seleccionadas[self.fuentes_seleccionadas.length - 1].seleccionado = [];
        self.fuentes_seleccionadas[self.fuentes_seleccionadas.length - 1].seleccionado.push(data);
      }
    };

    self.mostrar_rubros = function() {
      self.rubros_seleccionados = [];
      for (var i = 0; i < self.fuente_financiamiento_apropiacion.length; i++) {
        self.codigo_rubro = self.fuente_financiamiento_apropiacion[i].Apropiacion;
        if (self.fuente_financiamiento_apropiacion[i].FuenteFinanciamiento.Id == self.adicion_rubro) {
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
        for (var j = 0; j < self.movimiento_fuente_financiamiento_apropiacion.length; j++) {
          if (self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id == self.adicion_rubro && self.rubros_seleccionados[i].Id == self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Apropiacion.Id) {
            self.valor_total = self.valor_total + self.movimiento_fuente_financiamiento_apropiacion[j].Valor;
            self.valor_dependencia = self.movimiento_fuente_financiamiento_apropiacion[j].Valor;
            self.agregar_dependencia_general(self.rubros_seleccionados, self.rubros_seleccionados[i].Id, self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Dependencia, self.valor_dependencia, self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Apropiacion.Id);
          }
        }
      }
    };

    self.mostrar_fuentes = function() {
      self.fuentes_seleccionadas = [];
      for (var i = 0; i < self.fuente_financiamiento_apropiacion.length; i++) {
        self.codigo_fuente = self.fuente_financiamiento_apropiacion[i].FuenteFinanciamiento;
        if (self.fuente_financiamiento_apropiacion[i].Apropiacion.Id == self.adicion_rubro) {
          var repetido = false;
          for (var j = 0; j < self.fuentes_seleccionadas.length; j++) {
            if (self.fuentes_seleccionadas[j].Id == self.codigo_fuente.Id) {
              repetido = true;
            }
          }
          if (!repetido) {
            self.fuentes_seleccionadas.push(self.codigo_fuente);
            self.fuentes_seleccionadas[self.fuentes_seleccionadas.length - 1].seleccionado = [];
          }
        }
      }
      self.valor_rubro = 0;
      self.valor_dependencia = 0;
      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        for (var j = 0; j < self.movimiento_fuente_financiamiento_apropiacion.length; j++) {
          if (self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Apropiacion.Id == self.adicion_rubro && self.fuentes_seleccionadas[i].Id == self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id) {
            self.valor_rubro = self.valor_rubro + self.movimiento_fuente_financiamiento_apropiacion[j].Valor;
            self.valor_dependencia = self.movimiento_fuente_financiamiento_apropiacion[j].Valor;
            self.agregar_dependencia_general(self.fuentes_seleccionadas, self.fuentes_seleccionadas[i].Id, self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Dependencia, self.valor_dependencia, self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Apropiacion.Id);
          }
        }
      }
    };

    self.agregar_dependencia_general = function(operador, id, dependencia, valor, apropiacion) {
      self.operador = operador;
      for (var i = 0; i < self.operador.length; i++) {
        if (self.operador[i].Id == id) {
          self.rep = true;
          var data = {
            Fuente: id,
            Apropiacion: self.adicion_rubro,
            ValorTotal: valor,
            Valor: 0,
            Dependencia: dependencia,
            NomDependencia: ""
          }
          for (var j = 0; j < self.operador[i].seleccionado.length; j++) {
            if (dependencia == self.operador[i].seleccionado[j].Dependencia) {
              self.rep = false;
              self.operador[i].seleccionado[j].ValorTotal = valor + self.operador[i].seleccionado[j].ValorTotal;
            }
          }
          if (self.rep) {
            self.operador[i].seleccionado.push(data);
          }
        }
      }
      self.actualizar();
    };

    self.agregar_dep = function(id) {

      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        if (self.fuentes_seleccionadas[i].Id == id) {
          var data = {
            Apropiacion: self.adicion_rubro,
            Fuente: id,
            ValorTotal: 0,
            Valor: 0,
            Dependencia: "",
            NomDependencia: ""
          }
          self.fuentes_seleccionadas[i].seleccionado.push(data);
        }
        self.actualizar();
      }
    };

    self.quitarFuente = function(id) {
      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        if (self.fuentes_seleccionadas[i].Id == id) {
          self.fuentes_seleccionadas.splice(i, 1)
        }
      }
    };

    self.quitarDependencia = function(fuente, dep) {
      console.log(fuente, dep);
      for (var i = 0; i < self.fuentes_seleccionadas.length; i++)
        if (self.fuentes_seleccionadas[i].Id == fuente) {
          for (var j = 0; j < self.fuentes_seleccionadas[i].seleccionado.length; j++) {
            if (self.fuentes_seleccionadas[i].seleccionado[j].Dependencia == dep) {
              self.fuentes_seleccionadas[i].seleccionado.splice(j, 1)
            }
          }
        }
    };

    self.tabla_fuentes = [];

    self.generar_tabla_fuentes = function() {

      self.tabla_fuentes = [];
      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        for (var j = 0; j < self.fuentes_seleccionadas[i].seleccionado.length; j++) {
          if (j == 0) {
            var data = {
              Fuente: self.fuentes_seleccionadas[i].Codigo + " : " + self.fuentes_seleccionadas[i].Nombre,
              Dependencia: self.fuentes_seleccionadas[i].seleccionado[j].NomDependencia,
              Valor: self.fuentes_seleccionadas[i].seleccionado[j].Valor
            }
          } else {
            var data = {
              Fuente: "",
              Dependencia: self.fuentes_seleccionadas[i].seleccionado[j].NomDependencia,
              Valor: self.fuentes_seleccionadas[i].seleccionado[j].Valor
            }
          }
          self.tabla_fuentes.push(data);
        }
      }
    };

    self.registrar = true;
    self.montoAsignado = function(operador) {
      self.operador = operador;
      self.totalMonto = 0;
      self.valorTotal = 0;

      for (var i = 0; i < self.operador.length; i++) {
        for (var j = 0; j < self.operador[i].seleccionado.length; j++) {
          for (var k = 0; k < self.dependencia.length; k++) {
            if (self.operador[i].seleccionado[j].Dependencia == self.dependencia[k].Id) {
              self.operador[i].seleccionado[j].NomDependencia = self.dependencia[k].Nombre;
            }
          }
          self.totalMonto = self.totalMonto + parseInt(self.operador[i].seleccionado[j].Valor);
        }
      }
      self.valorTotal = self.valor_rubro + self.totalMonto;

      if (self.totalMonto == self.nueva_fuente_apropiacion.Monto) {
        return true;
      } else {
        return false;
      }
    };

    self.comprobar_traslado = function() {

      self.registrar = true;

      if (self.adicion_rubro == null) {
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
          if (self.montoAsignado(self.fuentes_seleccionadas)) {
            $("#myModal1").modal();
          } else {
            swal($translate.instant('ERROR'), $translate.instant('MONTO_MAYOR_FUENTE_FINANCIAMIENTO'), "error");
          }
        }
      }
      for (var i = 0; i < self.fuente_financiamiento.length; i++) {
        if (self.fuente_financiamiento[i].Id == self.adicion_rubro) {
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

    self.comprobar_adicion = function() {

      self.registrar = true;

      if (self.adicion_rubro == null) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCION_RUBRO'), "error");
      } else if (self.nueva_fuente_apropiacion.Monto == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_ADICION'), "error");
      } else if (self.nueva_fuente_apropiacion.Descripcion == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_DESCRIPCION'), "error");
      } else if (self.nueva_fuente_apropiacion.tipo_documento == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_TIPO_DOCUMENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.no_documento == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_NO_DOCUMENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.fecha_documento == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_FECHA_DOCUMENTO'), "error");
      } else if (self.fuentes_seleccionadas.length == 0) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_FUENTE_FINANCIAMIENTO'), "error");
      } else {


        for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
          for (var j = 0; j < self.fuentes_seleccionadas[i].seleccionado.length; j++) {
            if (self.fuentes_seleccionadas[i].seleccionado[j].Valor == 0) {
              swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_DEPENDENCIA'), "error");
              self.registrar = false;
            } else if (self.fuentes_seleccionadas[i].seleccionado[j].Dependencia == 0) {
              swal($translate.instant('ERROR'), $translate.instant('INGRESE_DEPENDENCIA'), "error");
              self.registrar = false;
            }
          }
        }
        if (self.registrar) {
          if (self.montoAsignado(self.fuentes_seleccionadas)) {
            self.generar_tabla_fuentes();
            $("#myModal").modal();
          } else {
            swal($translate.instant('ERROR'), $translate.instant('MONTO_MAYOR_ADICION'), "error");
          }
        }
      }
      for (var i = 0; i < self.apropiacion.length; i++) {
        if (self.apropiacion[i].Id == self.adicion_rubro) {
          self.Codigo = self.apropiacion[i].Rubro.Codigo;
          self.Nombre = self.apropiacion[i].Rubro.Descripcion;

        }
      }
    };

    self.cerrar_ventana = function() {
      $("#myModal").modal('hide');
      $("#myModal1").modal('hide');
    };

    self.crear_fuente = function() {
      self.cerrar_ventana();
      self.asignar_rubros(self.adicion_rubro);
      swal($translate.instant('PROCESO_COMPLETADO'), $translate.instant('REGISTRO_CORRECTO'), "success").then(function() {
        $window.location.href = '#/fuente_financiacion/consulta_fuente';
      });
    };


    self.asignar_rubros = function(id) {

      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        for (var j = 0; j < self.fuentes_seleccionadas[i].seleccionado.length; j++) {
          self.crear_fuente_apropiacion(id, self.fuentes_seleccionadas[i].seleccionado[j].Fuente, self.fuentes_seleccionadas[i].seleccionado[j].Dependencia, self.fuentes_seleccionadas[i].seleccionado[j].Valor);
        }
      }
    };

    self.crear_fuente_apropiacion = function(apropiacion, fuente, dependencia, valor) {

      var data = {
        Dependencia: parseInt(dependencia),
        Apropiacion: {
          Id: parseInt(apropiacion)
        },
        FuenteFinanciamiento: {
          Id: parseInt(fuente)
        }
      }

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
