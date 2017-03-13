"use strict";

/**
 * @ngdoc function
 * @name financieraClienteApp.decorator:TextTranslate
 * @description
 * # TextTranslate
 * Decorator of the financieraClienteApp
 */

angular.module('financieraClienteApp')
.config(function ($translateProvider) {
    $translateProvider
    .translations("es", {
      TITULO: "GENERATOR-OAS",
      MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
      NOTIFICACION_PENDIENTE:"Notificaciones Pendientes",
      NOTIFICACION_VISTA:"Notificaciones Vistas",
      FILTRO_NOTIFICACION:"Filtrar notificación"
    })
    .translations("en", {
      TITULO: "GENERATOR-OAS",
      MENSAJE_INICIAL: "Now get to start to develop"
    });
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
});
