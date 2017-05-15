'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistroCtrl
 * @description
 * # IngresosIngresoRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosIngresoRegistroCtrl', function($scope,financieraRequest,pagosRequest) {
    var self = this;
    self.cargandoDatosPagos = false;
    self.gridOptions = {
      enableRowSelection: true,
      enableHorizontalScrollbar:0,
      enableVerticalScrollbar:0,
      paginationPageSizes: [10, 50, 75],
      paginationPageSize: 10,
      useExternalPagination: false,
      enableFiltering: true
    };
    self.gridOptions.columnDefs = [
      { name: 'VIGENCIA', displayName: 'Vigencia', headerCellClass: 'text-info'  },
      { name: 'IDENTIFICACION', displayName: 'Identificación', headerCellClass: 'text-info'  },
      { name: 'NOMBRE', displayName: 'Nombre' ,  headerCellClass: 'text-info'},
      //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
      { name: 'NUMERO_CUENTA', displayName: 'N° Cuenta' , headerCellClass: 'text-info' },
      { name: 'TIPO_INGRESO', displayName: 'Ingreso' , headerCellClass: 'text-info' },
    ];




    self.ingreso = {};
    self.cargarTiposIngreso = function(){
      financieraRequest.get('forma_ingreso', $.param({
        limit: -1
      })).then(function(response) {
        self.tiposIngreso = response.data;
      });
    };

    self.registrarIngreso = function(){
      self.ingreso = {};
      self.ingreso.FormaIngreso = self.tipoIngresoSelec;
      self.ingreso.FechaIngreso = self.fechaConsignacion;
      console.log("day: "+(self.ingreso.FechaIngreso.getDate()));
      console.log("month: "+(self.ingreso.FechaIngreso.getMonth()+1));
      console.log("year: "+self.ingreso.FechaIngreso.getFullYear());
    };

    self.consultarPagos= function(){
      var parametros = {
        'dia': self.fechaConsignacion.getDate(),
        'mes': self.fechaConsignacion.getMonth()+1,
        'anio': self.fechaConsignacion.getFullYear(),
        'rango_ini': self.rango_inicial,
        'rango_fin': self.rango_fin

      };
      self.rta=null;
      self.pagos=null;
      self.cargandoDatosPagos = true;
      pagosRequest.get(parametros).then(function(response){
        if(response!=null){
          if(typeof response==="string"){

            console.log(response);
            self.rta=response;
          }else{

            self.pagos=response;
            self.gridOptions.data = self.pagos;

          }
        }else{

        }

      }).finally(function() {
        // called no matter success or failure
        self.cargandoDatosPagos = false;
  });

    }

    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
          $scope.ingresoBanco = self.gridApi.selection.getSelectedRows();
          console.log($scope.ingresoBanco);
        });
    };


    $scope.$watch('[ingresoRegistro.gridOptions.paginationPageSize,ingresoRegistro.gridOptions.data]', function(){
      console.log("af"+self.gridOptions.data.length);
          if ((self.gridOptions.data.length<=self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize== null) && self.gridOptions.data.length>0) {
            $scope.gridHeight = self.gridOptions.rowHeight * 3+ (self.gridOptions.data.length * self.gridOptions.rowHeight);
            if (self.gridOptions.data.length<=10) {
              $scope.gridHeight = self.gridOptions.rowHeight * 2+ (self.gridOptions.data.length * self.gridOptions.rowHeight);
              self.gridOptions.enablePaginationControls= false;
            }
          } else {
            $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
            self.gridOptions.enablePaginationControls= true;
          }
        },true);




  });
