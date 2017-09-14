'use strict';

/**
 * @ngdoc controller
 * @name financieraClienteApp.controller:RubroRubroRegistroCtrl
 * @alias Registro de Rubros
 * @requires $scope
 * @requires financieraService.service:financieraRequest
 * @param {service} financieraRequest Servicio para el API de financiera {@link financieraService.service:financieraRequest financieraRequest}
 * @description
 * # RubroRubroRegistroCtrl
 * Controlador para el registro de rubros presupuestales.
 *
 *
 */
angular.module('financieraClienteApp')
  .controller('RubroRubroRegistroCtrl', function (financieraRequest,uiGridService,$translate) {
    var self = this;
    
    financieraRequest.get('entidad','limit=0').then(function (response) {
      self.entidadOptions = response.data;
      });

      self.selectEntidad=null;
    self.quitar_padre = function() {
      self.padre = undefined;
      self.tipo_plan_hijo = '';
      self.codigo_hijo = '';
      self.descripcion_hijo='';
      self.selectEntidad=null;

    };

      /**
     * @ngdoc function
     * @name financieraClienteApp.controller:RubroRubroRegistroCtrl#registrar_rubro
     * @methodOf financieraClienteApp.controller:RubroRubroRegistroCtrl
     * @description Se encarga de consumir el servicio {@link financieraService.service:financieraRequest financieraRequest}
     * y registrar los datos de un rubro, ya sea como cabeza de rama o como hoja de una rama existente.
     */
      self.registrar_rubro = function() {
        if (self.padre === undefined || self.padre.UnidadEjecutora === ''){
          swal("", $translate.instant("E_RB003"),"error");
        }else if (self.codigo_hijo === '' || self.codigo_hijo === undefined){
          swal("", $translate.instant("E_RB001"),"error");
        }else if (self.descripcion_hijo === '' || self.descripcion_hijo === undefined){
          swal("", $translate.instant("E_RB002"),"error");
        }else if (self.selectEntidad === null){
          swal("", $translate.instant("E_RB004"),"error");
        }else{
          var codigo_rubro = "";
          var id_hijo = 0;
          var rubro_padre;
  
  
          if( self.padre.Codigo === undefined){
            codigo_rubro = codigo_rubro + self.codigo_hijo;
          }else{
            codigo_rubro = codigo_rubro + self.padre.Codigo + "-" + self.codigo_hijo;
  
              rubro_padre= {
                    Id : parseInt(self.padre.Id)
                };
  
          }
          var entidad = {
                Id: parseInt(self.selectEntidad)
            };
          var rubro_hijo = {
                Vigencia: 0,
                Entidad: entidad,
                Nombre: self.nombre_hijo,
                Codigo: codigo_rubro,
                Descripcion: self.descripcion_hijo,
                UnidadEjecutora: parseInt(self.padre.UnidadEjecutora),
                Estado: 1
            };
            console.log(rubro_hijo);
           if(self.padre.Codigo != undefined){
              var rubro_rubro = {
                    RubroPadre : rubro_padre,
                    RubroHijo: rubro_hijo
                  }
                  console.log("Valor a Registrar###############");
                  console.log(rubro_rubro);
              financieraRequest.post('rubro_rubro', rubro_rubro).then(function(response) {
                if (response.data.Type !== undefined){
                  if (response.data.Type === "error"){
                    swal('',$translate.instant(response.data.Code),response.data.Type);
                  }else{
                    swal('',$translate.instant(response.data.Code)+": "+response.data.Body.RubroHijo.Codigo+":"+response.data.Body.RubroHijo.Descripcion,response.data.Type);
                    self.filtro_rubro = ""+response.data.Body.RubroHijo.Descripcion;
                    self.recarga_arbol = !self.recarga_arbol;
                  }
    
                }
                console.log(response.data);
                   });;
  
           }else{
             console.log(rubro_hijo);
              financieraRequest.post("rubro", rubro_hijo).then(function(response) {
                if (response.data.Type !== undefined){
                  if (response.data.Type === "error"){
                    swal('',$translate.instant(response.data.Code),response.data.Type);
                  }else{
                    swal('',$translate.instant(response.data.Code)+": "+response.data.Body.Codigo+":"+response.data.Body.Descripcion,response.data.Type);
                    self.filtro_rubro = ""+response.data.Body.Descripcion;
                    self.recarga_arbol = !self.recarga_arbol;
                  }
                  
                }
              console.log(response.data);
            });;
           }
        }
        

        };
  });
