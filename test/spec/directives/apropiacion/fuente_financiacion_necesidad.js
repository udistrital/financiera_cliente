'use strict';

describe('Directive: apropiacion/fuenteFinanciacionNecesidad', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<apropiacion/fuente-financiacion-necesidad></apropiacion/fuente-financiacion-necesidad>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the apropiacion/fuenteFinanciacionNecesidad directive');
  }));
});
