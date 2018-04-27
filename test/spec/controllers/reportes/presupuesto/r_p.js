'use strict';

describe('Controller: ReportesPresupuestoRPCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var ReportesPresupuestoRPCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportesPresupuestoRPCtrl = $controller('ReportesPresupuestoRPCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportesPresupuestoRPCtrl.awesomeThings.length).toBe(3);
  });
});
