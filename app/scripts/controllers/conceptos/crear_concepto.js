'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CrearConceptoCtrl
 * @description
 * # CrearConceptoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CrearConceptoCtrl', function(financieraRequest, $scope, $http) {
    var self = this;
    self.padre = {};
    self.rubro = {};
    self.cuentas=[];
    financieraRequest.get("tipo_concepto", "").then(function(response) {
      self.tipos_concepto = response.data;
    });
    financieraRequest.get("tipo_afectacion", "").then(function(response) {
      self.tipos_afectacion = response.data;
    });

    self.cargar_plan_maestro = function(){
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };
    self.cargar_plan_maestro();

    self.agregar_cuentas=function(){
      if (self.cuentas.indexOf(self.cuenta_contable) < 0 && self.cuenta_contable!=undefined) {
        self.cuentas.push(self.cuenta_contable);
        self.cuenta_contable=undefined;
      }
    };

    $scope.$watch('crearConcepto.cuenta_contable',function(){
      self.agregar_cuentas();
    },true);

    self.quitar_cuentas=function(i){
      self.cuentas.splice(i,1);
    };

    self.crear_concepto_nuevo = function(form) {

      var nc = confirm("Desea Agregar el nuevo concepto?");
      if (nc) {

        if (self.padre.Codigo != undefined) {
          self.nuevo_concepto.Codigo = self.padre.Codigo.concat("-", self.nuevo_concepto.Codigo);
        }

        self.nuevo_concepto.FechaCreacion = new Date();
        self.nuevo_concepto.TipoConcepto = self.tipo_concepto;
        self.nuevo_concepto.Cabeza = false;
        self.nuevo_concepto.Rubro=self.rubro;

        self.afectacion_concepto = {};
        var conceptotemp = {
          Id: 0
        };
        self.afectaciones = [];
        for (var i = 0; i < self.tipos_afectacion.length; i++) {
          self.afectacion_concepto.Concepto = conceptotemp;
          self.afectacion_concepto.TipoAfectacion = self.tipos_afectacion[i];
          self.afectacion_concepto.AfectacionIngreso = self.tipos_afectacion[i].Ingreso;
          self.afectacion_concepto.AfectacionEgreso = self.tipos_afectacion[i].Egreso;
          self.afectaciones.push(self.afectacion_concepto);
          self.afectacion_concepto = {};
        }

        self.tr_concepto = {
          Concepto: self.nuevo_concepto,
          ConceptoPadre: self.padre,
          Afectaciones: self.afectaciones
          //Cuentas: self.cuentas
        };




        financieraRequest.post('tr_concepto', self.tr_concepto).then(function(response) {
          alert("concepto creado");
          self.recargar = !self.recargar;
        });
        //console.log(self.tr_concepto);
        //financieraRequest.post()
      }

    };



    self.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: false,
      enableSorting: true,
      treeRowHeaderAlwaysVisible: false,
      showTreeExpandNoChildren: true,
      rowEditWaitInterval: -1,
      enableHorizontalScrollbar: 0,
      columnDefs: [
        {
          headerCellClass:'text-success',
          field: 'Codigo',
          cellTooltip: function(row, col) {
            return row.entity.Codigo;
          },
          width: '30%'
        },
        {
          headerCellClass:'text-success',
          field: 'Descripcion',
          cellTooltip: function(row, col) {
            return row.entity.Descripcion;
          },
          width: '70%'
        }
      ]

    };

    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
    self.gridOptions.noUnselect = true;
    self.gridOptions.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(){
       self.rubro =  $scope.gridApi.selection.getSelectedRows()[0]
       console.log(self.rubro);
     });
    };


    financieraRequest.get('rubro',$.param({
      limit:0
    })).then(function(response) {
      self.gridOptions.data = response.data;
    });


    self.resetear = function(form) {
      var r = confirm("Desea Limpiar el Formulario?");
      if (r) {
        form.$setPristine();
        form.$setUntouched();
        self.nuevo_concepto = {};
        self.padre = {};
        self.tipo_concepto = {};
        if (self.dividir) {
          self.dividir = false;
        }
        self.verFormTipo = !self.verFormTipo;
        for (var i = 0; i < self.tipos_afectacion.length; i++) {
          self.tipos_afectacion[i].Egreso = false;
          self.tipos_afectacion[i].Ingreso = false;
        }
      }
    };

  });
