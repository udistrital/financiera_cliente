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
  .controller('CdpCdpConsultaCtrl', function ($window,disponibilidad,$scope,financieraRequest,financieraMidRequest,uiGridService,agoraRequest) {
    var self = this;
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',       cellClass: 'input_center',headerCellClass: 'text-info'},
        {field: 'NumeroDisponibilidad',   displayName: 'No.', cellClass: 'input_center',headerCellClass: 'text-info'},
        {field: 'Solicitud.SolicitudDisponibilidad.Necesidad.Numero' , displayName : 'Necesidad No.', cellClass: 'input_center',headerCellClass: 'text-info'},
        {field: 'FechaRegistro' , displayName : 'Fecha de Registro' ,cellClass: 'input_center', cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900"}}</span>',headerCellClass: 'text-info'},
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

    self.gridOptions_rubros = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
       columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Apropiacion.Rubro.Codigo', displayName: 'Codigo'},
        {field: 'Apropiacion.Rubro.Descripcion',  displayName: 'Descripcion'},
        {field: 'Apropiacion.Rubro.Estado',    displayName: 'Estado' },
        {field: 'Valor', cellFilter: 'currency' },
        {field: 'Saldo', cellFilter: 'currency'}
      ]
    };


    self.gridOptions.multiSelect = false;
    self.actualizarLista = function(){
      financieraRequest.get('disponibilidad','limit=-1').then(function(response) {
      self.gridOptions.data = response.data;
      angular.forEach(self.gridOptions.data, function(data){
        financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
          data.Solicitud = response.data[0];
        });
      });
      console.log(self.gridOptions.data );
    });
    };
    self.actualizarLista();
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
    };

    self.limpiar= function(){
      self.motivo = undefined;
      self.Valor = undefined;
      self.Rubro_sel = undefined;
      self.alerta = "";
    };

    self.anularDisponibilidad = function(){
      if (self.motivo == undefined || self.motivo ===""|| self.motivo == null){
        swal("", "Debe Digitar el motivo de la anulación", "error")
      }else if (self.tipoAnulacion == undefined || self.tipoAnulacion ===""|| self.tipoAnulacion == null){
        swal("", "Debe seleccionar el tipo de anulación a realizar", "error")
      }else if ((self.Valor == undefined || self.Valor ===""|| self.Valor == null)&&(self.tipoAnulacion === "P")){
        swal("", "Debe digitar el valor de la anulación", "error")
      }else if ((self.Rubro_sel == undefined || self.Rubro_sel ===""|| self.Rubro_sel == null)&&(self.tipoAnulacion === "P")){
        swal("", "Debe seleccionar el rubro afectado por el cdp a anular.", "error")
      }else {
        var valor = 0;
        self.alerta = "<ol>"
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
            self.actualizarLista();
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
