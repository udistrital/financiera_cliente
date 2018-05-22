'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RubroModificacionSolicitudConsultaCtrl
 * @description
 * # RubroModificacionSolicitudConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RubroModificacionSolicitudConsultaCtrl', function (financieraRequest,$scope,$translate,$filter,$window) {
    var self = this;
    self.offset = 0;
    self.UnidadEjecutora = 1;
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true }
    ];
    self.gridOptions = {
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering : true,
      paginationPageSizes: [20, 50, 100],
      paginationPageSize: 10,
      useExternalPagination: true,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia' ,displayName: $translate.instant("VIGENCIA"), cellClass: 'input_center',headerCellClass: 'text-info' },
        {field: 'NumeroMovimiento' ,displayName: $translate.instant("NO"), cellClass: 'input_center',headerCellClass: 'text-info' },
        {field: 'FechaMovimiento',  displayName: $translate.instant("FECHA_MOVIMIENTO"), cellClass: 'input_center',headerCellClass: 'text-info' ,cellTemplate: '<span>{{row.entity.FechaMovimiento | date:"yyyy-MM-dd":"UTF"}}</span>'},
        {field: 'Noficio',  displayName: $translate.instant("NO_OFICIO"),headerCellClass: 'text-info'},
        {field: 'Foficio',  displayName: $translate.instant("FECHA_OFICIO"),headerCellClass: 'text-info',cellTemplate: '<span>{{row.entity.Foficio | date:"yyyy-MM-dd":"UTF"}}</span>'},
        {field: 'EstadoMovimientoApropiacion.Nombre',  displayName: $translate.instant("ESTADO"),headerCellClass: 'text-info'},

        {
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '6%',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          headerCellClass: 'text-info'
      }
      ]

    };
    financieraRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
            .then(function(response) { //error con el success
                self.vigenciaActual = parseInt(response.data);
                var dif = self.vigenciaActual - 1995;
                var range = [];
                range.push(self.vigenciaActual);
                for (var i = 1; i < dif; i++) {
                    range.push(self.vigenciaActual - i);
                }
                self.years = range;
                self.Vigencia = self.vigenciaActual;
                //self.cargarDatos(self.offset,'');
                financieraRequest.get("movimiento_apropiacion/TotalMovimientosApropiacion/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
                .then(function(response) { //error con el success
                  self.gridOptions.totalItems = response.data;
                  self.cargarDatos(self.offset, '');
                });
            });



    self.cargarDatos = function(offset,query){
      if (query === ''){
        query = query+ '&query=Vigencia:'+ self.Vigencia+",UnidadEjecutora:"+self.UnidadEjecutora;
      }else{
        query = query+ ',Vigencia:'+ self.Vigencia+",UnidadEjecutora:"+self.UnidadEjecutora;
      }
      financieraRequest.get('movimiento_apropiacion','limit=' + self.gridOptions.paginationPageSize + '&offset=' + offset + query).then(function(response) {
        if (response.data === null || response.data.Type !== undefined) {
            self.gridOptions.data = [];
        } else {
            console.log(response.data);
            self.gridOptions.data = response.data;
        }
    });


    };
    self.verDisponibilidad = function(numero, vigencia){
      console.log('Numero: ', numero);
      console.log('Vigencia: ', vigencia);  
      $window.open('#/cdp/cdp_consulta?vigencia='+vigencia+'&numero='+numero, '_blank', 'location=yes');    
    };

    self.gridOptions.onRegisterApi = function(gridApi) {
      gridApi.core.on.filterChanged($scope, function() {
          var grid = this.grid;
          var query = '';
          angular.forEach(grid.columns, function(value, key) {
              if (value.filters[0].term) {
                  var formtstr = value.colDef.name.replace('[0]','');
                  query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;
                  console.log(query);
              }
          });
          self.cargarDatos(self.offset, query);
      });
      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {

          //self.gridOptions.data = {};

          // var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
          // var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
          // var query = '';
          // if (inicio !== undefined && fin !== undefined) {
          //     query = '&rangoinicio=' + inicio + "&rangofin=" + fin;
          // }
          var grid = this.grid;
          var query = '';
          angular.forEach(grid.columns, function(value, key) {
              if (value.filters[0].term) {
                  var formtstr = value.colDef.name.replace('[0]','');
                  query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

              }
          });
          self.offset = (newPage - 1) * pageSize;
          self.cargarDatos(self.offset, query);
      });
  };

    $scope.$watch("modificacionSolicitudConsulta.Vigencia", function() {


        //self.cragarDatos(0,'');

      if (self.fechaInicio !== undefined && self.Vigencia !== self.fechaInicio.getFullYear()) {
        //console.log(self.nuevo_calendario.FechaInicio.getFullYear());
        console.log("reset fecha inicio");
        self.fechaInicio = undefined;
        self.fechaFin = undefined;
      }
      self.fechamin = new Date(
        self.Vigencia,
        0, 1
      );
      self.fechamax = new Date(
        self.Vigencia,
        12, 0
      );
    }, true);


    $scope.loadrow = function(row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
          case "ver":
          		$("#myModal").modal();
          		self.data = row.entity;
            	break;
          case "otro":
              break;      
          default:
      }
  };

  self.generarModificacion = function(){
  	financieraRequest.post('movimiento_apropiacion/AprobarMovimietnoApropiacion', self.data).then(function(response) {
    		console.log(response.data);
             self.alerta = response.data;
          console.log(self.alerta);
          var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('SOLICITUD') + "</th><th>" + $translate.instant('DETALLE') + "</th>"+ "</th><th>" + $translate.instant('NO_CDP') + "</th>"+ "</th><th>" + $translate.instant('APROPIACION') + "</th>";
          angular.forEach(self.alerta, function(data) {
            if (data.Type === "error") {
              if (data.Body !== null){
                templateAlert = templateAlert + "<tr class='danger'><td>" + data.Body.Movimiento.NumeroMovimiento + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>"+ "<td>" + data.Body.Disponibilidad + "</td>"+ "<td>" + data.Body.Apropiacion + "</td>";
              }else{
                templateAlert = templateAlert + "<tr class='danger'><td>" + 'N/A' + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>"+ "<td>" + 'N/A' + "</td>"+ "<td>" + 'N/A'+ "</td>";
              }
            } else if (data.Type === "success") {
              templateAlert = templateAlert + "<tr class='success'><td>" + data.Body.Movimiento.NumeroMovimiento + "</td>" + "<td>" + $translate.instant(data.Code) + "</td>"+ "<td>" + data.Body.Disponibilidad + "</td>"+ "<td>" + data.Body.Apropiacion + "</td>" ;
            }

          });
          templateAlert = templateAlert + "</table>";

          swal({
            title: '',
            type: self.alerta[0].Type,
            width: 800,
            html: templateAlert,
            showCloseButton: true,
            confirmButtonText: 'Cerrar'
          }).then(function(){

          });



            self.data = null;
            self.cargarDatos(-1,'');
            $("#myModal").modal('hide');
    	});
  };

  self.rechzarMoidficacion = function(){
    var dataupd = {};
    angular.copy(self.data,dataupd);
    console.log(dataupd);
    dataupd.EstadoMovimientoApropiacion.Id=3;
    financieraRequest.put('movimiento_apropiacion',self.data.Id+"?fields=EstadoMovimientoApropiacion", dataupd).then(function(response) {
      if (response.data.Type !== undefined) {
                        if (response.data.Type === "error") {
                            swal('', $translate.instant(response.data.Code), response.data.Type);
                            console.log(response.data);
                        } else {
                            swal('', $translate.instant(response.data.Code) +" " + $translate.instant("NO")+" : " + response.data.Body.Id, response.data.Type).then(function() {
                                self.data = null;
                                self.cargarDatos(-1,'');
                                $("#myModal").modal('hide');

                            });
                        }

                    }
    });
  };

  $scope.$watch("modificacionSolicitudConsulta.Vigencia", function() {


    financieraRequest.get("movimiento_apropiacion/TotalMovimientosApropiacion/" + self.Vigencia, 'UnidadEjecutora=' + self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.gridOptions.totalItems = response.data;
      self.cargarDatos(self.offset, '');
    });

      if (self.fechaInicio !== undefined && self.Vigencia !== self.fechaInicio.getFullYear()) {
        //console.log(self.nuevo_calendario.FechaInicio.getFullYear());
        console.log("reset fecha inicio");
        self.fechaInicio = undefined;
        self.fechaFin = undefined;
      }
      self.fechamin = new Date(
        self.Vigencia,
        0, 1
      );
      self.fechamax = new Date(
        self.Vigencia,
        12, 0
      );
    }, true);

  });
