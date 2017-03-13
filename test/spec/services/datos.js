'use strict';

describe('Service: datos', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var datos;
  beforeEach(inject(function (_datos_) {
    datos = _datos_;
  }));

  it('should do something', function () {
    expect(!!datos).toBe(true);
  });

});
