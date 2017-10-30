'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CrearConceptoCtrl
 * @description
 * @this
 * # CrearConceptoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CrearConceptoCtrl', function(financieraRequest, $scope, $translate) {

    var self = this;
    //self.rubro = {};
    self.cuentas = [];

    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };

    self.agregar_cuentas = function() {
      if (self.cuentas.indexOf(self.cuenta_contable) < 0 && self.cuenta_contable != undefined) {
        if (self.cuenta_contable.Hijos == null) {
          //console.log(self.cuenta_contable.Codigo[0]);
          self.cuentas.push(self.cuenta_contable);
          self.cuenta_contable = undefined;
        } else {
          swal("Espera!", "Unicamente puedes seleccionar cuentas que no tengan hijos", "warning");
          self.cuenta_contable = undefined;
        }
      }
    };

    self.quitar_cuentas = function(i) {
      self.cuentas.splice(i, 1);
    };

    self.crear_concepto_nuevo = function() {

      if (self.padre != undefined) {
         if ($scope.isconcepto && (self.rubro ==undefined || self.cuentas.length < 2)) {
           swal("Espera!", (self.cuentas.length < 2?"Tienes que seleccionar por lo menos dos cuentas cuentas contables":"Es necesario seleccionar un rubro para el concepto"), "warning");
         } else{
           swal({
             title: 'Nueva Concepto!',
             text: "Deseas crear un nuevo registro?",
             type: 'info',
             showCancelButton: true,
             confirmButtonColor: '#3085d6',
             cancelButtonColor: '#d33',
             confirmButtonText: 'Aceptar',
             cancelButtonText: 'Cancelar',
           }).then(function() {
             self.nuevo_concepto.Codigo = self.padre.Codigo.concat("-", self.nuevo_concepto.Codigo);
             self.nuevo_concepto.FechaCreacion = new Date();
             self.nuevo_concepto.TipoConcepto = self.tipo_concepto;
             self.afectacion_concepto = {};
             self.afectaciones = [];
             if ($scope.isconcepto) {
               self.nuevo_concepto.Rubro = self.rubro;
               for (var i = 0; i < self.tipos_afectacion.length; i++) {
                 self.afectacion_concepto.Concepto = {Id: 0 };
                 self.afectacion_concepto.TipoAfectacion = self.tipos_afectacion[i];
                 self.afectacion_concepto.AfectacionIngreso = self.tipos_afectacion[i].Ingreso;
                 self.afectacion_concepto.AfectacionEgreso = self.tipos_afectacion[i].Egreso;
                 self.afectaciones.push(self.afectacion_concepto);
                 self.afectacion_concepto = {};
               }
             } else {
               self.afectaciones=null;
               self.cuentas=null;
             }
             var tr_concepto = {
               Concepto: self.nuevo_concepto,
               ConceptoPadre: self.padre,
               Afectaciones: self.afectaciones,
               Cuentas: self.cuentas
             };
             financieraRequest.post('tr_concepto', tr_concepto).then(function(response) {

               if (response.data.Type=='success') {
                 swal($translate.instant(response.data.Code),$translate.instant("CONCEPTO")+" "+response.data.Body, response.data.Type);
                  self.recargar = !self.recargar;
                  $("#conceptoForm").$setPristine();
                  $("#conceptoForm").$setUntouched();
                  self.resetear($("#conceptoForm"));
               } else {
                 swal("",$translate.instant(response.data.Code), response.data.Type);
               }

             });
           });

         }
      } else {
        swal("Espera!", "Tienes que ubicar el concepto en una carpeta", "error");
      }
    };

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar:0,
      useExternalPagination: false,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableSorting: true,
      treeRowHeaderAlwaysVisible: false,
      rowEditWaitInterval: -1,
      enableHorizontalScrollbar: 0,
      columnDefs: [{
          headerCellClass: 'text-success',
          field: 'Codigo',
          cellTooltip: function(row) {
            return row.entity.Codigo;
          },
          width: '30%'
        },
        {
          headerCellClass: 'text-success',
          field: 'Nombre',
          cellTooltip: function(row) {
            return row.entity.Nombre;
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
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.rubro = $scope.gridApi.selection.getSelectedRows()[0];
      });
    };

    self.resetear = function(form) {
      form.$setPristine();
      form.$setUntouched();
      self.nuevo_concepto = {};
      self.padre = undefined;
      for (var i = 0; i < self.tipos_afectacion.length; i++) {
        self.tipos_afectacion[i].Egreso = false;
        self.tipos_afectacion[i].Ingreso = false;
      }
    };

    financieraRequest.get('rubro', $.param({
      limit: -1
    })).then(function(response) {
      self.gridOptions.data = response.data;
    });

    financieraRequest.get("tipo_concepto", "").then(function(response) {
      self.tipos_concepto = response.data;
      self.tipo_concepto=self.tipos_concepto[0];
    });

    financieraRequest.get("tipo_afectacion", "").then(function(response) {
      self.tipos_afectacion = response.data;
    });

    self.cargar_plan_maestro();

    $scope.$watch('crearConcepto.tipo_concepto', function() {
      $scope.filtro_padre=self.tipo_concepto.Nombre;
      self.padre=undefined;
      $scope.nodo=undefined;
      console.log(self.padre);
    }, true);

    $scope.$watch('crearConcepto.cuenta_contable', function() {
      self.agregar_cuentas();
    }, true);

  });
