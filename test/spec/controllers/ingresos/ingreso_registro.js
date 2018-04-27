'use strict';

describe('Controller: IngresosIngresoRegistroCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var IngresosIngresoRegistroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngresosIngresoRegistroCtrl = $controller('IngresosIngresoRegistroCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IngresosIngresoRegistroCtrl.awesomeThings.length).toBe(3);
  });
});
