'use strict';

describe('Controller: TesoreriaAvancesTiposAvanceAgregarTipoAvanceCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesTiposAvanceAgregarTipoAvanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesTiposAvanceAgregarTipoAvanceCtrl = $controller('TesoreriaAvancesTiposAvanceAgregarTipoAvanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesTiposAvanceAgregarTipoAvanceCtrl.awesomeThings.length).toBe(3);
  });
});
