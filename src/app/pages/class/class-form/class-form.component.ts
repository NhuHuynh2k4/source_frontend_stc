import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { ClassService } from "../../../services/class.service";
import { SubjectService } from "../../../services/subject.service";
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css']
})
export class ClassFormComponent implements OnInit,OnChanges {
  @Input() currentClass: any = null;  // Dữ liệu lớp học hiện tại
  @Output() formSubmit = new EventEmitter<void>();

  subjectsList: any[] = [];
  formData = {
    classID: '',
    classCode: '',
    className: '',
    session: '',
    subjectsID: '',
    updateDate: new Date(),
    createDate: new Date(),
    isDelete: false
  };

  submitted = false;

  constructor(private classService: ClassService, private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.getSubjects();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentClass'] && this.currentClass) {
      this.formData = { ...this.currentClass }; // Gán dữ liệu chỉnh sửa
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
    this.submitted = true;
    if (this.validateForm()) {  // Kiểm tra hợp lệ trước khi gửi
      if (this.formData.classID) {
        this.classService.updateClass(this.formData).subscribe(
          response => {
            Swal.fire({
              title: 'Cập nhật thành công!',
              text: 'Lớp học đã được cập nhật thành công.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.formSubmit.emit();   // Phát sự kiện khi cập nhật thành công
          },
          error => {
            console.error('Lỗi khi cập nhật lớp học:', error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi cập nhật lớp học.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      } else {
        // Thêm lớp học mới
        this.classService.addClass(this.formData).subscribe(
          response => {
            Swal.fire({
              title: 'Thêm lớp học thành công!',
              text: 'Lớp học đã được thêm mới thành công.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.formSubmit.emit();  // Phát sự kiện khi thêm mới thành công
          },
          error => {
            console.error('Lỗi khi thêm lớp học:', error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi thêm lớp học.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    }
  }

  validateForm(): boolean {
    // Kiểm tra các trường trống
    if (!this.formData.classCode.trim() ||
      !this.formData.className.trim() ||
      !this.formData.session.trim() ||
      !this.formData.subjectsID) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng điền đầy đủ tất cả các trường bắt buộc.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }

    // Kiểm tra định dạng classCode (bắt đầu bằng C và theo sau là các số)
    const classCodePattern = /^C\d+$/;
    if (!classCodePattern.test(this.formData.classCode)) {
      Swal.fire({
        title: 'Lỗi định dạng!',
        text: 'Mã lớp học phải bắt đầu bằng chữ "C" và theo sau là các số.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }

    // Kiểm tra độ dài className (tối thiểu 3 ký tự)
    if (this.formData.className.trim().length <= 4) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Tên lớp học phải có ít nhất 3 ký tự.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return false;
    }

    // Kiểm tra độ dài session (tối thiểu 30 ký tự)
    const sessionValue = Number(this.formData.session);
    if (isNaN(sessionValue) || sessionValue <= 30) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Thông tin session phải là số và lớn hơn 30.',
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
      classID: '',
      classCode: '',
      className: '',
      session: '',
      subjectsID: '',
      updateDate: new Date(),
      createDate: new Date(),
      isDelete: false
    };
    this.currentClass = null;
    this.submitted = false;
  }
}
