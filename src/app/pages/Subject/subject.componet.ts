import { Component, OnInit } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  modal: any;

  ngOnInit(): void {
    // Khởi tạo modal Bootstrap sau khi component được tải xong
    const modalElement = document.getElementById('subjectModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
  }

  openModal(): void {
    if (this.modal) {
      this.modal.show();  // Hiển thị modal
    }
  }

  closeModal(): void {
    if (this.modal) {
      this.modal.hide();  // Ẩn modal
    }
  }
}
