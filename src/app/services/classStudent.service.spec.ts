import { TestBed } from '@angular/core/testing';

import { ClassStudentService } from './classStudent.service';

describe('ClassStudentService', () => {
  let service: ClassStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
