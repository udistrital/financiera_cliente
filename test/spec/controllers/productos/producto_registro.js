'use strict';

describe('Controller: ProductosProductoRegistroCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var ProductosProductoRegistroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductosProductoRegistroCtrl = $controller('ProductosProductoRegistroCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductosProductoRegistroCtrl.awesomeThings.length).toBe(3);
  });
});
