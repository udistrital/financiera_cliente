'use strict';

describe('Controller: IngresosSinAtributosFondosConsultaCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var IngresosSinAtributosFondosConsultaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngresosSinAtributosFondosConsultaCtrl = $controller('IngresosSinAtributosFondosConsultaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IngresosSinAtributosFondosConsultaCtrl.awesomeThings.length).toBe(3);
  });
});
