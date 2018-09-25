'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionCrearFuenteCtrl
 * @description
 * # FuenteFinanciacionCrearFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('crearFuenteCtrl', function($scope, financieraRequest, $translate, oikosRequest, coreRequest, $timeout, $window) {

    var self = this;
    var i;
    var j;
    var k;

    financieraRequest.get("orden_pago/FechaActual/2006")
      .then(function(response) {
        self.year = parseInt(response.data);
        self.datos_vigencia();
      });

      self.fecha = new Date();
      //self.year = self.fecha.getFullYear();

    financieraRequest.get("fuente_financiamiento", 'limit=-1&sortby=descripcion&order=asc').then(function(response) {
      self.fuente_financiamiento = response.data;
    });

    financieraRequest.get("fuente_financiamiento_apropiacion", 'limit=-1').then(function(response) {
      self.fuente_financiamiento_apropiacion = response.data;
    });

    self.datos_vigencia = function(){

    financieraRequest.get("movimiento_fuente_financiamiento_apropiacion", 'limit=-1&query=Fecha__startswith:' + parseInt(self.year)).then(function(response) {
      self.movimiento_fuente_financiamiento_apropiacion = response.data;
      self.fuente_financiamiento = [];
      if (self.movimiento_fuente_financiamiento_apropiacion) {
        for (i = 0; i < self.movimiento_fuente_financiamiento_apropiacion.length; i++) {
          self.repetido = false;
          for (j = 0; j < self.fuente_financiamiento.length; j++) {
            if (self.movimiento_fuente_financiamiento_apropiacion[i].FuenteFinanciamientoApropiacion.FuenteFinanciamiento.Id == self.fuente_financiamiento[j].Id) {
              self.repetido = true;
            }
          }
          if (!self.repetido) {
            self.fuente_financiamiento.push(self.movimiento_fuente_financiamiento_apropiacion[i].FuenteFinanciamientoApropiacion.FuenteFinanciamiento);
          }
        }
      }
    });


  };



    oikosRequest.get("dependencia", 'limit=-1&sortby=nombre&order=asc').then(function(response) {
      self.dependencia = response.data;
    });

    coreRequest.get("tipo_documento", 'limit=-1').then(function(response) {
      self.tipo_documento = response.data;
    });

    financieraRequest.get("tipo_movimiento", 'limit=-1').then(function(response) {
      self.tipo = response.data;

      for (i = 0; i < self.tipo.length; i++) {
        if (self.tipo[i].Nombre == "Registro") {
          self.tipo_movimiento = self.tipo[i].Id;
        }
      }
    });

    financieraRequest.get("tipo_fuente_financiamiento", 'limit=-1').then(function(response) {
      self.tipo_fuente_financiamiento = response.data;
    });

    self.nueva_fuente = {};
    self.nueva_fuente_apropiacion = {};

    self.gridOptionsapropiacion = {
      enableSorting: true,
      enableFiltering: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 10,

      columnDefs: [{
          displayName: $translate.instant('CODIGO'),
          field: 'Rubro.Codigo',
          width: '45%'
        },
        {
          displayName: $translate.instant('RUBRO'),
          field: 'Rubro.Nombre',
          width: '55%'
        },
      ]
    };

    self.select_id = {};

    self.gridOptionsapropiacion.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        self.select_id = row.entity;
        self.comprobarRubro(row.entity.Id);
        self.actualizar();
      });
    };

    self.gridOptionsapropiacion.multiSelect = false;

    self.gridOptionsapropiacion1 = {
      enableSorting: true,
      enableFiltering: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 10,

      columnDefs: [{
          displayName: $translate.instant('CODIGO'),
          field: 'Rubro.Codigo',
          width: '45%'
        },
        {
          displayName: $translate.instant('RUBRO'),
          field: 'Rubro.Nombre',
          width: '55%'
        },
      ]
    };

    self.gridOptionsapropiacion1.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        self.select_id = row.entity;
        self.comprobarRubro(row.entity.Id);
        self.actualizar();
      });
    };

    self.gridOptionsapropiacion1.multiSelect = false;

    self.rubros_seleccionados = [];

    self.cambiar_rubro = function() {

      financieraRequest.get("apropiacion", 'limit=-1&query=Vigencia:' + parseInt(self.year) + ',rubro.codigo__startswith:3-3-001-15-01-08-0119-&sortby=rubro&order=asc').then(function(response) {
        self.apropiacion = response.data;
        self.gridOptionsapropiacion.data = response.data;
      });

      financieraRequest.get("apropiacion", 'limit=-1&query=Vigencia:' + parseInt(self.year) + ',rubro.codigo__startswith:3-1-&sortby=rubro&order=asc').then(function(response) {
        self.apropiacion1 = response.data;
        self.gridOptionsapropiacion1.data = response.data;
      });

      for (i = 0; i < self.tipo_fuente_financiamiento.length; i++) {
        if (self.tipo_fuente_r == self.tipo_fuente_financiamiento[i].Id) {
          if (self.tipo_fuente_financiamiento[i].Nombre == "Inversión") {
            self.inversion = true;
            self.funcionamiento = false;
            self.rubros_seleccionados = [];
          }
          if (self.tipo_fuente_financiamiento[i].Nombre == "Funcionamiento") {
            self.inversion = false;
            self.funcionamiento = true;
            self.rubros_seleccionados = [];
          }
        }
      }
    };

    self.totalmont = function() {
      self.totalMonto = 0;
      for (i = 0; i < self.rubros_seleccionados.length; i++) {
        if (self.rubros_seleccionados[i].ValorAsignado) {
          self.totalMonto = self.totalMonto + self.rubros_seleccionados[i].ValorAsignado;
        }
      }
      return self.totalMonto;
    };

    self.comprobarRubro = function(id) {
      var repetido = true;
      for (i = 0; i < self.rubros_seleccionados.length; i++) {
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
      for (i = 0; i < self.rubros_seleccionados.length; i++) {
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
      self.actualizar();
    };


    self.quitarRubro = function(id) {

      for (i = 0; i < self.rubros_seleccionados.length; i++) {
        if (self.rubros_seleccionados[i].Id == id) {
          self.rubros_seleccionados.splice(i, 1)
        }
      }
    };

    self.quitarDependencia = function(rubro, dep) {

      for (i = 0; i < self.rubros_seleccionados.length; i++) {
        if (self.rubros_seleccionados[i].Id == rubro) {
          for (j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
            if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == dep) {
              self.rubros_seleccionados[i].seleccionado.splice(j, 1)
            }
          }
        }
      }
    };

    self.montoAsignado = function() {
      self.comprobar_valor = true;
      self.totalMonto = 0;
      for (i = 0; i < self.rubros_seleccionados.length; i++) {
        self.total_monto_rubro = 0;
        if (self.movimiento_fuente_financiamiento_apropiacion) {
          for (var h = 0; h < self.movimiento_fuente_financiamiento_apropiacion.length; h++) {
            if (self.movimiento_fuente_financiamiento_apropiacion[h].FuenteFinanciamientoApropiacion.Apropiacion.Id == self.rubros_seleccionados[i].Id) {
              self.total_monto_rubro = self.total_monto_rubro + parseInt(self.movimiento_fuente_financiamiento_apropiacion[h].Valor);
            }
          }
        }
        for (j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
          for (k = 0; k < self.dependencia.length; k++) {
            if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == self.dependencia[k].Id) {
              self.rubros_seleccionados[i].seleccionado[j].NomDependencia = self.dependencia[k].Nombre;
            }
          }
          self.totalMonto = self.totalMonto + parseInt(self.rubros_seleccionados[i].seleccionado[j].Valor);
          self.total_monto_rubro = self.total_monto_rubro + parseInt(self.rubros_seleccionados[i].seleccionado[j].Valor);
        }
        if (self.total_monto_rubro > self.rubros_seleccionados[i].Valor) {
          self.comprobar_valor = false;
          swal($translate.instant('ERROR'), $translate.instant('RUBRO_MAYOR_APROPIACION'), "error");
        }
      }

      if (self.totalMonto != self.nueva_fuente_apropiacion.Monto) {
        self.comprobar_valor = false;
        swal($translate.instant('ERROR'), $translate.instant('MONTO_MAYOR_FUENTE_FINANCIAMIENTO'), "error");
      }
      return self.comprobar_valor;
    };

    self.tabla_rubros = [];
    self.generar_tabla_rubros = function() {
      self.tabla_rubros = [];
      for (i = 0; i < self.rubros_seleccionados.length; i++) {
        for (j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
          var data;
          if (j == 0) {
            data = {
              Rubro: self.rubros_seleccionados[i].Rubro.Codigo + " : " + self.rubros_seleccionados[i].Rubro.Nombre,
              Dependencia: self.rubros_seleccionados[i].seleccionado[j].NomDependencia,
              Valor: self.rubros_seleccionados[i].seleccionado[j].Valor
            }
          } else {
            data = {
              Rubro: "",
              Dependencia: self.rubros_seleccionados[i].seleccionado[j].NomDependencia,
              Valor: self.rubros_seleccionados[i].seleccionado[j].Valor
            }
          }
          self.tabla_rubros.push(data);
        }
      }
    };

    self.comprobar_fuente = function() {

      self.registrar = true;

      
      if (self.nueva_fuente.Codigo === null || self.nueva_fuente.Codigo === "" || self.nueva_fuente.Codigo === undefined) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_CODIGO'), "error");
      } else if (self.nueva_fuente.Nombre === null || self.nueva_fuente.Nombre === "" || self.nueva_fuente.Nombre === undefined) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_NOMBRE'), "error");
      } else if (self.nueva_fuente.Descripcion === null || self.nueva_fuente.Descripcion === "" || self.nueva_fuente.Descripcion === undefined) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_DESCRIPCION'), "error");
      } else if (self.nueva_fuente_apropiacion.Monto === null || self.nueva_fuente_apropiacion.Monto === "" || self.nueva_fuente_apropiacion.Monto === undefined || self.nueva_fuente_apropiacion.Monto <= 0) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_TOTAL'), "error");
      } else if (self.nueva_fuente_apropiacion.tipo_documento === null || self.nueva_fuente_apropiacion.tipo_documento === "" || self.nueva_fuente_apropiacion.tipo_documento === undefined) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_TIPO_DOCUMENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.no_documento === null || self.nueva_fuente_apropiacion.no_documento === "" || self.nueva_fuente_apropiacion.no_documento === undefined) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_NO_DOCUMENTO'), "error");
      } else if (self.nueva_fuente_apropiacion.fecha_documento === null || self.nueva_fuente_apropiacion.fecha_documento === "" || self.nueva_fuente_apropiacion.fecha_documento === undefined) {
        swal($translate.instant('ERROR'), $translate.instant('INGRESE_FECHA_DOCUMENTO'), "error");
      } else if (self.rubros_seleccionados.length == 0) {
        swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_RUBROS_FUENTE'), "error");
      } else {

        for (i = 0; i < self.rubros_seleccionados.length; i++) {
          for (j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
            if (self.rubros_seleccionados[i].seleccionado[j].Dependencia == 0) {
              swal($translate.instant('ERROR'), $translate.instant('INGRESE_DEPENDENCIA'), "error");
              self.registrar = false;
            } else if (self.rubros_seleccionados[i].seleccionado[j].Valor == 0) {
              swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_DEPENDENCIA'), "error");
              self.registrar = false;
            }
          }
        }
        if (self.fuente_financiamiento) {
          for (i = 0; i < self.fuente_financiamiento.length; i++) {
            if (self.fuente_financiamiento[i].Codigo == self.nueva_fuente.Codigo) {
              swal($translate.instant('ERROR'), $translate.instant('FUENTE_FINANCIAMIENTO_EXISTE') + " " + $translate.instant('CODIGO') + " : " + self.fuente_financiamiento[i].Codigo + " " + $translate.instant('Nombre') + " : " + self.fuente_financiamiento[i].Nombre, "error");
              self.registrar = false;
            }
          }
        }
        if (self.registrar) {
          if (self.montoAsignado()) {
            self.generar_tabla_rubros();
            $("#myModal").modal();
          }
        }
      }
      for (i = 0; i < self.tipo_documento.length; i++) {
        if (self.tipo_documento[i].Id == self.nueva_fuente_apropiacion.tipo_documento) {
          self.nombre_tipo_documento = self.tipo_documento[i].Nombre;
        }
      }
    };

    self.cerrar_ventana = function() {
      $("#myModal").modal('hide');
    };

    self.crear_documento = function() {
      // crea documento

      self.contenido = {
        "Documento": {
          "FechaDocumento": self.nueva_fuente_apropiacion.fecha_documento,
          "NoDocumento": self.nueva_fuente_apropiacion.no_documento
        }
      };

      self.contenido_string = JSON.stringify(self.contenido);

      var data = {
        Nombre: "Registro Fuente de Financiamiento",
        Descripcion: "",
        CodigoAbreviacion: "REG-FUE",
        Activo: true,
        Contenido: self.contenido_string,
        TipoDocumento: {
          Id: parseInt(self.nueva_fuente_apropiacion.tipo_documento)
        }
      }
      coreRequest.post("documento", data).then(function(response) {
        self.id = response.data.Id;
        self.crear_fuente(self.id);
      });
    };

    self.crear_fuente = function(documento) {




      var FuenteData = {
        Codigo: self.nueva_fuente.Codigo.toString(),
        Nombre: self.nueva_fuente.Nombre,
        Descripcion: self.nueva_fuente.Descripcion,
        TipoFuenteFinanciamiento: {
          Id: parseInt(self.tipo_fuente_r)
        }

      }

      var AfectacionFuenteData = self.asignar_rubros(0, documento);
      var DataToSend = {
        FuenteFinanciamiento: FuenteData,
        AfectacionFuente: AfectacionFuenteData
      };
      console.log("Data to Send: ", DataToSend);
      financieraRequest.post("fuente_financiamiento/RegistrarFuenteFinanciamientoTr", DataToSend).then(function(response) {
        console.log("Response: ", response.data);
        if (response.data) {
              swal($translate.instant('PROCESO_COMPLETADO'), $translate.instant('REGISTRO_CORRECTO'), "success").then(function() {
                $window.location.href = '#/fuente_financiacion/consulta_fuente';
              });
            } else {
              swal($translate.instant('ERROR'), $translate.instant('E_0459'), "error");
            }
      });

      self.cerrar_ventana();
    };

    self.asignar_rubros = function(id, documento) {
      var afectacionArr = [];
      for (i = 0; i < self.rubros_seleccionados.length; i++) {
        for (j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
          afectacionArr.push(self.crear_fuente_apropiacion(id, self.rubros_seleccionados[i].seleccionado[j].Rubro, self.rubros_seleccionados[i].seleccionado[j].Dependencia, self.rubros_seleccionados[i].seleccionado[j].Valor, documento));
        }
      }
      return afectacionArr;
    };



    self.crear_fuente_apropiacion = function(fuente, rubro, dependencia, valor, documento) {

      var data = {
        Dependencia: parseInt(dependencia),
        Apropiacion: {
          Id: parseInt(rubro)
        },
        FuenteFinanciamiento: {
          Id: parseInt(fuente)
        },
        MovimientoFuenteFinanciamientoApropiacion: []
      }
      data.MovimientoFuenteFinanciamientoApropiacion.push(self.crear_Movimiento_apropiacion(0, valor, documento));
      return data;
      // financieraRequest.post("fuente_financiamiento_apropiacion", data).then(function(response) {
      //   self.fuente_financiamiento_apropiacion = response.data;
      //   self.id = response.data.Id;
      //   self.crear_Movimiento_apropiacion(self.id, valor, documento);

      // });
    };

    self.crear_Movimiento_apropiacion = function(apropiacion, valor, documento) {

      var data = {
        Valor: parseInt(valor),
        Fecha: self.fecha,
        TipoDocumento: parseInt(documento),
        TipoMovimiento: {
          Id: parseInt(self.tipo_movimiento)
        },
        FuenteFinanciamientoApropiacion: {
          Id: parseInt(apropiacion)
        }
      }
      return data;
      // financieraRequest.post("movimiento_fuente_financiamiento_apropiacion", data).then(function(response) {
      //   self.movimiento_fuente_financiamiento_apropiacion = response.data;
      //   if (response.data) {
      //     swal($translate.instant('PROCESO_COMPLETADO'), $translate.instant('REGISTRO_CORRECTO'), "success").then(function() {
      //       $window.location.href = '#/fuente_financiacion/consulta_fuente';
      //     });
      //   } else {
      //     swal($translate.instant('ERROR'), $translate.instant('E_0459'), "error");
      //   }
      // });
    };

    self.actualizar = function() {
      $timeout(function() {
        $('.selectpicker').selectpicker('refresh');
      });
    };
    self.actualizar();

  });
