'use strict';

describe('Directive: avances/legalizacionPracticaVe', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<avances/legalizacion-practica-ve></avances/legalizacion-practica-ve>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the avances/legalizacionPracticaVe directive');
  }));
});
