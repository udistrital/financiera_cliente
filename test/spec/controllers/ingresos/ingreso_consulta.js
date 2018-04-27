'use strict';

describe('Controller: IngresosIngresoConsultaCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var IngresosIngresoConsultaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngresosIngresoConsultaCtrl = $controller('IngresosIngresoConsultaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IngresosIngresoConsultaCtrl.awesomeThings.length).toBe(3);
  });
});
