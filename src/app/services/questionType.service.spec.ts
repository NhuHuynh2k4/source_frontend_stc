import { TestBed } from '@angular/core/testing';

import { QuestionTypeService } from './questionType.service';

describe('QuestionTypeService', () => {
  let service: QuestionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
