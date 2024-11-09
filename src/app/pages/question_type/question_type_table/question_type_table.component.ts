import { Component, OnInit } from '@angular/core';
import { QuestionTypeService } from '../../../services/questionType.service';

@Component({
  selector: 'app-question-type-table',
  templateUrl: './question_type_table.component.html',
  styleUrls: ['./question_type_table.component.css']
})
export class QuestionTypeTableComponent implements OnInit {
  questionTypes: any[] = [];

  constructor(private questionTypeService: QuestionTypeService) { }

  ngOnInit(): void {
    this.getQuestionTypes();
  }

  getQuestionTypes(): void {
    this.questionTypeService.getQuestionTypes().subscribe(
      data => this.questionTypes = data,
      error => console.error('Xảy ra lỗi khi nạp dữ liệu question type', error)
    );
  }
}
