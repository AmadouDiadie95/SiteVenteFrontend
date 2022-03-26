import { TestBed } from '@angular/core/testing';

import { TestDayGuard } from './test-day.guard';

describe('TestDayGuard', () => {
  let guard: TestDayGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TestDayGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
