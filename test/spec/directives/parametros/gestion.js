'use strict';

describe('Directive: parametros/gestion', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<parametros/gestion></parametros/gestion>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the parametros/gestion directive');
  }));
});
