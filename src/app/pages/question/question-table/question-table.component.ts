import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../services/question.service'; // Đảm bảo đường dẫn chính xác

@Component({
  selector: 'app-question-table',
  templateUrl: './question-table.component.html',
  styleUrls: ['./question-table.component.css']
})
export class QuestionTableComponent implements OnInit {
  questions: any[] = [];

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe((data: any[]) => {
      this.questions = data;
    });
  }
}
