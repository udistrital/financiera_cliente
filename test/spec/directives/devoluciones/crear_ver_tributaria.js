'use strict';

describe('Directive: devoluciones/crearVerTributaria', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<devoluciones/crear-ver-tributaria></devoluciones/crear-ver-tributaria>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the devoluciones/crearVerTributaria directive');
  }));
});
