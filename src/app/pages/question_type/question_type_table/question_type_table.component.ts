import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuestionTypeService } from '../../../services/questionType.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-question-type-table',
  templateUrl: './question_type_table.component.html',
  styleUrls: ['./question_type_table.component.css']
})
export class QuestionTypeTableComponent implements OnInit {
  questionTypeForm!: FormGroup;
  isUpdate: boolean = false;
  questionTypes: any[] = [];
  selectedQuestionType: any;

  constructor(
    private questionTypeService: QuestionTypeService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {
    // Khởi tạo form
    this.questionTypeForm = this.fb.group({
      questionTypeCode: [''],
      questionTypeName: ['']
    });
  }

  ngOnInit(): void {
    this.fetchQuestionTypes();
    console.log(this.questionTypes);
  }

  // Lấy danh sách tất cả loại câu hỏi
  fetchQuestionTypes(): void {
    this.questionTypeService.getQuestionType().subscribe(
      (data) => {
        this.questionTypes = data;
        console.log('Question Types data:', data);
      },
      (error) => {
        console.error('Error fetching question types:', error);
      }
    );
  }

  // Chỉnh sửa loại câu hỏi
  onEdit(questionTypeID: number): void {
    this.questionTypeService.getQuestionTypeById(questionTypeID).subscribe({
      next: (data) => {
        this.selectedQuestionType = data;
        this.questionTypeService.setSelectedQuestionType(data); // Sử dụng service để đặt dữ liệu
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin loại câu hỏi:', error);
      }
    });
  }

  // Cập nhật loại câu hỏi
  onUpdate(): void {
    if (this.questionTypeForm.valid) {
      this.questionTypeService.updateQuestionType(this.questionTypeForm.value).subscribe(
        (response) => {
          this.showSuccess('Cập nhật thành công!', 'Thành công');
          this.fetchQuestionTypes(); // Tải lại danh sách loại câu hỏi
          this.closeModal();
        },
        (error) => {
          this.showError('Cập nhật thất bại!', 'Lỗi');
          console.error('Lỗi khi cập nhật loại câu hỏi:', error);
        }
      );
    }
  }

  // Đóng modal
  closeModal(): void {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  // Hiển thị thông báo thành công
  showSuccess(message: string, title: string): void {
    this.toastrService.success(message, title);
  }

  // Hiển thị thông báo lỗi
  showError(message: string, title: string): void {
    this.toastrService.error(message, title);
  }

  // Xóa loại câu hỏi
  deleteQuestionType(questionTypeID: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa loại câu hỏi này không?')) {
      this.questionTypeService.deleteQuestionType(questionTypeID).subscribe(
        (response) => {
          this.showSuccess('Xóa thành công!', 'Thành công');
          this.questionTypes = this.questionTypes.filter(item => item.questionTypeID !== questionTypeID);
        },
        (error) => {
          this.showError('Xóa thất bại!', 'Lỗi');
          console.error('Lỗi khi xóa loại câu hỏi:', error);
        }
      );
    }
  }
}
