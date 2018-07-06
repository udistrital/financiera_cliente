'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:CompromisosCrearCompromisoCtrl
 * @description
 * # CompromisosCrearCompromisoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.controller('crearCompromisoCtrl', function (financieraRequest, $translate, $scope) {
  var self = this;

  self.nueva_categoria={};
  self.nuevo_compromiso={};
  self.nuevo_tipo={};
  //self.unidades_ejecutoras=[];

  self.cargar_estado_nuevo_compromiso=function(){
    financieraRequest.get("estado_compromiso",$.param({
      sortby: "Id",
      order: "asc",
      limit:1,
      query:"Nombre:Pendiente"
    })).then(function(response){
      self.nuevo_estado_compromiso=response.data[0];
    });
  };

  self.cargar_estado_nuevo_compromiso();


  self.crear_categoria=function(){

    var validar_campos =self.validateFieldsCategoria();
    if(validar_campos != false){

    swal({
      title: '¡'+$translate.instant('NUEVA_CATEGORIA')+'!',
      text: $translate.instant('DESEA_CREAR_CATEGORIA'),
      type: 'info',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
      cancelButtonText: $translate.instant('BTN.CANCELAR'),
      buttonsStyling: false
    }).then(function() {

      var categoria = {
        Nombre:self.nueva_categoria.Nombre,
        Descripcion: self.nueva_categoria.Descripcion
      }

      financieraRequest.post('categoria_compromiso',categoria).then(function(response){

        if (response.data.Type=='success') {
          swal($translate.instant(response.data.Code),$translate.instant("CATEGORIA")+" "+response.data.Body, response.data.Type);
          self.nueva_categoria={};
          self.cargar_categoriasc=!self.cargar_categoriasc;
          self.cargar_categorias=!self.cargar_categorias;
        } else {
          swal("",$translate.instant(response.data.Code), response.data.Type);
        }
      });
    });
  }
  };

  self.crear_tipo=function(){

    var validar_campos =self.validateFieldsTipo();
    if(validar_campos != false){
    swal({
      title: '¡'+$translate.instant('NUEVO_TIPO_COMPROMISO')+'!',
      text:  $translate.instant('DESEA_CREAR_TIPO_COMPROMISO'),
      type: 'info',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
      cancelButtonText: $translate.instant('BTN.CANCELAR'),
      buttonsStyling: false
    }).then(function() {

    var tipo = {
      Nombre: self.nuevo_tipo.Nombre,
      Activo: true,
      CategoriaCompromiso: self.nuevo_tipo.CategoriaCompromiso,
      Descripcion: self.nuevo_tipo.Descripcion,
      CodigoAbreviacion: self.nuevo_tipo.CodigoAbreviacion
    }

      financieraRequest.post('tipo_compromiso_tesoral',tipo).then(function(response){

        if (response.data.Type=='success') {
          swal($translate.instant(response.data.Code),$translate.instant("TIPO_COMPROMISO")+" "+response.data.Body, response.data.Type);
          self.nuevo_tipo={};
          self.cargar_categoriasc=!self.cargar_categoriasc;
          self.cargar_categorias=!self.cargar_categorias;
        } else {
          swal("",$translate.instant(response.data.Code), response.data.Type);
        }
      });
    });

  }
  };



  self.crear_compromiso=function(){

      var validar_campos =self.validateFieldsCompromiso();
      if(validar_campos != false){

    swal({
      title: '¡'+$translate.instant('NUEVO_COMPROMISO')+'!',
      text: $translate.instant('DESEA_CREAR_COMPROMISO'),
      type: 'info',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
      cancelButtonText: $translate.instant('BTN.CANCELAR'),
      buttonsStyling: false
    }).then(function() {
      var compromiso = {
        Objeto: self.nuevo_compromiso.Objeto,
        Vigencia: self.nuevo_compromiso.Vigencia,
        FechaInicio:self.nuevo_compromiso.FechaInicio,
        FechaFin:self.nuevo_compromiso.FechaFin,
        FechaModificacion:new Date(),
        EstadoCompromiso:self.nuevo_estado_compromiso,
        TipoCompromisoTesoral:self.nuevo_compromiso.TipoCompromisoTesoral,
        UnidadEjecutora:1  //CAMBIAR CON AUTENTICACION
      }
      financieraRequest.post('compromiso',compromiso).then(function(response){
        //console.log(response.data);
        swal($translate.instant(response.data.Code),$translate.instant("COMPROMISO")+" "+$translate.instant("NO")+response.data.Body, response.data.Type);
        if (response.data.Type=='success') {
          self.nuevo_compromiso={};
        } else {
          swal("",$translate.instant(response.data.Code), response.data.Type);
        }
      });
    });
  }
  };

  self.validateFieldsCompromiso = function(){

    if($scope.compromiso_form.$invalid){
      angular.forEach($scope.compromiso_form.$error,function(controles,error){
        angular.forEach(controles,function(control){
          control.$setDirty();
        });
      });

    return false;

    }

  }

  self.validateFieldsTipo = function(){

    if($scope.tipo_form.$invalid){
      angular.forEach($scope.tipo_form.$error,function(controles,error){
        angular.forEach(controles,function(control){
          control.$setDirty();
        });
      });

    return false;

    }


  }

  self.validateFieldsCategoria = function(){

    if($scope.categoria_form.$invalid){
      angular.forEach($scope.categoria_form.$error,function(controles,error){
        angular.forEach(controles,function(control){
          control.$setDirty();
        });
      });

    return false;

    }

  }
  /*self.cargar_unidades_ejecutoras=function(){
    financieraRequest.get("unidad_ejecutora",$.param({
      sortby: "Id",
      order: "asc",
      limit:0
    })).then(function(response){
      self.unidades_ejecutoras=response.data;
    });
  };*/

/*  self.cargar_estados_compromisos=function(){
    financieraRequest.get("estado_compromiso",$.param({
      sortby: "Id",
      order: "asc",
      limit:0
    })).then(function(response){
      self.estados_compromiso=response.data;
    });
  };*/

  //self.cargar_unidades_ejecutoras();
  //self.cargar_estados_compromisos();
});
