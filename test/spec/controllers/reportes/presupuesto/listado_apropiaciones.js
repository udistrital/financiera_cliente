'use strict';

describe('Controller: ReportesPresupuestoListadoApropiacionesCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var ReportesPresupuestoListadoApropiacionesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportesPresupuestoListadoApropiacionesCtrl = $controller('ReportesPresupuestoListadoApropiacionesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportesPresupuestoListadoApropiacionesCtrl.awesomeThings.length).toBe(3);
  });
});
