'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:RpRpSolicitudConsultaCtrl
 * @description
 * # RpRpSolicitudConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('RpRpSolicitudConsultaCtrl', function ($scope,$window,financieraMidRequest,uiGridService,argoRequest,financieraRequest) {
    var self = this;
    self.alertas = "";
    self.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',              displayName: 'Numero'},
        {field: 'Vigencia',  displayName: 'Vigencia'},
        {field: 'FechaSolicitud',  displayName: 'Fecha de Solicitud' ,  cellTemplate: '<span>{{row.entity.FechaSolicitud | date:"yyyy-MM-dd":"+0900"}}</span>'},
        {field: 'DatosDisponibilidad.NumeroDisponibilidad',  displayName: 'Consecutivo Disponibilidad'},
        {field: 'DatosDisponibilidad.DatosNecesidad.Numero',  displayName: 'Consecutivo Necesidad'},
        {field: 'DatosDisponibilidad.DatosNecesidad.DatosDependenciaSolicitante.Nombre',  displayName: 'Dependencia Solicitante'},
    ]

    };
    self.gridOptions_rubros =  {
      enableRowSelection: true,
      enableRowHeaderSelection: false,
       columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo', displayName: 'Codigo'},
        {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Vigencia',  displayName: 'Vigencia',  cellClass:'alignleft'},
        {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',  displayName: 'Descripcion'},
        {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Estado',    displayName: 'Estado' },
        {field: 'Monto',    displayName: 'Monto' , cellFilter: 'currency' }
      ]

    };
    self.actualizar_solicitudes = function(){
      financieraMidRequest.get('registro_presupuestal/GetSolicitudesRp','').then(function(response) {
        self.gridOptions.data.length = 0;
        self.gridOptions.data = response.data;


      });
    };

    self.limpiar_alertas= function(){
      self.alerta_registro_cdp = "";
    };
    self.gridOptions.multiSelect = false;
    self.actualizar_solicitudes();

    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;

          self.data = row.entity;
	  console.log(self.data.Id);
          argoRequest.get('disponibilidad_apropiacion_solicitud_rp','limit=0&query=SolicitudRp:'+self.data.Id).then(function(response) {
	  console.log(response.data);
          self.gridOptions_rubros.data = response.data;

          angular.forEach(self.gridOptions_rubros.data, function(rubro){
            financieraRequest.get('disponibilidad_apropiacion','limit=1&query=Id:'+rubro.DisponibilidadApropiacion).then(function(response) {
              angular.forEach(response.data, function(data){
                rubro.DisponibilidadApropiacion = data
                });

            });
            });
        });
        self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
        console.log(self.gridOptions_rubros.data);
      });

    };


    self.gridOptions_rubros.multiSelect = false;
    self.gridOptions_rubros.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.gridApi_rubros = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $scope.apropiacion = row.entity.DisponibilidadApropiacion.Apropiacion;
        console.log(row.entity);
        $scope.apropiacion_id = $scope.apropiacion.Id;
      });
    };


    self.Registrar = function(){
        self.alerta_registro_rp = ["No se pudo registrar el rp"];
      if(self.data.DatosProveedor.NomProveedor == null){
        swal("Alertas", "No se pudo cargar los datos del beneficiario", "error");
      }else if(self.data.DatosDisponibilidad.NumeroDisponibilidad == null){
        swal("Alertas", "No se pudo cargar los datos del CDP objetivo del RP", "error");
      }else if (self.gridOptions_rubros.data.length == 0){
        swal("Alertas", "No se pudo cargar los rubros objetivo del RP", "error");
      }else if(self.data.DatosCompromiso.Objeto == null){
        swal("Alertas", "No se pudo cargar el Compromiso del RP", "error");
      }else{

        var estado = {Id : 1};
        var rp = {
          UnidadEjecutora : self.data.DatosDisponibilidad.UnidadEjecutora ,
          Vigencia : self.data.DatosDisponibilidad.Vigencia,
          Responsable : self.data.DatosDisponibilidad.Responsable,
          Estado : estado,
          Beneficiario : self.data.DatosProveedor.Id,
          Compromiso: self.data.DatosCompromiso,
          Solicitud: self.data.Id,
          DatosSolicitud: self.data
        };
	var rubros = [];
	for (var i = 0 ; i < self.gridOptions_rubros.data.length ; i++){
	   self.gridOptions_rubros.data[i].DisponibilidadApropiacion.ValorAsignado = self.gridOptions_rubros.data[i].Monto;
           rubros.push(self.gridOptions_rubros.data[i].DisponibilidadApropiacion);
        }
        var registro = {
          rp : rp,
          rubros : rubros
        };
        console.log(registro);
        financieraMidRequest.post('registro_presupuestal', registro).then(function(response){
        self.alerta_registro_rp = response.data;
        angular.forEach(self.alerta_registro_rp, function(data){

          if (data === "error" || data === "success"){

          }else{
            self.alerta = self.alerta + data + "\n";
          }

        });
        swal("Alertas", self.alerta, self.alerta_registro_rp[0]).then(function(){

              self.alerta = "";
              $("#myModal").modal('hide');
              $window.location.reload();
            });
        //alert(data);
        //self.limpiar();
        //console.log(registro);

        });


      }
    };
  });
