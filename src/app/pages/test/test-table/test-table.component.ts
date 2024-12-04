import {Component, OnInit} from '@angular/core';
import { TestService } from "../../../services/test.service";
import {AuthService} from "../../../services/auth.service";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: 'app-test-table',
  templateUrl: './test-table.component.html',
  styleUrls: ['./test-table.component.css']
})
export class TestTableComponent implements OnInit {
  tests: any[] = [];
  currentTest: any = null;
  testModal: any;

  // Thêm thuộc tính tìm kiếm
  searchQuery: string = '';

  // Phân trang
  currentPage: number = 1;  // Trang hiện tại
  pageSize: number = 5;     // Số lớp trên mỗi trang
  totalItems: number = 0;   // Tổng số lớp học
  totalPages: number = 0;   // Tổng số trang

  constructor(private testService: TestService, private authService: AuthService) {}

  ngOnInit() {
    this.loadTests();
    this.testModal = new bootstrap.Modal(document.getElementById('testModal')!);
  }

  // Tải danh sách lớp học và tính toán phân trang
  loadTests(): void {
    this.testService.getTests().subscribe(
      data => {
        this.tests = data;
        this.totalItems = data.length;  // Tổng số lớp học
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);  // Tính tổng số trang
      },
      error => {
        console.error('Lỗi khi tải danh sách lớp:', error);
      }
    );
  }

  // Tính toán các lớp học cần hiển thị cho trang hiện tại
  get pagedTests(): any[] {
    const filteredClasses = this.tests.filter(testItem => {
      return testItem.testName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        testItem.testCode.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        testItem.subjectsName.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredClasses.slice(startIndex, startIndex + this.pageSize);
  }

  // Cập nhật trang hiện tại
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;  // Đảm bảo trang hợp lệ
    this.currentPage = page;
  }

  reloadTests() {
    this.loadTests(); // Cập nhật lại bảng sau khi thêm/cập nhật
    this.currentTest = null;
    this.testModal.hide();
  }

  editTest(selectedTest: any): void {
    this.currentTest = selectedTest ? { ...selectedTest } : null;
    this.testModal.show();
  }

  // Phương thức được gọi khi thay đổi giá trị tìm kiếm
  onSearch(): void {
    this.currentPage = 1;  // Đặt lại trang về trang đầu khi tìm kiếm mới
  }

  deleteTest(testId: number): void {
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
        this.testService.deleteTest(testId).subscribe(
          response => {
            Swal.fire(
              'Đã xóa!',
              'Lớp học đã được xóa thành công.',
              'success'
            );
            this.loadTests(); // Tải lại danh sách lớp học
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
    this.testService.exportToExcel().subscribe((blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob); // Tạo URL cho file

      a.href = objectUrl;
      a.download = 'Tests.xlsx'; // Tên file tải xuống
      a.click(); // Kích hoạt tải file

      URL.revokeObjectURL(objectUrl); // Giải phóng URL sau khi tải
    }, error => {
      console.error('Xuất Excel thất bại', error);
    });
  }
}
