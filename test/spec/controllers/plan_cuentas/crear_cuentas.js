'use strict';

describe('Controller: PlanCuentasCrearCuentasCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var PlanCuentasCrearCuentasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanCuentasCrearCuentasCtrl = $controller('PlanCuentasCrearCuentasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('Verifica que existan naturalezas y estas sean 2: debito y credito', function () {
    expect(PlanCuentasCrearCuentasCtrl.naturalezas.length).toBe(2);
  });

  it('Verifica que se cargue el plan maestro de la base de datos', function () {
    expect(PlanCuentasCrearCuentasCtrl.plan_maestro).toBeUndefined();
    PlanCuentasCrearCuentasCtrl.cargar_plan_maestro();
    expect(PlanCuentasCrearCuentasCtrl.plan_maestro).toBeDefined(); 
  });

});
