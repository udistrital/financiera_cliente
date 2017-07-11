'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CdpCdpAnulacionCtrl
 * @description
 * # CdpCdpAnulacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CdpCdpAnulacionCtrl', function ($scope,financieraRequest,financieraMidRequest,uiGridService,agoraRequest,$translate) {
    var self = this;
    self.formVisibility = false;
    self.rubros_afectados = [];
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',       cellClass:'alignleft', cellClass: 'input_center', displayName: $translate.instant('VIGENCIA') },
        {field: 'NumeroDisponibilidad',   displayName: $translate.instant('NO'), cellClass: 'input_center'},
        {field: 'FechaRegistro' , displayName : $translate.instant('FECHA_CREACION'), cellClass: 'input_center',cellTemplate: '<span>{{row.entity.FechaRegistro | date:"yyyy-MM-dd":"+0900"}}</span>'},
        {field: 'Estado.Nombre', displayName : $translate.instant('ESTADO')},
        {field: 'Solicitud.DependenciaSolicitante.Nombre' , displayName : $translate.instant('DEPENDENCIA_SOLICITANTE')}
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
      financieraRequest.get('disponibilidad',$.param({
        query: "Estado.Nombre__not_in:Agotado",
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
        angular.forEach(self.gridOptions.data, function(data){
          financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
            data.Solicitud = response.data[0];
          });
        });
        console.log(self.gridOptions.data );
      });
    };
    financieraRequest.get('disponibilidad',$.param({
      query: "Estado.Nombre__not_in:Agotado",
      limit: -1
    })).then(function(response) {
      self.gridOptions.data = response.data;
      angular.forEach(self.gridOptions.data, function(data){
        financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Solicitud,'').then(function(response) {
          data.Solicitud = response.data[0];
        });
      });
      console.log(self.gridOptions.data );
    });

    self.gridOptions_rubros.onRegisterApi = function(gridApi){
      self.gridApi_rubros = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
          $scope.apropiacion = row.entity;
        });
    };



    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
        self.cdp = row.entity;
        financieraRequest.get('disponibilidad_apropiacion','limit=-1&query=Disponibilidad.Id:'+row.entity.Id).then(function(response) {
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
    };


    self.ShowForm = function(){
   self.formVisibility = !self.formVisibility;
    };

    self.limpiar= function(){
      self.motivo = undefined;
      self.Valor = undefined;
      self.Rubro_sel = undefined;
      self.alerta = "";
    };

    self.anular = function(){
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
          EstadoAnulacion : {Id:1}
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
            $("#myModal").modal('hide');
          });
          });
      }


    };


  });
