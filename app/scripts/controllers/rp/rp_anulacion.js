'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:RpRpAnulacionCtrl
 * @alias Anular RP
 * @requires $scope
 * @requires financieraService.service:financieraRequest
 * @requires financieraMidService.service:financieraMidRequest
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @param {service} financieraMidRequest Servicio para el API de financiera {@link financieraMidService.service:financieraMidRequest financieraMidRequest}
 * @param {injector} $scope scope del controlador
 * @description
 * # RpRpAnulacionCtrl
 * Controlador para la anulacion de Registros Presupuestales Expedidos de forma total o parcial.
 *
 *
 */
angular.module('financieraClienteApp')
  .controller('RpRpAnulacionCtrl', function ($window,rp,$scope,financieraRequest,financieraMidRequest,uiGridService,agoraRequest,$translate) {
    var self = this;
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Vigencia',       cellClass:'input_center' , displayName: $translate.instant('VIGENCIA') },
        {field: 'NumeroRegistroPresupuestal',   displayName: $translate.instant('NO') , cellClass:'input_center'},
        {field: 'Disponibilidad.NumeroDisponibilidad',   displayName: $translate.instant('CDP_NUMERO'), cellClass:'input_center'},
        {field: 'Necesidad.Numero',   displayName: $translate.instant('NECESIDAD_NO') ,cellClass:'input_center'},
        {field: 'FechaMovimiento' , cellClass:'input_center',displayName : $translate.instant('FECHA_CREACION') , cellTemplate: '<span>{{row.entity.FechaMovimiento | date:"yyyy-MM-dd":"UTC"}}</span>'},
        {field: 'Estado.Nombre', displayName : $translate.instant('ESTADO')},
      ]

    };

    self.gridOptions_rubros = {
      rowHeight: 30,
      headerHeight : 30,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
       columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Codigo', displayName: 'Codigo'},
        {field: 'DisponibilidadApropiacion.Apropiacion.Rubro.Descripcion',  displayName: 'Descripcion'},
        {field: 'Valor',  cellFilter: 'currency' },
        {field: 'Saldo', cellFilter: 'currency'}
      ]
    };

    self.gridOptions.multiSelect = false;
    financieraRequest.get('registro_presupuestal',$.param({
      query: "Estado.Nombre__not_in:Agotado",
      limit: -1
    })).then(function(response) {
      self.gridOptions.data = response.data;
      angular.forEach(self.gridOptions.data, function(data){
        financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion','limit=1&query=RegistroPresupuestal:'+data.Id).then(function(response) {
          data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
          financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Disponibilidad.Solicitud,'').then(function(response) {

                data.Necesidad = response.data[0].SolicitudDisponibilidad.Necesidad;


            });
        });
      });
    });
    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpAnulacionCtrl#actualizarLista
     * @methodOf financieraClienteApp.controller:RpRpAnulacionCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y obtener los registros presupuestales que no esten en estado agotado.
     */
    self.actualizarLista= function(){
      financieraRequest.get('registro_presupuestal',$.param({
        query: "Estado.Nombre__not_in:Agotado",
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
        angular.forEach(self.gridOptions.data, function(data){
          financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion','limit=1&query=RegistroPresupuestal:'+data.Id).then(function(response) {
            data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
            financieraMidRequest.get('disponibilidad/SolicitudById/'+data.Disponibilidad.Solicitud,'').then(function(response) {

                  data.Necesidad = response.data[0].SolicitudDisponibilidad.Necesidad;


              });
          });
        });
      });
    };
    self.gridOptions.onRegisterApi = function(gridApi){
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        $("#myModal").modal();
        $scope.apropiacion= undefined;
        $scope.apropiaciones = [];
        financieraRequest.get('registro_presupuestal','query=Id:'+row.entity.Id).then(function(response) {

            self.detalle = response.data;
            angular.forEach(self.detalle, function(data){

              agoraRequest.get('informacion_proveedor/'+data.Beneficiario,'').then(function(response) {

                    data.Beneficiario = response.data;

                });
              });
            angular.forEach(self.detalle, function(data){
              financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion','query=RegistroPresupuestal.Id:'+data.Id).then(function(response) {
                  self.gridOptions_rubros.data = response.data;
                  data.Disponibilidad = response.data[0].DisponibilidadApropiacion.Disponibilidad;
                  angular.forEach(self.gridOptions_rubros.data, function(rubros_data){
                    var rpdata = {
                      Rp : rubros_data.RegistroPresupuestal,
                      Apropiacion : rubros_data.DisponibilidadApropiacion.Apropiacion
                    };
                    financieraRequest.post('registro_presupuestal/SaldoRp',rpdata).then(function(response){
                      rubros_data.Saldo  = response.data;
                    });
                    financieraMidRequest.get('disponibilidad/SolicitudById/'+rubros_data.DisponibilidadApropiacion.Disponibilidad.Solicitud,'').then(function(response) {
                        var solicitud = response.data
                        angular.forEach(solicitud, function(data){
                          self.Necesidad = data.SolicitudDisponibilidad.Necesidad;
                          console.log(self.Necesidad);


                        });

                      });
                      if($scope.apropiaciones.indexOf(rubros_data.DisponibilidadApropiacion.Apropiacion.Id) === -1) {
                        $scope.apropiaciones.push(rubros_data.DisponibilidadApropiacion.Apropiacion.Id);
                      }

                    });
                    self.gridHeight = uiGridService.getGridHeight(self.gridOptions_rubros);
                });

            });
          });
      });
    };
    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpAnulacionCtrl#limpiar
     * @methodOf financieraClienteApp.controller:RpRpAnulacionCtrl
     * @description Se encarga de limiar los datos seleccionados por el usuario
     *
     */
    self.limpiar= function(){
      self.motivo = undefined;
      self.Valor = undefined;
      self.Rubro_sel = undefined;
      self.alerta = "";
    };
    /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RpRpAnulacionCtrl#anular
     * @methodOf financieraClienteApp.controller:RpRpAnulacionCtrl
     * @description Se encarga de solicitar al servicio {@link financieraService.service:financieraRequest financieraRequest} para realizar la anulacion
     *
     */
    self.anular = function(){
      if (self.motivo == undefined || self.motivo ===""|| self.motivo == null){
        swal("", "Debe Digitar el motivo de la anulación", "error")
      }else if (self.tipoAnulacion == undefined || self.tipoAnulacion ===""|| self.tipoAnulacion == null){
        swal("", "Debe seleccionar el tipo de anulación a realizar", "error")
      }else if ((self.Valor == undefined || self.Valor ===""|| self.Valor == null)&&(self.tipoAnulacion === "P")){
        swal("", "Debe digitar el valor de la anulación", "error")
      }else if ((self.Rubro_sel == undefined || self.Rubro_sel ===""|| self.Rubro_sel == null)&&(self.tipoAnulacion === "P")){
        swal("", "Debe seleccionar el rubro afectado por el rp a anular.", "error")
      }else if(parseFloat(self.Valor) <= 0){
        swal("", "El valor debe ser mayor a 0", "error")
      }else{
        var valor = 0;
        var rp_apropiacion =[];
        self.alerta = "<ol>"
        var anulacion = {
          Motivo : self.motivo,
          TipoAnulacion : self.tipoAnulacion
        };
        if (self.tipoAnulacion === "T"){
          rp_apropiacion = self.rubros_afectados;
        }else if (self.tipoAnulacion === "P"){
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
              self.actualizarLista();
              $("#myModal").modal('hide');
            });
          });
      }


    };



  });
