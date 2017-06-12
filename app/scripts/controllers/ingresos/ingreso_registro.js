'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoRegistroCtrl
 * @description
 * # IngresosIngresoRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosIngresoRegistroCtrl', function($scope,financieraRequest,pagosRequest,$translate) {
    var self = this;
    //prueba de codigos de facultad
    self.codigo_facultad = [
      {
        COD_FAC: 24,
        FACULTAD: 'FACULTAD DE CIENCIAS Y EDUCACION'
      },
      {
        COD_FAC: 20,
        FACULTAD: 'FACULTAD DE INGENIERIA'
      }
    ];
    self.cargandoDatosPagos = false;
    self.concepto = [];
    self.gridOptions = {
      enableHorizontalScrollbar:0,
      enableVerticalScrollbar:1,
      paginationPageSizes: [5, 10, 15],
      paginationPageSize: 5,
      useExternalPagination: false,
      enableFiltering: true,
      rowHeight: 45
    };
    self.gridOptions.columnDefs = [
      { name: 'VIGENCIA', displayName: 'Vigencia', headerCellClass: 'text-info'  },
      { name: 'IDENTIFICACION', displayName: 'Identificación', headerCellClass: 'text-info'  },
      { name: 'NOMBRE', displayName: 'Nombre' ,  headerCellClass: 'text-info'},
      //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
      { name: 'NUMERO_CUENTA', displayName: 'N° Cuenta' , headerCellClass: 'text-info' },
      { name: 'TIPO_RECIBO', displayName: 'Tipo Recibo' , headerCellClass: 'text-info' },
      { name: 'PAGO_REPORTADO', displayName: 'Pago Reportado' , headerCellClass: 'text-info',cellFilter: 'currency'},
      { name: 'MATRICULA', displayName: 'Pago Matricula' , headerCellClass: 'text-info',cellFilter: 'currency'},
      { name: 'SEGURO', displayName: 'Pago Seguro' , headerCellClass: 'text-info',cellFilter: 'currency'},
      { name: 'CARNET', displayName: 'Pago Carnet' , headerCellClass: 'text-info',cellFilter: 'currency'}
    ];




    self.ingreso = {};
    self.cargarTiposIngreso = function(){
      financieraRequest.get('forma_ingreso', $.param({
        limit: -1
      })).then(function(response) {
        self.tiposIngreso = response.data;
      });
    };

    self.cargarUnidadesEjecutoras = function(){
      financieraRequest.get('unidad_ejecutora', $.param({
        limit: -1
      })).then(function(response) {
        self.unidadesejecutoras = response.data;
      });
    };



    self.registrarIngreso = function(){
      if(self.unidadejecutora == null){
        swal("", "Debe seleccionar la unidad ejecutora", "error");
      }else if (self.concepto == null){
        swal("", "Debe seleccionar el concepto que afecta este ingreso", "error");
      }else{
        self.ingreso = {};
        self.ingreso.Ingreso = {};
        self.ingreso.Ingreso.FormaIngreso = self.tipoIngresoSelec;
        self.ingreso.Ingreso.FechaConsignacion = self.fechaConsignacion;
        self.ingreso.Ingreso.Observaciones = self.observaciones;
        self.ingreso.Ingreso.UnidadEjecutora = self.unidadejecutora;
        self.ingreso.IngresoBanco = self.totalIngresos;//sumatoria no individual ******
        self.ingreso.Concepto = self.concepto[0];

        angular.forEach(self.movs, function(data){
          delete data.Id;
        });
        self.ingreso.Movimientos = self.movs;
        console.log(self.ingreso.Movimientos);
        financieraRequest.post('ingreso/CreateIngresos', self.ingreso).then(function(response){
            console.log(response.data);
            if (response.data.Type !== undefined){
              if (response.data.Type === "error"){
                swal('',$translate.instant(response.data.Code),response.data.Type);
              }else{
                swal('',$translate.instant(response.data.Code)+response.data.Body.Consecutivo,response.data.Type);
              }

            }
        }).finally(function(){
          self.pagos = undefined;
          self.tipoIngresoSelec = undefined;
          self.observaciones = undefined;
          self.unidadejecutora = undefined;
          self.concepto = undefined;
        });
      }


    };

    self.calcularTotalIngresos = function(){
      self.totalIngresos = 0;
      if (self.gridOptions.data != null){
        angular.forEach(self.gridOptions.data ,function(data){
          var valor = parseFloat(data.PAGO_REPORTADO)
          self.totalIngresos = self.totalIngresos + valor;
        });
      }else{

      }
    };


    self.consultarPagos= function(){
      if (self.tipoIngresoSelec == null){
        swal("", "Debe seleccionar la forma de ingreso", "error");
      }else if (self.fechaConsignacion == null){
        swal("", "Debe seleccionar la fecha de consulta  de los ingresos", "error");
      }else {
        var parametros = {
          'dia': self.fechaConsignacion.getDate(),
          'mes': self.fechaConsignacion.getMonth()+1,
          'anio': self.fechaConsignacion.getFullYear(),
          'rango_ini': self.rango_inicial,
          'rango_fin': self.rango_fin,
          'facultad' : self.facultadSelec.COD_FAC,
          'concepto' : self.tipoIngresoSelec.Nombre

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
              /*angular.forEach(self.pagos,function(data){
                data.VALOR = 100;
              });*/
              self.gridOptions.data = self.pagos;

            }
          }else{

          }

        }).finally(function() {
          // called no matter success or failure
          self.cargandoDatosPagos = false;
    });
      }


    }

    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
          $scope.ingresoBanco = self.gridApi.selection.getSelectedRows();
          self.calcularTotalIngresos();
          console.log($scope.ingresoBanco);
        });
        gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
          $scope.ingresoBanco = self.gridApi.selection.getSelectedRows();
          self.calcularTotalIngresos();
          console.log($scope.ingresoBanco);
      });
    };


    $scope.$watch('ingresoRegistro.concepto',function(){
      console.log("cambio");
      self.calcularTotalIngresos();
    },true);


    $scope.$watch('[ingresoRegistro.gridOptions.paginationPageSize,ingresoRegistro.gridOptions.data]', function(){
      console.log("af"+self.gridOptions.data.length);
          if ((self.gridOptions.data.length<=self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize== null) && self.gridOptions.data.length>0) {
            $scope.gridHeight = self.gridOptions.rowHeight * 3+ (self.gridOptions.data.length * self.gridOptions.rowHeight);
            if (self.gridOptions.data.length<=6) {
              $scope.gridHeight = self.gridOptions.rowHeight * 2+ (self.gridOptions.data.length * self.gridOptions.rowHeight);
              self.gridOptions.enablePaginationControls= false;

            }
          } else {
            $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
            self.gridOptions.enablePaginationControls= true;
          }
        },true);




  });
