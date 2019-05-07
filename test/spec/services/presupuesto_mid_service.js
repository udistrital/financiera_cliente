'use strict';

describe('Service: presupuestoMidService', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var presupuestoMidService;
  beforeEach(inject(function (_presupuestoMidService_) {
    presupuestoMidService = _presupuestoMidService_;
  }));

  it('should do something', function () {
    expect(!!presupuestoMidService).toBe(true);
  });

});
