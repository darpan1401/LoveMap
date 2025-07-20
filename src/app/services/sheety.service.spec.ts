import { TestBed } from '@angular/core/testing';

import { SheetyService } from './sheety.service';

describe('SheetyService', () => {
  let service: SheetyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheetyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
