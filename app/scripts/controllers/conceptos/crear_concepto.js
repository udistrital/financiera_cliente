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
  .controller('CrearConceptoCtrl', function(financieraRequest, $scope, $translate, $location, $route) {

    var self = this;
    //self.rubro = {};
    self.cuentas = [];
    self.info_rubros = false;
    self.info_cuentas = false;
    self.info_afectacion = false;
    self.info_basico = false;
    self.cargando = true;
    self.hayData = true;
    $scope.formulario = {};

  //  self.info_OP = false;

    $scope.btnagregar=$translate.instant('BTN.AGREGAR');

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
          swal("", $translate.instant('SELECCIONE_CUENTAS_HIJOS'), "warning");
          self.cuenta_contable = undefined;
        }
      }
    };

    self.quitar_cuentas = function(i) {
      self.cuentas.splice(i, 1);
    };

    self.validateFields= function(){


      var respuesta;
      var hay_afectacion = false;
      self.MensajesAlerta = '';

      if($scope.formulario.conceptoForm === undefined){
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('ALERTA_COMPLETAR_DATOS') + "</li>";
      }else{

        if($scope.formulario.conceptoForm.$invalid){

          self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('ALERTA_COMPLETAR_DATOS') + "</li>";
          angular.forEach($scope.formulario.conceptoForm.$error,function(controles,error){
            angular.forEach(controles,function(control){
              control.$setDirty();
            });
          });

        }
      }
      if(self.padre === undefined){
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('SELECCIONE_CARPETA_CONCEPTO') + "</li>";

      }

      if($scope.isconcepto){
      for (var i = 0; i < self.tipos_afectacion.length; i++) {
        if(self.tipos_afectacion[i].Ingreso || self.tipos_afectacion[i].Egreso){
          hay_afectacion = true;
        }
      }

      if(hay_afectacion === false){
        self.MensajesAlerta = self.MensajesAlerta + "<li>" +$translate.instant('SELECCIONE_AFECTACION')+ "</li>";

      }

      if(self.rubro === undefined){
        self.MensajesAlerta = self.MensajesAlerta + "<li>" +$translate.instant('SELECCIONAR_RUBRO')+ "</li>";
      }


      if(self.cuentas.length === 0){
          self.MensajesAlerta = self.MensajesAlerta + "<li>" +$translate.instant('SELECCIONE_CUENTAS')+ "</li>";

    }
  }
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        respuesta =  true;
      } else {
          swal("",self.MensajesAlerta, "error");
        respuesta =  false;
      }
      return respuesta;

    }

    self.crear_concepto_nuevo = function() {

      var validar_campos =self.validateFields();
      if(validar_campos != false){
        swal({
          title: '¡'+$translate.instant('NUEVO_CONCEPTO')+'!',
          text: $translate.instant('DESEA_CREAR_CONCEPTO'),
          type: 'info',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
          cancelButtonText: $translate.instant('BTN.CANCELAR'),
          buttonsStyling: false
        }).then(function() {
          var nuevo_concepto = {
            Codigo: self.padre.Codigo.concat("-", self.nuevo_concepto.Codigo),
            FechaCreacion: new Date(),
            TipoConcepto: self.tipo_concepto,
            Nombre: self.nuevo_concepto.Nombre,
            Descripcion: self.nuevo_concepto.Descripcion,
            Clasificador: !($scope.isconcepto)
          }
          var afectacion_concepto = {};
          var afectaciones = [];
          var cuentas = null;

          if ($scope.isconcepto) {
            cuentas = angular.copy(self.cuentas);
            nuevo_concepto.Rubro = self.rubro;

            for (var i = 0; i < self.tipos_afectacion.length; i++) {
              afectacion_concepto.Concepto = {
                Id: 0
              };

              afectacion_concepto.TipoAfectacion = self.tipos_afectacion[i];
              afectacion_concepto.AfectacionIngreso = self.tipos_afectacion[i].Ingreso;
              afectacion_concepto.AfectacionEgreso = self.tipos_afectacion[i].Egreso;
              afectaciones.push(afectacion_concepto);
              afectacion_concepto = {};
            }
          } else {
            afectaciones = null;
          }
          var tr_concepto = {
            Concepto: nuevo_concepto,
            ConceptoPadre: self.padre,
            Afectaciones: afectaciones,
            Cuentas: cuentas
          };
          console.log("concepto enviado ",tr_concepto);
          /*financieraRequest.post('tr_concepto', tr_concepto).then(function(response) {
            if (response.data.Type == 'success') {
              swal($translate.instant(response.data.Code), $translate.instant("CONCEPTO") + " " + response.data.Body, response.data.Type);
              self.recargar = !self.recargar;
              self.resetear();
              $location.path('/conceptos/listado_conceptos');
              $route.reload();

            } else {
              swal("", $translate.instant(response.data.Code), response.data.Type);
            }

          });*/

        });


      }
    };

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableSorting: true,
      columnDefs: [{
          displayName: $translate.instant('CODIGO'),
          field: 'Codigo',
          cellTooltip: function(row) {
            return row.entity.Codigo;
          },
          width: '30%',
          headerCellClass: 'encabezado',
          cellClass: 'input_center',
        },
        {
          displayName: $translate.instant('NOMBRE'),
          field: 'Nombre',
          cellTooltip: function(row) {
            return row.entity.Nombre;
          },
          width: '70%',
          headerCellClass: 'encabezado',
          cellClass: 'input_center',
        }
      ]
    };

    self.gridOptions.multiSelect = false;
    //self.gridOptions.noUnselect = true;

    self.gridOptions.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.rubro = $scope.gridApi.selection.getSelectedRows()[0];
      });
    };

    self.resetear = function() {
      self.nuevo_concepto = {};
      self.cuentas = [];
      self.padre = undefined;
      self.rubro = undefined;
      for (var i = 0; i < self.tipos_afectacion.length; i++) {
        self.tipos_afectacion[i].Egreso = false;
        self.tipos_afectacion[i].Ingreso = false;
      }
      $scope.gridApi.selection.clearSelectedRows();
      $scope.formulario.conceptoForm.$setPristine();
      $scope.formulario.conceptoForm.$setUntouched();
      $scope.submitted=false
    };

    self.mostrar_rubros = function(){


      self.info_rubros = !self.info_rubros;
      self.info_cuentas = false;
      self.info_afectacion = false;
      self.info_basico = false;


  };

    self.mostrar_cuentas_contables = function(){

      self.info_cuentas = !self.info_cuentas;
      self.info_rubros = false;
      self.info_afectacion = false;
      self.info_basico = false;

    };

    self.mostrar_afectacion_contable = function(){

      self.info_afectacion = !self.info_afectacion;
      self.info_rubros = false;
      self.info_cuentas = false;
      self.info_basico = false;
    };

    self.mostrar_datos_basicos = function(){

      self.info_basico = !self.info_basico;
      self.info_rubros = false;
      self.info_cuentas = false;
      self.info_afectacion = false;
    };



    financieraRequest.get("tipo_concepto", "").then(function(response) {
      self.tipos_concepto = response.data;
      self.tipo_concepto = self.tipos_concepto[0];
    });

    financieraRequest.get("tipo_afectacion", "").then(function(response) {
      self.tipos_afectacion = response.data;
    });

    //  self.info_OP = false;
    financieraRequest.get('rubro', $.param({
      limit: -1
    })).then(function(response) {
      if (response.data === null) {
          self.hayData = false;
          self.cargando = false;
          self.gridOptions.data = [];
      } else {
          self.hayData = true;
          self.cargando = false;
          self.gridOptions.data = response.data;
        }
    });

    self.cargar_plan_maestro();

    $scope.$watch('crearConcepto.tipo_concepto', function() {
      if(self.tipo_concepto !== undefined){
        $scope.filtro_padre = self.tipo_concepto.Nombre;
        self.padre = undefined;
        $scope.nodo = undefined;
      }
    }, true);

    $scope.$watch('crearConcepto.cuenta_contable', function() {
      self.agregar_cuentas();
    }, true);

  });
