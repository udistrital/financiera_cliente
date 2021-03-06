'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaReintegrosCtrl
 * @description
 * # TesoreriaReintegrosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaReintegrosCtrl', function ($scope,financieraRequest,$translate,uiGridConstants,agoraRequest,financieraMidRequest,$location,coreRequest,$window) {
    var ctrl = this;
    ctrl.fechaOficio = new Date();
    ctrl.fechaConsignacion = new Date();
    $scope.botones = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg faa-shake animated-hover", titulo: $translate.instant('VER'), operacion: 'ver', estado: true }
    ];
    ctrl.gridOrdenesDePago = {
      showColumnFooter: true,
      paginationPageSizes: [10, 50, 100],
      paginationPageSize: null,

      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      minRowsToShow: 10,
      useExternalPagination: false,
      enableSelectAll: false,
      multiSelect:false,
      columnDefs: [
        {
          field: 'Consecutivo',
          displayName: $translate.instant('CODIGO'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
          width: '8%',
          displayName: $translate.instant('TIPO'),
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.tipos
          },
          headerCellClass: 'text-info'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
          displayName: $translate.instant('FECHA_CREACION'),
          cellClass: 'input_center',
          cellFilter: "date:'yyyy-MM-dd'",
          width: '8%',
          headerCellClass: 'text-info'
        },
        {
          field: 'RegistroPresupuestal.NumeroRegistroPresupuestal',
          displayName: $translate.instant('NO_CRP'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'text-info'
        },
        {
          field: 'FormaPago.CodigoAbreviacion',
          width: '5%',
          displayName: $translate.instant('FORMA_PAGO'),
          headerCellClass: 'text-info'
        },
        {
          field: 'Proveedor.Tipopersona',
          width: '10%',
          displayName: $translate.instant('TIPO_PERSONA'),
          headerCellClass: 'text-info'
        },
        {
          field: 'Proveedor.NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: 'text-info'
        },
        {
          field: 'Proveedor.NumDocumento',
          width: '10%',
          cellClass: 'input_center',
          displayName: $translate.instant('NO_DOCUMENTO'),
          headerCellClass: 'text-info'
        },
        {
          field: 'ValorBase',
          width: '10%',
          cellFilter: 'currency',
          cellClass: 'input_right',
          displayName: $translate.instant('VALOR'),
          headerCellClass: 'text-info'
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '7%',
          displayName: $translate.instant('ESTADO'),
          headerCellClass: 'text-info'
        },
        {
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '5%',
          cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
          headerCellClass: 'text-info'
        },

      ],
      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          ctrl.ordenPago = row.entity;
        });
      }
    };
    ctrl.cargarOrdenesPago = function (){

        financieraRequest.get('orden_pago', $.param({
            limit: -1
        })).then(function(response) {
          ctrl.gridOrdenesDePago.data = response.data;
          // data proveedor
          angular.forEach(ctrl.gridOrdenesDePago.data, function(iterador) {
            agoraRequest.get('informacion_proveedor',
              $.param({
                query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
              })
            ).then(function(response) {
              iterador.Proveedor = response.data[0];
            });
          });
        });
    };

    ctrl.cargarOrdenesPago();

    ctrl.consultarListas= function(){

      financieraRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        var year = parseInt(response.data);
        ctrl.anos = [];
        for (var i = 0; i < 5; i++) {
          ctrl.anos.push(year - i);
        }
      });

      financieraRequest.get('unidad_ejecutora', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.unidadesejecutoras = response.data;
      });

      financieraRequest.get('causal_reintegro', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.causalesReintegro = response.data;
      });

      coreRequest.get('documento',
        $.param({
          query: "TipoDocumento.DominioTipoDocumento.CodigoAbreviacion:DD-FINA,Activo:True,TipoDocumento.CodigoAbreviacion:TD-ING",
          limit: -1
        })
      ).then(function(response) {
        ctrl.documentos = response.data;
      });

   };

   ctrl.consultarListas();


   ctrl.validateFields = function(){
     if($scope.datosReintegro.$invalid){
       angular.forEach($scope.datosReintegro.$error,function(controles,error){
         angular.forEach(controles,function(control){
           control.$setDirty();
         });
       });
       return false;
     }
     if (angular.isUndefined(ctrl.concepto) || ctrl.concepto[0] == null) {
         swal("", $translate.instant('SELECCIONAR_CONCEPTO_INGRESO'), "error");
         return false;
     }

     if (ctrl.concepto[0].validado===false){
       swal("",$translate.instant('PRINCIPIO_PARTIDA_DOBLE_ADVERTENCIA'),"warning");
       return false;
     }
       return true;
   }

   $scope.$watch('tesoreriaReintegros.concepto[0]', function(newValue,oldValue) {
               if (!angular.isUndefined(newValue)) {
                 ctrl.movs = undefined;
                   financieraRequest.get('concepto', $.param({
                       query: "Id:" + newValue.Id,
                       fields: "Rubro",
                       limit: -1
                   })).then(function(response) {
                       $scope.tesoreriaReintegros.concepto[0].Rubro = response.data[0].Rubro;
                   });
               }
           }, false);

    ctrl.crearReintegro= function(){
      var request;
      var templateAlert;
       if(ctrl.validateFields()){
         request = {
           Ingreso:{
             FechaInicio: ctrl.fechaConsignacion,
             FechaFin: ctrl.fechaConsignacion,
             Observaciones: ctrl.observaciones,
             UnidadEjecutora: ctrl.unidadejecutora,
           },
           DocumentoGenerador:{
               NumDocumento:ctrl.oficio,
               FechaDocumento:ctrl.fechaOficio,
               TipoDocumento:ctrl.documentoSelec.Id
           },
           Reintegro:{
             Oficio: ctrl.oficio,
             FechaOficio:ctrl.fechaOficio,
             Causal:ctrl.causalReintegro,
             Observaciones:ctrl.observaciones,
             OrdenPago:ctrl.ordenPago,
             Disponible:true,
           },
           IngresoBanco: ctrl.valor,
           Concepto: ctrl.concepto[0]
         }

         angular.forEach(ctrl.movs, function(data) {
             delete data.Id;
         });
         request.Movimientos = ctrl.movs;
         financieraMidRequest.post('reintegro/Create',request).then(function(response){
          if(response.data.Type==="error"){
            templateAlert=$translate.instant(response.data.Code);

          } else{
            templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('CONSECUTIVO') + "</th><th>"+$translate.instant('INGRESO_NO')+"</th><th>" + $translate.instant('DETALLE') + "</th>";
            templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Reintegro.Consecutivo + "</td><td>" +response.data.Body.Ingreso.Consecutivo+ "</td><td>"+ $translate.instant(response.data.Code) + "</td></tr>" ;
            templateAlert = templateAlert + "</table>";
            $location.path('/ingresos/ingreso_consulta');
          }
          swal($translate.instant('INFORMACION_REINTEGRO'),templateAlert,response.data.Type);
         });

       }
    }

    $scope.loadrow = function(row, operacion) {
        $scope.solicitud = row.entity;
        switch (operacion) {
            case "ver":
                $window.open('#/orden_pago/proveedor/ver/'+row.entity.Id, '_blank', 'location=yes');
                break;
            default:
        }
    }


  });
