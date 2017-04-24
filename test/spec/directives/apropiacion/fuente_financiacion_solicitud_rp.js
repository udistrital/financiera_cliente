'use strict';

describe('Directive: apropiacion/fuenteFinanciacionSolicitudRp', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<apropiacion/fuente-financiacion-solicitud-rp></apropiacion/fuente-financiacion-solicitud-rp>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the apropiacion/fuenteFinanciacionSolicitudRp directive');
  }));
});
