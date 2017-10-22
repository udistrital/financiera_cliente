'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionModificacionFuenteCtrl
 * @description
 * # FuenteFinanciacionModificacionFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('modificacionFuenteCtrl', function($window, $scope, financieraRequest, $translate, oikosRequest, coreRequest, $timeout) {

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

    financieraRequest.get("apropiacion", 'limit=-1&query=rubro.codigo__startswith:3-3-001-15-01-08-0119-&sortby=rubro&order=asc&query=vigencia:' + self.fecha).then(function(response) {
      self.apropiacion = response.data;
    });

    oikosRequest.get("dependencia", 'limit=-1').then(function(response) {
      self.dependencia = response.data;
    });

    coreRequest.get("tipo_documento", 'limit=-1').then(function(response) {
      self.tipo_documento = response.data;
    });

    financieraRequest.get("tipo_movimiento", 'limit=-1').then(function(response) {
      self.tipo = response.data;

      for (var i = 0; i < self.tipo.length; i++) {
        if (self.tipo[i].Nombre == "Registro") {
          self.tipo.splice(i, 1)
        }
      }

    });

    self.traslado = false;
    self.adicion = false;

    self.cambiar_estado = function() {

      self.traslado = false;
      self.adicion = false;
      for (var i = 0; i < self.tipo.length; i++) {
        if (self.tipo[i].Id == self.tipo_fuente) {
          if (self.tipo[i].Nombre == "Traslado") {
            self.traslado = true;
          } else if (self.tipo[i].Nombre == "Adición") {
            self.adicion = true;
          }
        }
      }
      self.actualizar();
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

    self.gridOptionsfuente.multiSelect = false;

    self.gridOptionsfuente.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        self.comprobar_fuente(row.entity);
        self.actualizar();
      });
    };

    self.fuentes_seleccionadas = [];
    self.fuentes_traslado = [];

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
            self.agregar_dependencia_general(self.fuentes_seleccionadas,self.fuentes_seleccionadas[i].Id, self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Dependencia, self.valor_dependencia, self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Apropiacion.Id);
          }
        }
      }
      self.actualizar();
    };

    self.mostrar_rubros = function() {
      self.fuentes_traslado = [];
      for (var i = 0; i < self.fuente_financiamiento_apropiacion.length; i++) {
        self.codigo_rubro= self.fuente_financiamiento_apropiacion[i].Apropiacion;
        if (self.fuente_financiamiento_apropiacion[i].FuenteFinanciamiento.Id == self.adicion_fuente) {
          var repetido = false;
          for (var j = 0; j < self.fuentes_traslado.length; j++) {
            if (self.fuentes_traslado[j].Id == self.codigo_rubro.Id) {
              repetido = true;
            }
          }
          if (!repetido) {
            self.fuentes_traslado.push(self.codigo_rubro);
            self.fuentes_traslado[self.fuentes_traslado.length - 1].seleccionado = [];
          }
        }
      }
      self.valor_rubro = 0;
      self.valor_dependencia = 0;
      for (var i = 0; i < self.fuentes_traslado.length; i++) {
        for (var j = 0; j < self.movimiento_fuente_financiamiento_apropiacion.length; j++) {
          if (self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id == self.adicion_fuente && self.fuentes_traslado[i].Id == self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Apropiacion.Id) {
            self.valor_rubro = self.valor_rubro + self.movimiento_fuente_financiamiento_apropiacion[j].Valor;
            self.valor_dependencia = self.movimiento_fuente_financiamiento_apropiacion[j].Valor;
            self.agregar_dependencia_general(self.fuentes_traslado,self.fuentes_traslado[i].Id, self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Dependencia, self.valor_dependencia, self.movimiento_fuente_financiamiento_apropiacion[j].FuenteFinanciamientoApropiacion.Apropiacion.Id);
          }
        }
      }
      self.actualizar();
      console.log(self.fuentes_traslado);

    };

    self.agregar_dependencia_general = function(fuentes, id, dependencia, valor, apropiacion) {

      self.fuentes = fuentes;

      for (var i = 0; i < self.fuentes.length; i++) {
        if (self.fuentes[i].Id == id) {
          self.rep = true;
          var data = {
            Fuente: id,
            Apropiacion: self.adicion_rubro,
            ValorTotal: valor,
            Valor: 0,
            Dependencia: dependencia,
            NomDependencia: ""
          }
          for (var j = 0; j < self.fuentes[i].seleccionado.length; j++) {
            if (dependencia == self.fuentes[i].seleccionado[j].Dependencia) {
              self.rep = false;
              self.fuentes[i].seleccionado[j].ValorTotal = valor + self.fuentes[i].seleccionado[j].ValorTotal;
            }
          }
          if (self.rep) {
            self.fuentes[i].seleccionado.push(data);
          }
        }
      }
      return self.fuentes;
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
      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        if (self.fuentes_seleccionadas[i].Id == fuente) {
          for (var j = 0; j < self.fuentes_seleccionadas[i].seleccionado.length; j++) {
            if (self.fuentes_seleccionadas[i].seleccionado[j].Dependencia == dep) {
              self.fuentes_seleccionadas[i].seleccionado.splice(j, 1)
            }
          }
        }
      }
    };

    self.montoAsignado = function() {

      self.totalMonto = 0;
      self.valorTotal = 0;
      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        for (var j = 0; j < self.fuentes_seleccionadas[i].seleccionado.length; j++) {
          for (var k = 0; k < self.dependencia.length; k++) {
            if (self.fuentes_seleccionadas[i].seleccionado[j].Dependencia == self.dependencia[k].Id) {
              self.fuentes_seleccionadas[i].seleccionado[j].NomDependencia = self.dependencia[k].Nombre;
            }
          }
          self.totalMonto = self.totalMonto + parseInt(self.fuentes_seleccionadas[i].seleccionado[j].Valor);
        }
      }
      self.valorTotal = self.valor_rubro + self.totalMonto;

      if (self.totalMonto == self.nueva_fuente_apropiacion.Monto) {
        return true;
      } else {
        return false;
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

    self.nueva_fuente_apropiacion = {};
    self.registrar = true;

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
          if (self.montoAsignado()) {
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
          self.Nombre = self.apropiacion[i].Rubro.Nombre;
        }
      }
      for (var i = 0; i < self.tipo_documento.length; i++) {
        if (self.tipo_documento[i].Id==self.nueva_fuente_apropiacion.tipo_documento) {
          self.nombre_tipo_documento= self.tipo_documento[i].Nombre;
        }
      }
    };

    //traslado
    self.dependencias_origen = [];

    self.buscar_dependencia = function() {
      self.dependencias_origen = [];

      for (var i = 0; i < self.fuentes_traslado.length; i++) {
        if (self.fuentes_traslado[i].Id == self.fuente_origen) {
          for (var j = 0; j < self.fuentes_traslado[i].seleccionado.length; j++) {
            for (var k = 0; k < self.dependencia.length; k++) {
              if (self.fuentes_traslado[i].seleccionado[j].Dependencia == self.dependencia[k].Id) {
                var data = {
                  Id: self.fuentes_traslado[i].seleccionado[j].Dependencia,
                  ValorTotal: self.fuentes_traslado[i].seleccionado[j].ValorTotal,
                  Valor: self.fuentes_traslado[i].seleccionado[j].Valor,
                  Dependencia: self.fuentes_traslado[i].seleccionado[j].Dependencia,
                  Nombre: self.dependencia[k].Nombre
                }
              }
            }
            self.dependencias_origen.push(data);
          }
        }
      }
      self.actualizar();
    };

    self.buscar_valor_origen = function() {
      self.valor_origen = 0;
      for (var i = 0; i < self.dependencias_origen.length; i++) {
        if (self.dependencias_origen[i].Id == self.dependencia_origen) {
          self.valor_origen = self.dependencias_origen[i].ValorTotal;
        }
      }
    };

    self.monto_traslado = function() {

      self.total_fuente_origen = 0;
      self.total_origen = 0;
      self.total_fuente_destino = 0;
      self.total_destino = 0;

      console.log(self.fuentes_traslado)
      for (var i = 0; i < self.fuentes_traslado.length; i++) {
        for (var j = 0; j < self.fuentes_traslado[i].seleccionado.length; j++) {

          if (self.fuentes_traslado[i].Id == self.fuente_origen) {
            self.total_fuente_origen = self.total_fuente_origen + parseInt(self.fuentes_traslado[i].seleccionado[j].ValorTotal);
          }
          if (self.fuentes_traslado[i].Id == self.fuente_destino) {
            self.total_fuente_destino = self.total_fuente_destino + parseInt(self.fuentes_traslado[i].seleccionado[j].ValorTotal);
          }
          self.total_origen = self.total_fuente_origen - parseInt(self.nueva_fuente_apropiacion.Monto);
          self.total_destino = self.total_fuente_destino + parseInt(self.nueva_fuente_apropiacion.Monto);
        }
      }
    };

    self.comprobar_traslado = function() {

      if (self.adicion_fuente == null) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_FUENTE_FINANCIAMIENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.Monto == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_TRASLADO'), "error");
      } else if (self.nueva_fuente_apropiacion.Descripcion == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_DESCRIPCION'), "error");
      } else if (self.nueva_fuente_apropiacion.tipo_documento == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_TIPO_DOCUMENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.no_documento == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_NO_DOCUMENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.fecha_documento == null) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_FECHA_DOCUMENTO'), "error");
      } else if (self.fuente_origen == null) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_RUBRO_ORIGEN'), "error");
      } else if (self.fuente_destino == null) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_RUBRO_DESTINO'), "error");
      } else if (self.dependencia_origen == null) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_DEPENDENCIA_ORIGEN'), "error");
      } else if (self.dependencia_destino == null) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_DEPENDENCIA_DESTINO'), "error");
      } else {
        self.monto_traslado();
        if (self.valor_origen > self.nueva_fuente_apropiacion.Monto) {
          $("#myModal1").modal();
        } else {
          swal($translate.instant('ERROR'), $translate.instant('MONTO_MAYOR_TRASLADO'), "error");
        }
      }
      for (var i = 0; i < self.apropiacion.length; i++) {
        if (self.apropiacion[i].Id == self.fuente_origen) {
          self.Codigo = self.apropiacion[i].Rubro.Codigo;
          self.Nombre = self.apropiacion[i].Rubro.Nombre;
        }
        if (self.apropiacion[i].Id == self.fuente_destino) {
          self.Codigo1 = self.apropiacion[i].Rubro.Codigo;
          self.Nombre1 = self.apropiacion[i].Rubro.Nombre;
        }
      }
      for (var i = 0; i < self.fuente_financiamiento.length; i++) {
        if (self.fuente_financiamiento[i].Id == self.adicion_fuente) {
          self.Codigo_fuente = self.fuente_financiamiento[i].Codigo;
          self.Nombre_fuente = self.fuente_financiamiento[i].Nombre;
          self.descripcion_fuente = self.fuente_financiamiento[i].Descripcion;
        }
      }
      for (var i = 0; i < self.dependencia.length; i++) {
        if (self.dependencia[i].Id == self.dependencia_origen) {
            self.nombre_dependencia_origen = self.dependencia[i].Nombre;
        }
        if (self.dependencia[i].Id == self.dependencia_destino) {
            self.nombre_dependencia_destino = self.dependencia[i].Nombre;
        }
      }
      for (var i = 0; i < self.tipo_documento.length; i++) {
        if (self.tipo_documento[i].Id==self.nueva_fuente_apropiacion.tipo_documento) {
          self.nombre_tipo_documento= self.tipo_documento[i].Nombre;
        }
      }
    };


    self.cerrar_ventana = function() {
      $("#myModal").modal('hide');
      $("#myModal1").modal('hide');
    };


    // Registro
    self.adicionar_fuente = function() {
      self.cerrar_ventana();

        // crea documento
        var data = {
          FechaDocumento: self.nueva_fuente_apropiacion.fecha_documento,
          NoDocumento: self.nueva_fuente_apropiacion.no_documento,
          TipoDocumento: {
            Id: parseInt(self.nueva_fuente_apropiacion.tipo_documento)
          }
        }
        coreRequest.post("documento", data).then(function(response) {
          self.id = response.data.Id;
          self.asignar_rubros(self.adicion_rubro,self.id);
        });

      swal($translate.instant('PROCESO_COMPLETADO'), $translate.instant('REGISTRO_CORRECTO'), "success").then(function() {
        $window.location.href = '#/fuente_financiacion/consulta_fuente';
      });
    };


    self.asignar_rubros = function(id,documento) {

      for (var i = 0; i < self.fuentes_seleccionadas.length; i++) {
        for (var j = 0; j < self.fuentes_seleccionadas[i].seleccionado.length; j++) {
          self.crear_fuente_apropiacion(id, self.fuentes_seleccionadas[i].seleccionado[j].Fuente, self.fuentes_seleccionadas[i].seleccionado[j].Dependencia, self.fuentes_seleccionadas[i].seleccionado[j].Valor,documento);
        }
      }
    };

    self.crear_fuente_apropiacion = function(apropiacion, fuente, dependencia, valor,documento) {

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
        self.crear_Movimiento_apropiacion(self.id, valor, self.tipo_fuente,documento);
        console.log('resul: ' + self.id);
      });

    };

    self.crear_Movimiento_apropiacion = function(apropiacion, valor, tipo, documento) {

      var data = {
        Valor: parseInt(valor),
        FechaRegistro: self.fecha,
        Descripcion: self.nueva_fuente_apropiacion.Descripcion,
        TipoDocumento: parseInt(documento),
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
        self.id_movimiento.push(response.data);
        if (self.traslado && self.id_movimiento.length==2) {
           self.id_movimiento[0].MovimientoFuenteFinanciamientoApropiacion = parseInt(self.id_movimiento[1].Id);
           self.id_movimiento[1].MovimientoFuenteFinanciamientoApropiacion = parseInt(self.id_movimiento[0].Id);
           self.traslado_movimiento(self.id_movimiento[0]);
           self.traslado_movimiento(self.id_movimiento[1]);
        }
      });
    };

    // Registro
    self.id_movimiento = [];
    self.traslado_fuente = function() {
      self.cerrar_ventana();

      var data = {
        FechaDocumento: self.nueva_fuente_apropiacion.fecha_documento,
        NoDocumento: self.nueva_fuente_apropiacion.no_documento,
        TipoDocumento: {
          Id: parseInt(self.nueva_fuente_apropiacion.tipo_documento)
        }
      }
      coreRequest.post("documento", data).then(function(response) {
        self.id = response.data.Id;
        self.crear_fuente_apropiacion( self.fuente_origen, self.adicion_fuente, self.dependencia_origen, (-1 * parseInt(self.nueva_fuente_apropiacion.Monto)),self.id);
        self.crear_fuente_apropiacion( self.fuente_destino, self.adicion_fuente, self.dependencia_destino, parseInt(self.nueva_fuente_apropiacion.Monto),self.id);
      });

      swal($translate.instant('PROCESO_COMPLETADO'), $translate.instant('REGISTRO_CORRECTO'), "success").then(function() {
        $window.location.href = '#/fuente_financiacion/consulta_fuente';
      });
    };

    self.traslado_movimiento = function(movimiento) {

      financieraRequest.put("movimiento_fuente_financiamiento_apropiacion", movimiento.Id, movimiento).then(function(response) {
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
