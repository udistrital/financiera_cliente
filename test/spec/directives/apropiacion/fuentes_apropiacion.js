'use strict';

describe('Directive: apropiacion/fuentesApropiacion', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<apropiacion/fuentes-apropiacion></apropiacion/fuentes-apropiacion>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the apropiacion/fuentesApropiacion directive');
  }));
});
