'use strict';

describe('Controller: IngresosSinSituacionFondosRegistroCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var IngresosSinSituacionFondosRegistroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngresosSinSituacionFondosRegistroCtrl = $controller('IngresosSinSituacionFondosRegistroCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IngresosSinSituacionFondosRegistroCtrl.awesomeThings.length).toBe(3);
  });
});
