'use strict';

describe('Directive: bancos/verBanco', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bancos/ver-banco></bancos/ver-banco>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bancos/verBanco directive');
  }));
});
