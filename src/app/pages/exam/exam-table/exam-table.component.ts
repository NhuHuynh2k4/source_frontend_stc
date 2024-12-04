import {Component, OnInit} from '@angular/core';
import { ExamService } from "../../../services/exam.service";
import {AuthService} from "../../../services/auth.service";
import * as bootstrap from 'bootstrap';
import Swal from "sweetalert2";
import {TestService} from "../../../services/test.service";

@Component({
  selector: 'app-exam-table',
  templateUrl: './exam-table.component.html',
  styleUrls: ['./exam-table.component.css']
})
export class ExamTableComponent implements OnInit{
  tests: any[] = [];
  exams: any[] = [];
  currentExam: any = null;
  examModal: any;

  searchQuery: string = "";

  // Phân trang
  currentPage: number = 1;  // Trang hiện tại
  pageSize: number = 5;     // Số lớp trên mỗi trang
  totalItems: number = 0;   // Tổng số lớp học
  totalPages: number = 0;   // Tổng số trang

  constructor(private examService: ExamService, private testService: TestService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadTest();
    this.examModal = new bootstrap.Modal(document.getElementById('examModal')!);
  }

  // Tải danh sách lớp học và tính toán phân trang
  loadExams(): void {
    this.examService.getExams().subscribe(
      data => {
        this.exams = data;
        this.totalItems = data.length;  // Tổng số lớp học
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);  // Tính tổng số trang
      },
      error => {
        console.error('Lỗi khi tải danh sách lớp:', error);
      }
    );
  }

  loadTest(): void {
    this.testService.getTests().subscribe(
      data => {
        this.tests = data;
      },
      error => {
        console.error('Lỗi khi tải danh sách môn học:', error);
      }
    );
  }

  // Xử lý sự kiện từ form sau khi thêm mới hoặc cập nhật thành công
  onActionComplete(): void {
    this.loadExams(); // Tải lại danh sách lớp học
    this.examModal.hide();
  }

  // Tính toán các lớp học cần hiển thị cho trang hiện tại
  get pagedExams(): any[] {
    const filteredClasses = this.exams.filter(classItem => {
      return classItem.examName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        classItem.examCode.toLowerCase().includes(this.searchQuery.toLowerCase()) ;
    });
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredClasses.slice(startIndex, startIndex + this.pageSize);
  }

  // Cập nhật trang hiện tại
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;  // Đảm bảo trang hợp lệ
    this.currentPage = page;
  }

  reloadExams() {
    this.loadExams(); // Cập nhật lại bảng sau khi thêm/cập nhật
    this.currentExam = null;
    this.examModal.hide();
  }

  editExam(selectedExam: any): void {
    this.currentExam = selectedExam ? { ...selectedExam } : null;
    this.examModal.show();
  }

  // Phương thức được gọi khi thay đổi giá trị tìm kiếm
  onSearch(): void {
    this.currentPage = 1;  // Đặt lại trang về trang đầu khi tìm kiếm mới
  }

  deleteExam(examId: number): void {
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
        this.examService.deleteExam(examId).subscribe(
          response => {
            Swal.fire(
              'Đã xóa!',
              'Lớp học đã được xóa thành công.',
              'success'
            );
            this.loadExams(); // Tải lại danh sách lớp học
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

// Hàm đối chiếu subjectsID với tên môn học từ danh sách môn học
  getTestName(testID: number): string {
    const test = this.tests.find(sub => sub.testID === testID); // Tìm môn học theo testsID
    return test ? test.testName : 'Môn học không tìm thấy'; // Nếu tìm thấy thì trả về tên, nếu không thì trả về thông báo lỗi
  }

  exportToExcel(): void {
    this.examService.exportToExcel().subscribe((blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob); // Tạo URL cho file

      a.href = objectUrl;
      a.download = 'Exams.xlsx'; // Tên file tải xuống
      a.click(); // Kích hoạt tải file

      URL.revokeObjectURL(objectUrl); // Giải phóng URL sau khi tải
    }, error => {
      console.error('Xuất Excel thất bại', error);
    });
  }
}

