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
    self.alerta = "";
    self.gridOptions = {
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering : true,
      columnDefs : [
        {field: 'Id',              displayName: 'No.', cellClass: 'input_center'},
        {field: 'Vigencia',  displayName: 'Vigencia', cellClass: 'input_center'},
        {field: 'FechaSolicitud',  displayName: 'Fecha de Solicitud' ,  cellClass: 'input_center', cellTemplate: '<span>{{row.entity.FechaSolicitud | date:"yyyy-MM-dd":"+0900"}}</span>'},
        {field: 'DatosDisponibilidad.NumeroDisponibilidad',  displayName: 'Disponibilidad No. ', cellClass: 'input_center'},
        {field: 'DatosDisponibilidad.DatosNecesidad.Numero',  displayName: 'Necesidad No. ', cellClass: 'input_center'},
        {field: 'DatosDisponibilidad.DatosNecesidad.DatosDependenciaSolicitante.Nombre',  displayName: 'Dependencia Solicitante'},
        {
          field: 'Opciones',
          cellTemplate:'<center>' +
           ' <a type="button" class="editar" ng-click="grid.appScope.rpSolicitudConsulta.verSolicitud(row)" > '+
          '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a>'+
          ' <a type="button" class="borrar" aria-hidden="true" ng-click="grid.appScope.rpSolicitudConsulta.verSolicitud(row)" >',
          headerCellClass: 'text-info'
        }
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
        console.log(response.data);

      });
    };

    self.limpiar_alertas= function(){
      self.alerta_registro_cdp = "";
    };
    //self.gridOptions.multiSelect = false;
    self.actualizar_solicitudes();

    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      

    };

    self.gridOptions.isRowSelectable = function(row) {//comprobar si la solicitud es de cargue masivo o no 
    if(row.entity.Id === 161) return false;
    else return true;
}
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

    self.verSolicitud = function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
          self.data = row.entity;
          financieraRequest.get('compromiso/'+self.data.Compromiso,'').then(function(response){
            self.data.InfoCompromiso = response.data;
          });
          
        

      };

    self.Registrar = function(){
        self.alerta_registro_rp = ["No se pudo registrar el rp"];
      if(self.data.DatosProveedor == null){
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
        console.log(rp);
	var rubros = [];
	for (var i = 0 ; i < self.gridOptions_rubros.data.length ; i++){
	   self.gridOptions_rubros.data[i].DisponibilidadApropiacion.ValorAsignado = self.gridOptions_rubros.data[i].Monto;
           self.gridOptions_rubros.data[i].DisponibilidadApropiacion.FuenteFinanciacion = self.gridOptions_rubros.data[i].DisponibilidadApropiacion.FuenteFinanciamiento;
           rubros.push(self.gridOptions_rubros.data[i].DisponibilidadApropiacion);
        }
          var dataRegistros = [];
        var registro = {
          rp : rp,
          rubros : rubros
        };
        dataRegistros[0] = registro;
        console.log(registro);
        financieraMidRequest.post('registro_presupuestal/CargueMasivoPr', dataRegistros).then(function(response){
        self.alerta_registro_rp = response.data;
        console.log(self.alerta_registro_rp);
        /*angular.forEach(self.alerta_registro_rp, function(data){

          if (data === "error" || data === "success" || data === undefined){

          }else{
            self.alerta = self.alerta + data + "\n";
          }

        });
        swal("Alertas", self.alerta, self.alerta_registro_rp[0]).then(function(){

              self.alerta = "";
              $("#myModal").modal('hide');
              $window.location.reload();
            });*/
        //alert(data);
        //self.limpiar();
        //console.log(registro);

        });


      }
    };

    self.Rechazar = function (){
      var solicitud = self.data;
      $("#myModal").modal('hide');
      swal({
        title: 'Indique una justificación por el rechazo',
        input: 'textarea',
        showCancelButton: true,
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject('Por favor indica una justificación!');
            }
          });
        }
      }).then(function(text) {
        console.log(text);
        console.log(solicitud);
        self.solicitud.MotivoRechazo = text;
          argoRequest.post('ingreso/RechazarIngreso', solicitud).then(function(response) {
            console.log(response.data);
            if (response.data.Type !== undefined) {
              if (response.data.Type === "error") {
                swal('', $translate.instant(response.data.Code), response.data.Type);
                self.cargarIngresos();
              } else {
                swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {

                  self.cargarIngresos();
                });
              }

            }

          });

      });
    };




  });
