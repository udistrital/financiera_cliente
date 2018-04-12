'use strict';

describe('Controller: BancosSaldosInicialesCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var BancosSaldosInicialesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BancosSaldosInicialesCtrl = $controller('BancosSaldosInicialesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BancosSaldosInicialesCtrl.awesomeThings.length).toBe(3);
  });
});
