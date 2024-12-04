import { Component, OnInit } from '@angular/core';
import { ClassService } from "../../../services/class.service";
import { AuthService } from "../../../services/auth.service";
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
  selector: 'app-class-table',
  templateUrl: './class-table.component.html',
  styleUrls: ['./class-table.component.css']
})
export class ClassTableComponent implements OnInit {
  classes: any[] = [];
  currentClass: any = null;
  classModal: any;

  // Thêm thuộc tính tìm kiếm
  searchQuery: string = '';

  // Phân trang
  currentPage: number = 1;  // Trang hiện tại
  pageSize: number = 5;     // Số lớp trên mỗi trang
  totalItems: number = 0;   // Tổng số lớp học
  totalPages: number = 0;   // Tổng số trang

  constructor(private classService: ClassService, private authService: AuthService) {}

  ngOnInit() {
    this.loadClasses();
    this.classModal = new bootstrap.Modal(document.getElementById('classModal')!);
  }

  // Tải danh sách lớp học và tính toán phân trang
  loadClasses(): void {
    this.classService.getClasses().subscribe(
      data => {
        this.classes = data;
        this.totalItems = data.length;  // Tổng số lớp học
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);  // Tính tổng số trang
      },
      error => {
        console.error('Lỗi khi tải danh sách lớp:', error);
      }
    );
  }

  // Tính toán các lớp học cần hiển thị cho trang hiện tại
  get pagedClasses(): any[] {
    const filteredClasses = this.classes.filter(classItem => {
      return classItem.className.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        classItem.classCode.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        classItem.subjectsName.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredClasses.slice(startIndex, startIndex + this.pageSize);
  }

  // Cập nhật trang hiện tại
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;  // Đảm bảo trang hợp lệ
    this.currentPage = page;
  }

  reloadClasses() {
    this.loadClasses(); // Cập nhật lại bảng sau khi thêm/cập nhật
    this.currentClass = null;
    this.classModal.hide();
  }

  editClass(selectedClass: any): void {
    this.currentClass = selectedClass ? { ...selectedClass } : null;
    this.classModal.show();
  }

  // Phương thức được gọi khi thay đổi giá trị tìm kiếm
  onSearch(): void {
    this.currentPage = 1;  // Đặt lại trang về trang đầu khi tìm kiếm mới
  }

  deleteClass(classId: number): void {
    if (!this.authService.isLoggedIn()) {
      Swal.fire('Lỗi', 'Bạn cần đăng nhập để thực hiện hành động này!', 'error');
      return; // Nếu chưa đăng nhập, dừng lại
    }

    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn chắc chắn muốn xóa lớp học này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.classService.deleteClass(classId).subscribe(
          response => {
            Swal.fire(
              'Đã xóa!',
              'Lớp học đã được xóa thành công.',
              'success'
            );
            this.loadClasses(); // Tải lại danh sách lớp học
          },
          error => {
            Swal.fire(
              'Lỗi!',
              'Đã xảy ra lỗi khi xóa lớp học.',
              'error'
            );
          }
        );
      }
    });
  }

  exportToExcel(): void {
    this.classService.exportToExcel().subscribe((blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob); // Tạo URL cho file

      a.href = objectUrl;
      a.download = 'Classes.xlsx'; // Tên file tải xuống
      a.click(); // Kích hoạt tải file

      URL.revokeObjectURL(objectUrl); // Giải phóng URL sau khi tải
    }, error => {
      console.error('Xuất Excel thất bại', error);
    });
  }
}
