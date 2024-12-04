import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { SubjectService } from '../../../services/subject.service';
declare var bootstrap: any;
@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.css']
})
export class SubjectTableComponent implements OnInit {
  subjectForm!: FormGroup;
  isUpdate: boolean = false;
  subjects: any[] = [];
  selectedSubject: any;
  searchControl = new FormControl(''); // FormControl cho ô tìm kiếm
  // Phân trang
  currentPage: number = 1;  // Trang hiện tại
  pageSize: number = 5;     // Số lớp trên mỗi trang
  totalItems: number = 0;   // Tổng số lớp học
  totalPages: number = 0;   // Tổng số trang
  currentSubjects: any[] = [];  // Dữ liệu môn học trên trang hiện tại
  searchTerm: string = ''; // Lưu trữ từ khóa tìm kiếm
  filteredSubjects: any[] = []; // Môn học sau khi lọc

  constructor(private subjectService: SubjectService, private fb: FormBuilder) {
    this.subjectForm = this.fb.group({
      subjectsID: [''],
      subjectsCode: [''],
      subjectsName: ['']
    });
  }

  ngOnInit(): void {
    this.fetchSubjects();  // Fetch subjects when component initializes
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), // Đợi 300ms trước khi kích hoạt tìm kiếm
      distinctUntilChanged() // Chỉ kích hoạt khi giá trị thay đổi
    )
    .subscribe((searchTerm) => {
      this.onSearch(searchTerm); // Gọi hàm tìm kiếm
    });


  }

// Fetch subjects for the current page
fetchSubjects(): void {
  this.subjectService.getAllSubjects().subscribe(
    (data) => {
      this.subjects = data; // Toàn bộ danh sách môn học
      this.filteredSubjects = [...this.subjects]; // Sao chép danh sách ban đầu để tìm kiếm
      this.totalItems = this.filteredSubjects.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.updatePagedSubjects();
      console.log('Fetched Subjects:', this.subjects); // Kiểm tra dữ liệu
    },
    (error) => {
      console.error('Error fetching subjects:', error);
    }
  );
}

  // Cập nhật phân trang và danh sách hiển thị
  updatePagination(): void {
    this.totalItems = this.filteredSubjects.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    this.updatePagedSubjects();
  }

  // Cập nhật các môn học trên trang hiện tại

  updatePagedSubjects(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.currentSubjects = this.filteredSubjects.slice(startIndex, startIndex + this.pageSize);
  }

  get pagedSubjects(): any[] {
    return this.currentSubjects; // Hiển thị danh sách hiện tại
  }



  // Chuyển đến trang mới và tải lại môn học
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  // Edit subject by subjectID
  onEdit(subjectID: number): void {
    this.subjectService.getSubjectById(subjectID).subscribe({
      next: (subjectData) => {
        this.subjectService.setSelectedSubject(subjectData); // Set selected subject
        const modalElement = document.getElementById('subjectModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();  // Show modal for editing subject
        }
      },
      error: (error) => {
        console.error('Error fetching subject data:', error);
      }
    });
  }
  onSearch(searchTerm: string | null): void {
    const term = (searchTerm || '').trim().toLowerCase();
    if (term === '') {
      // Nếu không có từ khóa tìm kiếm, hiển thị toàn bộ danh sách
      this.filteredSubjects = [...this.subjects];
    } else {
      // Tìm kiếm môn học khớp từ khóa
      this.filteredSubjects = this.subjects.filter(
        (subject) =>
          subject.subjectsCode.toLowerCase().includes(term) ||
          subject.subjectsName.toLowerCase().includes(term)
      );
    }
    console.log('Filtered Subjects:', this.filteredSubjects); // Kiểm tra kết quả
    this.updatePagination(); // Cập nhật danh sách phân trang
  }



  // Delete subject
  deleteSubject(subjectId: number): void {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc chắn muốn xóa môn học này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjectService.deleteSubject(subjectId).subscribe({
          next: (response) => {
            Swal.fire('Đã xóa!', response?.message || 'Xóa môn học thành công.', 'success').then(() => {
              this.fetchSubjects();  // Reload subjects after deletion
            });
          },
          error: (error) => {
            Swal.fire('Đã xóa!', error.error?.message || 'Xóa môn học thành công ', 'success').then(() => {
              this.fetchSubjects();  // Reload subjects after deletion
            });
          }
        });
      }
    });
  }

  // Change the current page and fetch corresponding subjects
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchSubjects();  // Fetch the subjects for the new page
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
    this.subjectService.exportToExcel().subscribe({
      next: (response: Blob) => {
        // Tạo một đường dẫn tạm thời để tải file về
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response);
        link.download = 'Subjects.xlsx';
        link.click();
        this.showSuccess('Xuất Excel thành công!', 'Thành công');
      },
      error: () => {
        this.showError('Có lỗi khi xuất Excel!', 'Lỗi');
      }
    });
  }
}
