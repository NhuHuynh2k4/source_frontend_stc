import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TestService } from "../../../services/test.service";
import { SubjectService } from "../../../services/subject.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit, OnChanges {
  @Input() currentTest: any = null;  // Dữ liệu lớp học hiện tại
  @Output() formSubmit = new EventEmitter<void>();

  subjectsList: any[] = [];
  formData = {
    testID: '',
    testCode: '',
    testName: '',
    numberOfQuestions: '',
    subjectsID: '',
    updateDate: new Date(),
    createDate: new Date(),
    isDelete: false
  };

  submitted = false;

  constructor(private testService: TestService, private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.getSubjects();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentTest'] && this.currentTest) {
      this.formData = { ...this.currentTest }; // Gán dữ liệu chỉnh sửa
    } else {
      this.cancelEdit();
    }
  }

  // Lấy danh sách chủ đề từ API
  getSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      data => {
        this.subjectsList = data;
      },
      error => {
        console.error('Lỗi khi lấy danh sách chủ đề:', error);
      }
    );
  }

  // Xử lý gửi form
  onSubmit(): void {
    this.submitted = true; // Đánh dấu đã gửi form

    if (this.validateForm()) {
      if (this.formData.testID) {
        // Update test
        this.testService.updateTest(this.formData).subscribe(
          response => {
            console.log('Cập nhật bài kiểm tra thành công:', response);
            Swal.fire({
              title: 'Cập nhật thành công!',
              text: 'Bài kiểm tra đã được cập nhật thành công.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.formSubmit.emit();  // Phát sự kiện khi cập nhật thành công
          },
          error => {
            console.error('Lỗi khi cập nhật bài kiểm tra:', error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi cập nhật bài kiểm tra.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        // Add new test
        this.testService.addTest(this.formData).subscribe(
          response => {
            console.log('Thêm bài kiểm tra thành công:', response);
            Swal.fire({
              title: 'Thêm bài kiểm tra thành công!',
              text: 'Bài kiểm tra đã được thêm mới thành công.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.formSubmit.emit();  // Phát sự kiện khi thêm mới thành công
          },
          error => {
            console.error('Lỗi khi thêm bài kiểm tra:', error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi thêm bài kiểm tra.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    }
  }

  // Hàm kiểm tra hợp lệ các trường dữ liệu
  validateForm(): boolean {
    if (!this.formData.testCode.trim() || !this.formData.testName.trim() ||
      !this.formData.numberOfQuestions || !this.formData.subjectsID) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng điền đầy đủ tất cả các trường bắt buộc.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;  // Form không hợp lệ
    }

    // Kiểm tra định dạng classCode (bắt đầu bằng C và theo sau là các số)
    const classCodePattern = /^T\d+$/;
    if (!classCodePattern.test(this.formData.testCode)) {
      Swal.fire({
        title: 'Lỗi định dạng!',
        text: 'Mã bài kiểm tra phải bắt đầu bằng chữ "T" và theo sau là các số.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }

    // Kiểm tra độ dài className (tối thiểu 3 ký tự)
    if (this.formData.testName.trim().length <= 5) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Tên bài kiển tra phải có ít nhất 5 ký tự.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }

    // Kiểm tra độ dài session nu
    const sessionValue = Number(this.formData.numberOfQuestions);
    if (isNaN(sessionValue) || sessionValue <= 10) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Thông tin số lượng câu hỏi phải là số và lớn hơn 10.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }
    return true;  // Form hợp lệ
  }

  // Hủy thao tác chỉnh sửa
  cancelEdit(): void {
    this.formData = {
      testID: '',
      testCode: '',
      testName: '',
      numberOfQuestions: '',
      subjectsID: '',
      updateDate: new Date(),
      createDate: new Date(),
      isDelete: false
    };
    this.currentTest = null;
    this.submitted = false;
  }
}
