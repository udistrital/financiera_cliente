'use strict';

describe('Controller: IngresosSinSituacionFondosConsultaCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var IngresosSinSituacionFondosConsultaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngresosSinSituacionFondosConsultaCtrl = $controller('IngresosSinSituacionFondosConsultaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IngresosSinSituacionFondosConsultaCtrl.awesomeThings.length).toBe(3);
  });
});
