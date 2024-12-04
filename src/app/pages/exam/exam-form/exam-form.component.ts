import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ExamService} from "../../../services/exam.service";
import {TestService} from "../../../services/test.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit,OnChanges{
  @Input() currentExam: any = null;  // Dữ liệu kì thi hiện tại
  @Output() formSubmit = new EventEmitter<void>();

  testsList: any[] = [];
  formData = {
    examID: '',
    examCode: '',
    examName: '',
    examDate: '',
    duration:'',
    numberOfQuestions: '',
    totalMarks: '',
    testID: '',
    updateDate: new Date(),
    createDate: new Date(),
    isDelete: false
  };

  submitted = false;

  constructor(private examService: ExamService, private testService: TestService) {}

  ngOnInit(): void {
    this.getTests();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentExam'] && this.currentExam) {
      this.formData = { ...this.currentExam }; // Gán dữ liệu chỉnh sửa
    } else {
      this.cancelEdit();
    }
  }

  // Lấy danh sách chủ đề từ API
  getTests(): void {
    this.testService.getTests().subscribe(
      data => {
        this.testsList = data;
      },
      error => {
        console.error('Lỗi khi lấy danh sách chủ đề:', error);
      }
    );
  }

  // Xử lý gửi form
  onSubmit(): void {
    this.submitted = true;
    if (this.validateForm()) {  // Kiểm tra hợp lệ trước khi gửi
      if (this.formData.examID) {
        this.examService.updateExam(this.formData).subscribe(
          response => {
            Swal.fire({
              title: 'Cập nhật thành công!',
              text: 'Kì thi đã được cập nhật thành công.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.formSubmit.emit();   // Phát sự kiện khi cập nhật thành công
          },
          error => {
            Swal.fire({
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi cập nhật kì thi.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      } else {
        this.examService.addExam(this.formData).subscribe(
          response => {
            Swal.fire({
              title: 'Thêm kì thi thành công!',
              text: 'Kì thi đã được thêm mới thành công.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.formSubmit.emit();  // Phát sự kiện khi thêm mới thành công
          },
          error => {
            Swal.fire({
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi thêm kì thi.',
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
    if (!this.formData.examCode.trim() ||
      !this.formData.examName.trim() ||
      !this.formData.examDate ||
      !this.formData.duration ||
      !this.formData.numberOfQuestions ||
      !this.formData.totalMarks ||
      !this.formData.testID) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng điền đầy đủ tất cả các trường bắt buộc.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;  // Form không hợp lệ
    }
    return true;  // Form hợp lệ
  }


  // Hủy thao tác chỉnh sửa
  cancelEdit(): void {
    this.formData = {
      examID: '',
      examCode: '',
      examName: '',
      examDate: '',
      duration:'',
      numberOfQuestions: '',
      totalMarks: '',
      testID: '',
      updateDate: new Date(),
      createDate: new Date(),
      isDelete: false
    };
    this.submitted = false;
    this.currentExam = null;
  }
}
