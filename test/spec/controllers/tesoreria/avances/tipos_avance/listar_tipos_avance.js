'use strict';

describe('Controller: TesoreriaAvancesTiposAvanceListarTiposAvanceCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesTiposAvanceListarTiposAvanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesTiposAvanceListarTiposAvanceCtrl = $controller('TesoreriaAvancesTiposAvanceListarTiposAvanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesTiposAvanceListarTiposAvanceCtrl.awesomeThings.length).toBe(3);
  });
});
