'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpConsultaCtrl
 * @description
 * # CdpCdpConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.factory("disponibilidad",function(){
        return {};
  })
  .controller('CdpCdpConsultaCtrl', function ($filter,$window,$scope,$translate,disponibilidad,financieraRequest,financieraMidRequest,agoraRequest) {
    var self = this;
    self.offset = 0;
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 10,
      useExternalPagination: true,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',       cellClass: 'input_center',headerCellClass: 'text-info'},
        {field: 'NumeroDisponibilidad',   displayName: 'No.', cellClass: 'input_center',headerCellClass: 'text-info'},
        {field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Numero' , displayName : 'Necesidad No.', cellClass: 'input_center',headerCellClass: 'text-info'},
        {field: 'FechaRegistro' , displayName : 'Fecha de Registro' ,cellClass: 'input_center', cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"UTC"}}</span>',headerCellClass: 'text-info'},
        {field: 'Estado.Nombre', displayName : 'Estado',headerCellClass: 'text-info'},
        {field: 'Solicitud.DependenciaSolicitante.Nombre' , displayName : 'Dependencia Solicitante',headerCellClass: 'text-info'},
        {
          field: 'Opciones',
          cellTemplate:'<center>' +
           ' <a type="button" class="editar" ng-click="grid.appScope.cdpConsulta.verDisponibilidad(row,false)" > '+
          '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>'+
          ' <a type="button" class="borrar" aria-hidden="true" ng-click="grid.appScope.cdpConsulta.verDisponibilidad(row,true)" >'+
          '<i class="fa fa-file-excel-o fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.ANULAR\' | translate }}"></i></a>',
          headerCellClass: 'text-info'
        }
      ]

    };
    
    self.UnidadEjecutora=1;
    self.gridOptions_rubros = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
       columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Apropiacion.Rubro.Codigo', displayName: $translate.instant("CODIGO")},
        {field: 'Apropiacion.Rubro.Descripcion', displayName: $translate.instant("DESCRIPCION")},
        {field: 'Apropiacion.Rubro.Estado',    displayName: $translate.instant("ESTADO") },
        {field: 'Valor', cellFilter: 'currency', displayName: $translate.instant("VALOR")  },
        {field: 'Saldo', cellFilter: 'currency', displayName: $translate.instant("SALDO") }
      ]
    };

    financieraRequest.get("orden_pago/FechaActual/2006",'') //formato de entrada  https://golang.org/src/time/format.go
    .then(function(response) { //error con el success
      self.vigenciaActual = parseInt(response.data);
      var dif = self.vigenciaActual - 1995 ;
      var range = [];
      range.push(self.vigenciaActual);
      for(var i=1;i<dif;i++) {
        range.push(self.vigenciaActual - i);
      }
      self.years = range;
      self.Vigencia = self.vigenciaActual;
      financieraRequest.get("disponibilidad/TotalDisponibilidades/"+self.Vigencia,'UnidadEjecutora='+self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
      .then(function(response) { //error con el success
        self.gridOptions.totalItems = response.data;
        self.actualizarLista(self.offset,'');
      });
      
    });

    self.gridOptions.multiSelect = false;
    self.actualizarLista = function(offset,query){
      financieraMidRequest.get('disponibilidad/ListaDisponibilidades/'+self.Vigencia,'limit='+self.gridOptions.paginationPageSize+'&offset='+offset+query+"&UnidadEjecutora="+self.UnidadEjecutora).then(function(response) {
      if (response.data.Type !== undefined){
          self.gridOptions.data = [];
        }else{
          console.log(response.data);
          self.gridOptions.data = response.data;
        }
    });
    };
    
    self.verDisponibilidad = function(row,anular){
      self.anular = anular;
      $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
        self.cdp = row.entity;
        financieraRequest.get('disponibilidad_apropiacion','limit=0&query=Disponibilidad.Id:'+row.entity.Id).then(function(response) {
          self.gridOptions_rubros.data = response.data;
          angular.forEach(self.gridOptions_rubros.data, function(data){
            if($scope.apropiaciones.indexOf(data.Apropiacion.Id) !== -1) {

            }else{
              $scope.apropiaciones.push(data.Apropiacion.Id);
            }

              console.log($scope.apropiaciones);
              console.log(self.cdp.Id);
              var saldo;
              var rp = {
                Disponibilidad : data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
                Apropiacion : data.Apropiacion
              };
              financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
                data.Saldo  = response.data;
              });
              
            });

              agoraRequest.get('informacion_persona_natural',$.param({
                query: "Id:"+self.cdp.Responsable,
                limit: 1
              })).then(function(response){
                if (response.data != null){
                  self.cdp.Responsable = response.data[0];
                }

              });

        });
    };

    self.limpiar= function(){
      self.motivo = undefined;
      self.Valor = undefined;
      self.Rubro_sel = undefined;
      self.alerta = "";
    };

    self.anularDisponibilidad = function(){
      if (self.motivo == undefined || self.motivo ===""|| self.motivo == null){
        swal("", $translate.instant("E_A02") , "error")
      }else if (self.tipoAnulacion == undefined || self.tipoAnulacion ===""|| self.tipoAnulacion == null){
        swal("", $translate.instant("E_A03"), "error")
      }else if ((self.Valor == undefined || self.Valor ===""|| self.Valor == null)&&(self.tipoAnulacion === "P")){
        swal("", $translate.instant("E_A04"), "error")
      }else if ((self.Rubro_sel == undefined || self.Rubro_sel ===""|| self.Rubro_sel == null)&&(self.tipoAnulacion === "P")){
        swal("", $translate.instant("E_A05"), "error")
      }else if(parseFloat(self.Valor) <= 0){
        swal("", $translate.instant("E_A07"), "error")
      }else {
        var valor = 0;
        self.alerta = "<ol>";
        var disponibilidad_apropiacion =[];
        var anulacion = {
          Motivo : self.motivo,
          TipoAnulacion : self.tipoAnulacion,
          EstadoAnulacion : {Id:1},
          Expidio: 1234567890
        };
        if (self.tipoAnulacion === "T"){
          disponibilidad_apropiacion = self.rubros_afectados;
        }else if (self.tipoAnulacion === "P"){
          disponibilidad_apropiacion[0] = self.Rubro_sel;
          valor = parseFloat(self.Valor);
        }
        var datos_anulacion = {
          Anulacion : anulacion,
          Disponibilidad_apropiacion : disponibilidad_apropiacion,
          Valor : valor
        };
        financieraRequest.post('disponibilidad/Anular', datos_anulacion).then(function(response) {
          self.alerta_anulacion_cdp = response.data;
          angular.forEach(self.alerta_anulacion_cdp, function(data){
            if (data === "error" || data === "success"){

            }else{
              self.alerta = self.alerta +"<li>" +data +"</li>";
            }


          });
          self.alerta = self.alerta + "</ol>";
          swal("", self.alerta, self.alerta_anulacion_cdp[0]).then(function(){
            self.limpiar();
            //self.actualizarLista();
            //$("#myModal").modal('hide');
          });
          });
      }


    };


    /*self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
        self.cdp = row.entity;
        financieraRequest.get('disponibilidad_apropiacion','limit=0&query=Disponibilidad.Id:'+row.entity.Id).then(function(response) {
          self.gridOptions_rubros.data = response.data;
          angular.forEach(self.gridOptions_rubros.data, function(data){
            if($scope.apropiaciones.indexOf(data.Apropiacion.Id) !== -1) {

            }else{
              $scope.apropiaciones.push(data.Apropiacion.Id);
            }

              console.log($scope.apropiaciones);
              console.log(self.cdp.Id);
              var saldo;
              var rp = {
                Disponibilidad : data.Disponibilidad, // se construye rp auxiliar para obtener el saldo del CDP para la apropiacion seleccionada
                Apropiacion : data.Apropiacion
              };
              financieraRequest.post('disponibilidad/SaldoCdp',rp).then(function(response){
                data.Saldo  = response.data;
              });
              self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
            });

              agoraRequest.get('informacion_persona_natural',$.param({
                query: "Id:"+self.cdp.Responsable,
                limit: 1
              })).then(function(response){
                if (response.data != null){
                  self.cdp.Responsable = response.data[0];
                }

              });

        });
      });
    };*/

    self.filtrarListaCdp = function () {
      self.gridOptions.data = {};
      var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
      var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
      var query = '';
      if (inicio !== undefined && fin !== undefined) {
        query = 'rangoinicio='+inicio+"&rangofin="+fin;
      }
      console.log(fin);
      financieraRequest.get("disponibilidad/TotalDisponibilidades/"+self.Vigencia,query+"&UnidadEjecutora="+self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
      .then(function(response) { //error con el success
        self.gridOptions.totalItems = response.data;
        self.actualizarLista(0,"&"+query);
      });
      

    };

    $scope.$watch("cdpConsulta.Vigencia", function() {
      financieraRequest.get("disponibilidad/TotalDisponibilidades/"+self.Vigencia,'UnidadEjecutora='+self.UnidadEjecutora) //formato de entrada  https://golang.org/src/time/format.go
      .then(function(response) { //error con el success
        self.gridOptions.totalItems = response.data;
        self.actualizarLista(0,'');
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
        angular.forEach(grid.columns, function(value, key) {
            if(value.filters[0].term) {
                //console.log('FILTER TERM FOR ' + value.colDef.name + ' = ' + value.filters[0].term);
            }
        });
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
      
      var offset = (newPage-1)*pageSize;
      self.actualizarLista(offset,query);
    });
    };
    self.gridOptions_rubros.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.gridApi_rubros = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.apropiacion = row.entity;
        console.log(row.entity);
        $scope.apropiacion_id = row.entity.Apropiacion.Id;
      });
    };
  });
