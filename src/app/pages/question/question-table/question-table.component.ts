import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../services/question.service'; // Đảm bảo đường dẫn chính xác

@Component({
  selector: 'app-question-table',
  templateUrl: './question-table.component.html',
  styleUrls: ['./question-table.component.css']
})
export class QuestionTableComponent implements OnInit {
  questions: any[] = [];  // Mảng chứa danh sách câu hỏi

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadQuestions();  // Gọi phương thức để tải danh sách câu hỏi khi component được khởi tạo
  }

  // Tải danh sách câu hỏi từ service
  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe(
      (data: any[]) => {
        this.questions = data;  // Lưu danh sách câu hỏi vào biến questions
      },
      (error) => {
        console.error('Lỗi khi tải câu hỏi:', error);  // Xử lý lỗi khi không lấy được dữ liệu
      }
    );
  }

  // Xử lý sự kiện chỉnh sửa câu hỏi
  onEdit(questionId: number): void {
    this.questionService.getQuestionById(questionId).subscribe({
      next: (questionData) => {
        this.questionService.setSelectedQuestion(questionData);  // Lưu câu hỏi đã chọn vào service
        const modalElement = document.getElementById('questionModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();  // Hiển thị modal chỉnh sửa câu hỏi
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy dữ liệu câu hỏi:', error);  // Xử lý lỗi khi lấy dữ liệu câu hỏi
      }
    });
  }

  // Xóa câu hỏi
  deleteQuestion(questionId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
      this.questionService.deleteQuestion(questionId).subscribe({
        next: () => {
          console.log('Xóa câu hỏi thành công');
          this.loadQuestions();  // Tải lại danh sách câu hỏi sau khi xóa
        },
        error: (error) => {
          console.error('Lỗi khi xóa câu hỏi:', error);  // Xử lý lỗi khi xóa câu hỏi
        }
      });
    }
  }
}
