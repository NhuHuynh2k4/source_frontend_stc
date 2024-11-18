import { TestBed } from '@angular/core/testing';

import { SubjectService } from './subject.service'; // Đảm bảo bạn import đúng SubjectService

describe('SubjectService', () => {
  let service: SubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
