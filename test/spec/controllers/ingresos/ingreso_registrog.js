'use strict';

describe('Controller: IngresosIngresoRegistrogCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var IngresosIngresoRegistrogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngresosIngresoRegistrogCtrl = $controller('IngresosIngresoRegistrogCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IngresosIngresoRegistrogCtrl.awesomeThings.length).toBe(3);
  });
});
