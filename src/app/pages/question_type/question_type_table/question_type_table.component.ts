import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuestionTypeService } from '../../../services/questionType.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

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

  paginatedQuestionType: any[] = [];
  rowsPerPageOptions: number[] = [5, 10, 15, 20];
  rowsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = []; 

  searchText: string = '';

  constructor(
    private questionTypeService: QuestionTypeService,
    private fb: FormBuilder
  ) {
    this.questionTypeForm = this.fb.group({
      questionTypeCode: [''],
      questionTypeName: ['']
    });
  }

  ngOnInit(): void {
    this.fetchQuestionTypes();
    this.calculatePagination();
  }

  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase(); // Lấy giá trị tìm kiếm và chuyển về chữ thường
    this.searchText = inputValue;
    this.filterClassStudents();
  }
  
  filterClassStudents(): void {
    if (this.searchText) {
      this.paginatedQuestionType = this.questionTypes.filter((item) => {
        const questionTypeCode = item.questionTypeCode?.toString().toLowerCase() || '';
        const questionTypeName = item.questionTypeName?.toString().toLowerCase() || '';
        
        // So sánh giá trị tìm kiếm với ClassID, StudentID hoặc Ngày tạo
        return (
          questionTypeCode.includes(this.searchText) ||
          questionTypeName.includes(this.searchText)
        );
      });
    } else {
      this.calculatePagination(); // Nếu không nhập gì, hiển thị lại dữ liệu đầy đủ
    }
  }

  fetchQuestionTypes(): void {
    this.questionTypeService.getQuestionType().subscribe(
      (data) => {
        this.questionTypes = data;
        this.calculatePagination();
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách loại câu hỏi:', error);
      }
    );
  }

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

  onUpdate(): void {
    if (this.questionTypeForm.valid) {
      this.questionTypeService.updateQuestionType(this.questionTypeForm.value).subscribe(
        (response) => {
          this.showSuccess('Cập nhật thành công!', 'Thành công');
          this.fetchQuestionTypes();
          this.closeModal();
        },
        (error) => {
          this.showError('Cập nhật thất bại!', 'Lỗi');
          console.error('Lỗi khi cập nhật loại câu hỏi:', error);
        }
      );
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  showSuccess(message: string, title: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true
    });
  }

  showError(message: string, title: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true
    });
  }

  deleteQuestionType(questionTypeID: number): void {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Thao tác này sẽ xóa loại câu hỏi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.questionTypeService.deleteQuestionType(questionTypeID).subscribe(
          (response) => {
            this.showSuccess('Xóa thành công!', 'Thành công');
            this.questionTypes = this.questionTypes.filter(item => item.questionTypeID !== questionTypeID);
            this.fetchQuestionTypes();
          },
          (error) => {
            this.showError('Xóa thất bại!', 'Lỗi');
            console.error('Lỗi khi xóa loại câu hỏi:', error);
          }
        );
      }
    });
  }
  
  exportExcel(): void {
    this.questionTypeService.exportToExcel().subscribe({
      next: (response: Blob) => {
        // Tạo một đường dẫn tạm thời để tải file về
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response);
        link.download = 'ClassStudents.xlsx';
        link.click();
        this.showSuccess('Xuất Excel thành công!', 'Thành công');
      },
      error: () => {
        this.showError('Có lỗi khi xuất Excel!', 'Lỗi');
      }
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.questionTypes.length / this.rowsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    const dataToPaginate = this.searchText ? this.paginatedQuestionType : this.questionTypes;
    this.paginatedQuestionType = this.questionTypes.slice(startIndex, endIndex);
  }

  onRowsPerPageChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.rowsPerPage = +selectedValue;
    this.currentPage = 1;
    this.calculatePagination();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
}
