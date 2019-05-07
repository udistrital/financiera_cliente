'use strict';

describe('Service: presupuestoService', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var presupuestoService;
  beforeEach(inject(function (_presupuestoService_) {
    presupuestoService = _presupuestoService_;
  }));

  it('should do something', function () {
    expect(!!presupuestoService).toBe(true);
  });

});
