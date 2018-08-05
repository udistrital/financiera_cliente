'use strict';

/**
* @ngdoc directive
* @name financieraClienteApp.directive:rubros/rubrosPorRpSeleccionMultiple
* @description
* # rubros/rubrosPorRpSeleccionMultiple
*/
angular.module('financieraClienteApp')
.directive('rubrosPorRpSeleccionMultiple', function(financieraRequest, $timeout, $translate) {
  return {
    restrict: 'E',
    scope: {
      inputpestanaabierta: '=?',
      inputrpid: '=?',
      outputconceptos: '=?',
      outputproveedorrubro: '=?'
    },

    templateUrl: 'views/directives/rubros/rubros_por_rp_seleccion_multiple.html',
    controller: function($scope) {
      var self = this;
      var expandableScope = {};
      self.cargando = true;
      self.hayData = true;
      // refrescar
      self.refresh = function() {
        $scope.refresh = true;
        $timeout(function() {
          $scope.refresh = false;
        }, 0);
      };

      $scope.outputconceptos = [];

      self.gridOptions_conceptos = {
        multiSelect: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        columnDefs: [{
          field: 'Id',
          visible: false,
          enableCellEdit: false
        },
        {
          field: 'Codigo',
          displayName: $translate.instant('CODIGO') + ' ' + $translate.instant('CONCEPTO'),
          enableCellEdit: false,
          width: '15%',
          headerCellClass: 'encabezado',
          cellClass: 'input_center'
        },
        {
          field: 'Nombre',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: 'encabezado',
          cellClass: 'input_center',
          width: '20%',
          enableCellEdit: false
        },
        {
          field: 'Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          enableCellEdit: false,
          headerCellClass: 'encabezado',
          width: '20%',
          cellClass: 'input_center'
        },
        {
          field: 'TipoConcepto.Nombre',
          displayName: $translate.instant('TIPO'),
          enableCellEdit: false,
          width: '10%',
          headerCellClass: 'encabezado',
          cellClass: 'input_center'
        },
        {
          field: 'Rubro.Codigo',
          displayName: $translate.instant('CODIGO') +' '+$translate.instant('RUBRO'),
          enableCellEdit: false,
          headerCellClass: 'encabezado',
          cellClass: 'input_center',
          width: '15%',
        },
        {
          field: 'Rubro.Nombre',
          displayName: $translate.instant('NOMBRE')+ ' '+$translate.instant('RUBRO'),
          enableCellEdit: false,
          headerCellClass: 'encabezado',
          cellClass: 'input_center',
          width: '20%',
        },
      ],
      onRegisterApi: function(gridApi) {
        self.gridApi = gridApi;
        $scope.outputconceptos = [];
        gridApi.selection.on.rowSelectionChanged(gridApi.grid.appScope, function(row2) {
          if (row2.isSelected) {
            $scope.outputconceptos.push(row2.entity);
          } else {
            var i = $scope.outputconceptos.indexOf(row2.entity)
            $scope.outputconceptos.splice(i, 1);
          }
        });
      }
    }

    $scope.$watch('inputpestanaabierta', function() {
      if ($scope.inputpestanaabierta) {
        $scope.a = $scope.inputpestanaabierta;
      }
    })
    $scope.$watch('outputproveedorrubro', function() {
      if (!angular.isUndefined($scope.outputproveedorrubro)) {
        $scope.inputrpid = [];
      }
    }
    ,true);
    //
    $scope.$watch('inputrpid[inputrpid.length - 1].Id', function() {
      self.refresh();
      self.datos = [];
      if (!angular.isUndefined($scope.inputrpid)) {

        if ($scope.inputrpid.length >0 ) {
          angular.forEach($scope.inputrpid, function(rp){
            financieraRequest.get('registro_presupuestal_disponibilidad_apropiacion',
            $.param({
              query: "RegistroPresupuestal.Id:" + rp.Id,
              limit: 0
            })
          ).then(function(response) {
           if(response.data === null){
              self.hayData = false;
              self.cargando = false;
            }
            else{
              self.datos.push(response.data[0]);
              angular.forEach(self.datos, function(iterador) {
                // get saldos de lor rp
                var rpData = {
                  Rp: iterador.RegistroPresupuestal,
                  Apropiacion: iterador.DisponibilidadApropiacion.Apropiacion,
                  FuenteFinanciacion: iterador.DisponibilidadApropiacion.FuenteFinanciamiento
                };
                financieraRequest.post('registro_presupuestal/SaldoRp', rpData
              ).then(function(response) {
                iterador.Saldo = response.data.saldo;
                //se hace solicitud en este framento para obtener el saldo del rubro
                financieraRequest.get('concepto',
                $.param({
                  query: "Rubro.Id:" + iterador.DisponibilidadApropiacion.Apropiacion.Rubro.Id,
                  limit: 0
                })
              ).then(function(response) {
                if(response.data === null){
                  self.hayData = false;
                  self.cargando = false;
                }else{
                  self.hayData = true;
                  self.cargando = false;
                  self.gridOptions_conceptos.data = response.data;
                }


              });
              //se incluye consulta para obtener saldo en el objeto
            });
          }); // iterador
        }
      }); //tehen
    });
  }
}

},true); // watch

// fin
},
controllerAs: 'd_rubrosPorRpSeleccionMultiple'
};
});
