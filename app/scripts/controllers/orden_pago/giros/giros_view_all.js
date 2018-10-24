'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoGirosGirosViewAllCtrl
 * @description
 * # OrdenPagoGirosGirosViewAllCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpGirosViewAllCtrl', function ($scope, financieraRequest, $window, $translate, $location, coreRequest, uiGridConstants) {
    var self = this;
    self.selectEstadoGiro = [];
    self.cargando = true;
    self.hayData = true;

    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];

    self.gridGiros = {
      showColumnFooter: false,
      enableRowSelection: false,
      enableRowHeaderSelection: false,

      paginationPageSizes: [10, 20],
      paginationPageSize: 10,

      enableFiltering: true,
      enableSelectAll: false,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      minRowsToShow: 15,
      useExternalPagination: false,

      columnDefs: [{
        field: 'Id',
        visible: false
      },
      {
        field: 'Consecutivo',
        displayName: $translate.instant('CONSECUTIVO'),
        width: '10%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado'
      },
      {
        field: 'Vigencia',
        width: '10%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('VIGENCIA'),
        enableFiltering: false,
      },
      {
        field: 'FechaRegistro',
        width: '10%',
        cellFilter: "date:'yyyy-MM-dd'",
        displayName: $translate.instant('FECHA_CREACION'),
        cellClass: 'input_center',
        headerCellClass: 'encabezado'

      },
      {
        field: 'FormaPago.CodigoAbreviacion',
        displayName: $translate.instant('FORMA_PAGO'),
        width: '10%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado'
      },
      {
        field: 'ValorTotal',
        displayName: $translate.instant('VALOR'),
        width: '10%',
        cellFilter: 'currency',
        cellClass: 'input_right',
        headerCellClass: 'encabezado'
      },
      {
        field: 'CuentaBancaria.NumeroCuenta',
        displayName: $translate.instant('CUENTA_BANCARIA'),
        width: '10%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado'
      },
      {
        field: 'Sucursal.Banco.DenominacionBanco',
        displayName: $translate.instant('BANCO'),
        width: '20%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado'
      },
      {
        field: 'GiroEstadoGiro[0].EstadoGiro.Nombre',
        width: '10%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        displayName: $translate.instant('ESTADO'),
        filter: {
          //term: 'Elaborado',
          type: uiGridConstants.filter.SELECT,
          selectOptions: self.selectEstadoGiro
        }
      },
      {
        name: $translate.instant('OPERACION'),
        enableFiltering: false,
        width: '10%',
        cellClass: 'input_center',
        headerCellClass: 'encabezado',
        cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
      },
      ]
    };
    self.gridGiros.multiSelect = true;
    self.gridGiros.enablePaginationControls = true;
    self.gridGiros.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $scope.outputopselect = self.gridApi.selection.getSelectedRows();
      });
    };
    // data GridGiros
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function (response) { //error con el success
        self.vigenciaActual = parseInt(response.data);
        var dif = self.vigenciaActual - 1995;
        var range = [];
        range.push(self.vigenciaActual);
        for (var i = 1; i < dif; i++) {
          range.push(self.vigenciaActual - i);
        }
        self.years = range;
        self.Vigencia = self.vigenciaActual;
        self.cargarListaGiro(0,'');
        financieraRequest.get('giro',
          $.param({
            query: "Vigencia:"+self.Vigencia,
            limit: -1
          })
        ).then(function (response) {

          if (response.data === null) {
            self.gridGiros.data = [];
            self.hayData = false;
            self.cargando = false;
          }
          else {
            self.hayData = true;
            self.cargando = false;
            self.gridGiros.data = response.data;
            angular.forEach(self.gridGiros.data, function (iterador) {
              coreRequest.get('sucursal',
                $.param({
                  query: "Id:" + iterador.CuentaBancaria.Sucursal,
                  limit: 1,
                })).then(function (response) {
                  iterador.Sucursal = response.data[0];
                });
            });
          }
        });
      });
    // dataFilter
    // datos Estados Giros
    financieraRequest.get("estado_giro",
      $.param({
        sortby: "NumeroOrden",
        limit: -1,
        order: "asc",
      })
    ).then(function (response) {
      angular.forEach(response.data, function (tipo) {
        self.selectEstadoGiro.push({
          value: tipo.Nombre,
          label: tipo.Nombre,
        });
      });
    });

    self.filtrarListaGiro = function(){
      self.gridGiros.data = {};
      var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
      var query = '';
      if (inicio !== undefined && fin !== undefined) {
        query = 'rangoinicio='+inicio+"&rangofin="+fin;
      }
      self.cargarListaGiro(0,"&"+query);
    };

    self.cargarListaGiro = function (offset,query) {
      if($location.search().vigencia !== undefined){
        query = '&query=';
        self.Vigencia = $location.search().vigencia;
        
      }
      
      
    }
    $scope.loadrow = function (row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
        case "ver":
          self.detalle(row);
          break;

        case "otro":

          break;
        default:
      }
    };
    // refrescar
    self.refresh = function () {
      $scope.refresh = true;
      $timeout(function () {
        $scope.refresh = false;
      }, 0);
    };
    //
    self.detalle = function (row) {
      var path = "/orden_pago/giros/ver/"
      $location.url(path + row.entity.Id)
    }
    self.editar = function (row) {
      var path = "/homologacion_concepto/actualizar/"
      $location.url(path + row.entity.Id)
    }

    //f
  });
