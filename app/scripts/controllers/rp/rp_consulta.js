'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpConsultaCtrl
 * @description
 * # RpRpConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .factory("rp", function () {
    return {};
  })
  .controller('RpRpConsultaCtrl', function ($window,$filter,$translate, rp, $scope, financieraRequest, financieraMidRequest, administrativaRequest,$location) {
    var self = this;
    self.offset = 0;
    self.UnidadEjecutora=1;
    self.cargando = false;
    self.hayData = true;
    self.ver_boton_reservas = true;
    self.reservas = false;
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      { clase_color: "ver", clase_css: "fa fa-file-excel-o fa-lg faa-shake animated-hover", titulo: $translate.instant('BTN.ANULAR'), operacion: 'anular', estado: true },
    ];

    self.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 10,
      useExternalPagination: true,
      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          cellClass: 'input_center',
          enableFiltering: false,
           headerCellClass: 'encabezado',
           width: "10%",
        },
        {
          field: 'NumeroRegistroPresupuestal',
          displayName: $translate.instant('NO'),
          cellClass: 'input_center',
           headerCellClass: 'encabezado',
           width: "10%",
        },
        {
          field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',
          displayName: $translate.instant('NO_CDP'),
          cellClass: 'input_center',
           headerCellClass: 'encabezado',
           width: "10%",
        },
        {
          field: 'InfoSolicitudDisponibilidad.SolicitudDisponibilidad.Necesidad.Numero',
          displayName: $translate.instant('NECESIDAD_NO'),
          cellClass: 'input_center',
          enableFiltering: false,
           headerCellClass: 'encabezado',
           width: "10%",
        },
        {
          field: 'FechaRegistro',
          cellClass: 'input_center',
          displayName: $translate.instant('FECHA_REGISTRO'),
          cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',
           headerCellClass: 'encabezado',
           width: "15%",
        },
        {
          field: 'Estado.Nombre',
          displayName: $translate.instant('ESTADO'),
           headerCellClass: 'encabezado',
          cellClass: 'input_center',
          width: "15%",
        },
        {
          field: 'InfoSolicitudDisponibilidad.DependenciaSolicitante.Nombre',
          displayName: $translate.instant('DEPENDENCIA_SOLICITANTE'),
          enableFiltering: false,
          headerCellClass: 'encabezado',
          cellClass: 'input_center',
          width: "20%",
        },
        {
          field: 'Opciones',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          enableFiltering: false,
          headerCellClass: 'encabezado',
          width: "10%",

        }
      ]

    };

    self.gridOptions_rubros = {
      rowHeight: 30,
      headerHeight: 30,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [{
          field: 'Id',
          visible: false
        },
        {
          field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo',
          displayName: 'Codigo'
        },
        {
          field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',
          displayName: 'Descripcion'
        },
        {
          field: 'Valor',
          cellFilter: 'currency'
        },
        {
          field: 'Saldo',
          cellFilter: 'currency'
        }
      ]
    };
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.vigenciaActual = parseInt(response.data);
      console.log(response.data);
      var dif = self.vigenciaActual - 1995 ;
      var range = [];
      range.push(self.vigenciaActual);
      for(var i=1;i<dif;i++) {
        range.push(self.vigenciaActual - i);
      }
      self.years = range;
      self.Vigencia = self.vigenciaActual;
      financieraRequest.get("registro_presupuestal/TotalRp/"+self.Vigencia,'UnidadEjecutora='+self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
      .then(function(response) { //error con el success
        self.gridOptions.totalItems = response.data;
        self.cargarLista(0,'');
      });
    });
    self.gridOptions.multiSelect = false;
    self.cargandoDatosPagos = true;

    self.cargarLista = function (offset,query) {
      if($location.search().vigencia !== undefined && $location.search().numero && $location.search().unidadejecutora){
          query = '&query=NumeroRegistroPresupuestal:'+$location.search().numero;
          self.Vigencia = $location.search().vigencia;
          self.UnidadEjecutora = $location.search().unidadejecutora;
        }
        financieraMidRequest.cancel();
        self.gridOptions.data = [];
        self.cargando = true;
        self.hayData = true;
        financieraMidRequest.get('registro_presupuestal/ListaRp/'+self.Vigencia, 'UnidadEjecutora='+self.UnidadEjecutora+'&limit='+self.gridOptions.paginationPageSize+'&offset='+offset+query).then(function (response) {
          if (response.data.Type !== undefined){
            self.hayData = false;
            self.cargando = false;
            self.gridOptions.data = [];
          }else{
            console.log(response.data);
            self.hayData = true;
            self.cargando = false;
            self.gridOptions.data = response.data;
            console.log(response.data);
          }
          self.cargandoDatosPagos = false;
        });
    };

    $scope.loadrow = function(row, operacion) {
      self.operacion = operacion;
      switch (operacion) {
            case "ver":
                  self.verRp(row,false);
            break;

            case "anular":
                  self.verRp(row,true);
            break;
          default:
      }
  };
    // called no matter success or failure

    self.limpiar = function () {
      self.motivo = undefined;
      self.Valor = undefined;
      self.Rubro_sel = undefined;
      self.alerta = "";
    };
    self.verDisponibilidad = function(numero, vigencia){
      console.log('Numero: ', numero);
      console.log('Vigencia: ', vigencia);
      $window.open('#/cdp/cdp_consulta?vigencia='+vigencia+'&numero='+numero, '_blank', 'location=yes');
    };

    self.cargarTipoAnulacion = function(){
            financieraRequest.get("tipo_anulacion_presupuestal/", 'limt=-1') //formato de entrada  https://golang.org/src/time/format.go
                    .then(function(response) { //error con el success
                        self.tiposAnulacion = response.data;
                    });
        };

    self.verRp = function (row, anular) {
      self.detalle = [];
      self.anular = anular;
      if (self.anular){
        self.cargarTipoAnulacion();
      }
      $("#myModal").modal();
      $scope.apropiacion = undefined;
      $scope.apropiaciones = [];
      var data = [];
      data.push(row.entity);
        self.detalle = data;
        console.log("entt");
        console.log(row.entity);
        angular.forEach(self.detalle, function (data) {

            self.gridOptions_rubros.data = data.RegistroPresupuestalDisponibilidadApropiacion;
            data.Disponibilidad = data.RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad;
            angular.forEach(self.gridOptions_rubros.data, function (rubros_data) {
              var rpdata = {
                Rp: rubros_data.RegistroPresupuestal,
                Apropiacion: rubros_data.DisponibilidadApropiacion.Apropiacion
              };
              financieraRequest.post('registro_presupuestal/SaldoRp', rpdata).then(function (response) {
                rubros_data.Saldo = response.data;
              });

                if ( data.InfoSolicitudDisponibilidad != undefined &&  data.InfoSolicitudDisponibilidad != null){

                  self.Necesidad = data.InfoSolicitudDisponibilidad.SolicitudDisponibilidad.Necesidad;
                }

              if ($scope.apropiaciones.indexOf(rubros_data.DisponibilidadApropiacion.Apropiacion.Id) === -1) {
                    $scope.apropiaciones.push(rubros_data.DisponibilidadApropiacion.Apropiacion.Id);
              }

            });



        });
        angular.forEach(self.detalle, function (data) {
          administrativaRequest.get('informacion_proveedor/' + data.Beneficiario, '').then(function (response) {

            data.BeneficiarioInfo = response.data;

          });
        });

    };
    self.anularRp = function(){
      if (self.motivo == undefined || self.motivo ===""|| self.motivo == null){
        swal("", $translate.instant("E_A02") , "error")
      }else if (self.tipoAnulacion == undefined || self.tipoAnulacion == null){
        swal("", $translate.instant("E_A03"), "error")
      }else if ((self.Rubro_sel == undefined || self.Rubro_sel ===""|| self.Rubro_sel == null)&&(self.tipoAnulacion.Nombre === "Parcial")){
       swal("", $translate.instant("E_A06"), "error")
     }else if ((self.Valor == undefined || self.Valor ===""|| self.Valor == null)&&(self.tipoAnulacion.Nombre === "Parcial")){
        swal("", $translate.instant("E_A04"), "error")
      }else if(parseFloat(self.Valor) <= 0){
        swal("", $translate.instant("E_A07"), "error")
      }else{
        var valor = 0;
        var rp_apropiacion =[];
        self.alerta = "<ol>";
        var anulacion = {
          Motivo : self.motivo,
          TipoAnulacion : self.tipoAnulacion,
          EstadoAnulacion : {Id:1},
          Expidio: 1234567890
        };
        if (self.tipoAnulacion.Id === 2 || self.tipoAnulacion.Id === 3){
          rp_apropiacion = self.rubros_afectados;
        }else if (self.tipoAnulacion.Id === 1){
          rp_apropiacion[0] = self.Rubro_sel;
          valor = parseFloat(self.Valor);
        }
        var datos_anulacion = {
          Anulacion : anulacion,
          Rp_apropiacion : rp_apropiacion,
          Valor : valor
        };
        console.log(datos_anulacion);
        financieraRequest.post('registro_presupuestal/Anular', datos_anulacion).then(function(response) {
            self.alerta_anulacion_rp = response.data;
            angular.forEach(self.alerta_anulacion_rp, function(data){

              if (data !== "error" || data !== "success"){
                  self.alerta = self.alerta +"<li align='left'>" +data +"</li>";
              }

            });
            self.alerta = self.alerta + "</ol>";
            swal("", self.alerta, self.alerta_anulacion_rp[0]).then(function(){
              self.limpiar();
              $("#myModal").modal("hide");
              financieraRequest.get("registro_presupuestal/TotalRp/"+self.Vigencia,"UnidadEjecutora="+self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
              .then(function(response) { //error con el success
              self.gridOptions.totalItems = response.data;

              self.cargarLista(0,'');

            });
              //$("#myModal").modal('hide');
            });



          });
      }


    };
    /*self.gridOptions.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $("#myModal").modal();
        $scope.apropiacion = undefined;
        $scope.apropiaciones = [];
        financieraRequest.get('registro_presupuestal', 'query=Id:' + row.entity.Id).then(function (response) {

          self.detalle = response.data;
          angular.forEach(self.detalle, function (data) {

            agoraRequest.get('informacion_proveedor/' + data.Beneficiario, '').then(function (response) {

              data.Beneficiario = response.data;

            });
          });
          angular.forEach(self.detalle, function (data) {
            financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion', 'query=RegistroPresupuestal.Id:' + data.Id).then(function (response) {
              self.gridOptions_rubros.data = response.data;
              data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
              angular.forEach(self.gridOptions_rubros.data, function (rubros_data) {
                var rpdata = {
                  Rp: rubros_data.RegistroPresupuestal,
                  Apropiacion: rubros_data.DisponibilidadApropiacion.Apropiacion
                };
                financieraRequest.post('registro_presupuestal/SaldoRp', rpdata).then(function (response) {
                  rubros_data.Saldo = response.data;
                });
                financieraMidRequest.get('disponibilidad/SolicitudById/' + rubros_data.DisponibilidadApropiacion.Disponibilidad.Solicitud, '').then(function (response) {
                  var solicitud = response.data
                  angular.forEach(solicitud, function (data) {
                    self.Necesidad = data.SolicitudDisponibilidad.Necesidad;
                    console.log(self.Necesidad);


                  });

                });
                if ($scope.apropiaciones.indexOf(rubros_data.DisponibilidadApropiacion.Apropiacion.Id) !== -1) {

                } else {
                  $scope.apropiaciones.push(rubros_data.DisponibilidadApropiacion.Apropiacion.Id);
                }

              });
              self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
            });

          });
        });
      });
    };*/

    self.filtrarListaRp = function(){
      self.gridOptions.data = {};
      var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
      var query = '';
      if (inicio !== undefined && fin !== undefined) {
        query = 'rangoinicio='+inicio+"&rangofin="+fin;
      }
      console.log(fin);
      financieraRequest.get("registro_presupuestal/TotalRp/"+self.Vigencia,"UnidadEjecutora="+self.UnidadEjecutora+query) //formato de entrada  https://golang.org/src/time/format.go
      .then(function(response) { //error con el success
        self.gridOptions.totalItems = response.data;
        self.cargarLista(0,"&"+query);
      });
    };

    $scope.$watch("rpConsulta.Vigencia", function() {

      if(self.reservas != true){
        self.ver_titulo_reservas = false;
        self.ver_boton_reservas = true;
        self.reservas = false;
      }
      else{
        self.ver_titulo_reservas = true;
        self.ver_boton_reservas = false;
        self.reservas = false;
      }

      financieraRequest.get("registro_presupuestal/TotalRp/"+self.Vigencia,"UnidadEjecutora="+self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
      .then(function(response) { //error con el success
        self.gridOptions.totalItems = response.data;
        self.cargarLista(0,'');
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


    self.gridOptions.onRegisterApi = function(gridApi){
      gridApi.core.on.filterChanged($scope, function() {
        var grid = this.grid;
                var query = '';
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        var formtstr = value.colDef.name.replace('[0]','');
                        query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

                    }
                });
                self.cargarLista(self.offset, query);
    });
    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
      console.log('newPage '+newPage+' pageSize '+pageSize);
      self.gridOptions.data = {};
      var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
      var query = '';
      if (inicio !== undefined && fin !== undefined) {
        query = '&rangoinicio='+inicio+"&rangofin="+fin;
      }
      var grid = this.grid;
                angular.forEach(grid.columns, function(value, key) {
                    if (value.filters[0].term) {
                        var formtstr = value.colDef.name.replace('[0]','');
                        query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

                    }
                });
      self.offset = (newPage-1)*pageSize;
      self.cargarLista(self.offset,query);
    });
    };
    self.gridOptions_rubros.onRegisterApi = function (gridApi) {
      //set gridApi on scope
      self.gridApi_rubros = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function (row) {
        $scope.apropiacion = row.entity;
        $scope.apropiacion_id = row.entity.DisponibilidadApropiacion.Apropiacion.Id;
      });
    };

     self.verReservas = function() {
            financieraRequest.get("orden_pago/FechaActual/2006", '') //formato de entrada  https://golang.org/src/time/format.go
                .then(function(response) {
                    self.Vigencia = parseInt(response.data)-1;
                    self.reservas = true;
                    self.ver_boton_reservas = false;
                });
        };

    self.volver_a_vigencia = function(){

            self.Vigencia = self.vigenciaActual;
            self.ver_boton_reservas = true;
            self.cargarLista(0,'');
        }
  });
