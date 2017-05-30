'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoConsultaCtrl
 * @description
 * # IngresosIngresoConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosIngresoConsultaCtrl', function(financieraRequest, pagosRequest, $scope) {
    var self = this;
    self.ingresoSel = null;


    self.gridOptions_ingresosbanco = {
      enableRowSelection: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 1,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: false,
      enableFiltering: true,
      rowHeight: 45
    };
    self.gridOptions_ingresosbanco.columnDefs = [{
        name: 'VIGENCIA',
        displayName: 'Vigencia',
        headerCellClass: 'text-info'
      },
      {
        name: 'IDENTIFICACION',
        displayName: 'Identificación',
        headerCellClass: 'text-info'
      },
      {
        name: 'NOMBRE',
        displayName: 'Nombre',
        headerCellClass: 'text-info'
      },
      //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
      {
        name: 'NUMERO_CUENTA',
        displayName: 'N° Cuenta',
        headerCellClass: 'text-info'
      },
      {
        name: 'TIPO_INGRESO',
        displayName: 'Ingreso',
        headerCellClass: 'text-info'
      },
      {
        name: 'VALOR',
        displayName: 'Valor',
        headerCellClass: 'text-info'
      }
    ];


    self.gridOptions = {
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 1,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: false,
      enableFiltering: true,
      rowHeight: 45
    };
    self.gridOptions.columnDefs = [{
        name: 'Vigencia',
        displayName: 'Vigencia',
        headerCellClass: 'text-info'
      },
      {
        name: 'Consecutivo',
        displayName: 'Consecutivo',
        headerCellClass: 'text-info'
      },
      {
        name: 'FechaIngreso',
        displayName: 'Fecha de Ingreso',
        headerCellClass: 'text-info',
        cellTemplate: '<span>{{row.entity.FechaIngreso | date:"yyyy-MM-dd":"+0900"}}</span>'
      },
      {
        name: 'FechaConsignacion',
        displayName: 'Fecha de consignación',
        headerCellClass: 'text-info',
        cellTemplate: '<span>{{row.entity.FechaConsignacion | date:"yyyy-MM-dd":"+0900"}}</span>'
      },
      {
        name: 'FormaIngreso.Nombre',
        displayName: 'Forma de Ingreso',
        headerCellClass: 'text-info'
      },
      {
        name: 'EstadoIngreso.Nombre',
        displayName: 'Estado',
        headerCellClass: 'text-info'
      },
      {
        name: 'Opciones',
        cellTemplate: ' <a type="button" class="fa fa-eye" ng-click="grid.appScope.ingresoConsulta.verIngreso(row)" ></a>',
        headerCellClass: 'text-info'
      }
    ];


    self.consultarPagos = function(date) {
      var parseDate = new Date(self.ingresoSel.FechaConsignacion);
      console.log(parseDate.getDate());
      var parametros = {
        'dia': parseDate.getDate() + 1,
        'mes': parseDate.getMonth() + 1,
        'anio': parseDate.getFullYear(),
        'rango_ini': self.rango_inicial,
        'rango_fin': self.rango_fin

      };
      self.rta = null;
      self.pagos = null;
      self.cargandoDatosPagos = true;
      pagosRequest.get(parametros).then(function(response) {
        console.log(response.data);
        if (response != null) {
          if (typeof response === "string") {

            console.log(response);
            self.rta = response;
          } else {

            self.pagos = response;
            angular.forEach(self.pagos, function(data) {
              data.VALOR = 100;
            });
            self.gridOptions_ingresosbanco.data = self.pagos;

          }
        } else {

        }

      }).finally(function() {
        // called no matter success or failure
        self.cargandoDatosPagos = false;
      });



    }




    self.cargarIngresos = function() {
      financieraRequest.get('ingreso', $.param({
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
        console.log(response.data);
      });
    };

    self.cargarIngresos();

    self.verIngreso = function(row) {
      self.ingresoSel = null;
      self.ingresoSel = row.entity;
      self.consultarPagos();
      $("#myModal").modal();
      console.log(self.ingresoSel);
    };




    $scope.$watch('[ingresoConsulta.gridOptions_ingresosbanco.paginationPageSize,ingresoConsulta.gridOptions_ingresosbanco.data]', function() {

      if ((self.gridOptions_ingresosbanco.data.length <= self.gridOptions_ingresosbanco.paginationPageSize || self.gridOptions_ingresosbanco.paginationPageSize == null) && self.gridOptions_ingresosbanco.data.length > 0) {
        $scope.gridHeight = self.gridOptions_ingresosbanco.rowHeight * 3 + (self.gridOptions_ingresosbanco.data.length * self.gridOptions_ingresosbanco.rowHeight);
        if (self.gridOptions_ingresosbanco.data.length <= 6) {
          $scope.gridHeight = self.gridOptions_ingresosbanco.rowHeight * 2 + (self.gridOptions_ingresosbanco.data.length * self.gridOptions_ingresosbanco.rowHeight);
          self.gridOptions_ingresosbanco.enablePaginationControls = false;

        }
      } else {
        $scope.gridHeight = self.gridOptions_ingresosbanco.rowHeight * 3 + (self.gridOptions_ingresosbanco.paginationPageSize * self.gridOptions_ingresosbanco.rowHeight);
        self.gridOptions_ingresosbanco.enablePaginationControls = true;
      }
    }, true);


  });
