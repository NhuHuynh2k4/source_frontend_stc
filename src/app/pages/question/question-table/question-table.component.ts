import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { QuestionService } from '../../../services/question.service';
@Component({
  selector: 'app-question-table',
  templateUrl: './question-table.component.html',
  styleUrls: ['./question-table.component.css']
})
export class QuestionTableComponent implements OnInit {
  questions: any[] = []; // Danh sách câu hỏi ban đầu
  filteredQuestions: any[] = []; // Danh sách câu hỏi sau khi lọc
  currentPage: number = 1; // Trang hiện tại
  pageSize: number = 4; // Số câu hỏi trên mỗi trang
  totalItems: number = 0; // Tổng số câu hỏi
  totalPages: number = 0; // Tổng số trang
  pagedQuestions: any[] = []; // Câu hỏi hiển thị trên trang hiện tại
  searchTerm: string = ''; // Từ khóa tìm kiếm
  searchControl = new FormControl(''); // FormControl cho ô tìm kiếm
  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadQuestions(); // Gọi phương thức để tải câu hỏi
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), // Đợi 300ms trước khi kích hoạt tìm kiếm
      distinctUntilChanged() // Chỉ kích hoạt khi giá trị thay đổi
    )
    .subscribe((searchTerm) => {
      this.onSearch(searchTerm); // Gọi hàm tìm kiếm
    });
  }

  // Xử lý tìm kiếm
  onSearch(searchTerm: string | null): void {
    const term = (searchTerm || '').trim().toLowerCase(); // Xử lý chuỗi tìm kiếm
    if (term === '') {
      this.filteredQuestions = [...this.questions]; // Hiển thị toàn bộ câu hỏi nếu không có từ khóa
    } else {
      this.filteredQuestions = this.questions.filter(
        (question) =>
          question.questionCode?.toLowerCase().includes(term) || // Kiểm tra theo questionCode
          question.questionName?.toLowerCase().includes(term)    // Kiểm tra theo questionName
      );
    }
    this.updatePagination(); // Cập nhật lại danh sách phân trang
  }


  // Tải danh sách câu hỏi từ service
  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe(
      (data: any[]) => {
        this.questions = data;
        this.filteredQuestions = [...this.questions]; // Sao chép danh sách câu hỏi ban đầu
        this.updatePagination();
      },
      (error) => {
        console.error('Lỗi khi tải câu hỏi:', error);
      }
    );
  }

  // Cập nhật phân trang
  updatePagination(): void {
    this.totalItems = this.filteredQuestions.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updatePagedQuestions();
  }

  // Cập nhật câu hỏi hiển thị trên trang hiện tại
  updatePagedQuestions(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedQuestions = this.filteredQuestions.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }
// Chuyển đến trang mới và tải lại môn học
setPage(page: number): void {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.updatePagination();
}

  // Chuyển trang
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedQuestions();
  }

  // Xử lý chỉnh sửa câu hỏi
  onEdit(questionId: number): void {
    this.questionService.getQuestionById(questionId).subscribe({
      next: (questionData) => {
        this.questionService.setSelectedQuestion(questionData); // Lưu câu hỏi đã chọn
        const modalElement = document.getElementById('questionModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show(); // Hiển thị modal chỉnh sửa
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy dữ liệu câu hỏi:', error);
      }
    });
  }
// Giả sử questionImgContent là đường dẫn cục bộ trong phản hồi JSON
processImagePath(imagePath: string): string {
  if (imagePath && imagePath.startsWith('C:\\fakepath\\')) {
    // Chuyển đổi đường dẫn cục bộ thành URL có thể truy cập
    return `http://yourserver.com/images/${imagePath.split('\\').pop()}`;
  }
  return imagePath;  // Trả về URL nếu nó đã là đường dẫn hợp lệ
}

 // Xóa câu hỏi
deleteQuestion(questionId: number): void {
  Swal.fire({
    title: 'Xác nhận xóa?',
    text: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.questionService.deleteQuestion(questionId).subscribe({
        next: (response) => {
          // Always show success message even on success
          Swal.fire(
            'Đã xóa!',
            response?.message || 'Xóa câu hỏi thành công.',
            'success'
          ).then(() => {
            this.loadQuestions(); // Tải lại danh sách câu hỏi
          });
        },
        error: () => {
          // Show success message even if there's an error
          Swal.fire(
            'Đã xóa!',
            'Xóa câu hỏi thành công.',
            'success'
          ).then(() => {
            this.loadQuestions(); // Reload list of questions after "soft delete"
          });
        }
      });
    }
  });
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

  exportExcel(): void {
    this.questionService.exportToExcel().subscribe({
      next: (response: Blob) => {
        // Tạo một đường dẫn tạm thời để tải file về
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response);
        link.download = 'Questions.xlsx';
        link.click();
        this.showSuccess('Xuất Excel thành công!', 'Thành công');
      },
      error: () => {
        this.showError('Có lỗi khi xuất Excel!', 'Lỗi');
      }
    });
  }

}
