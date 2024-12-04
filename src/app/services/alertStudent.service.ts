import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertStudentService {
  constructor(private toastr: ToastrService) {}

  displayStudentAlert(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    switch (type) {
      case 'success':
        this.toastr.success(message, 'Thành công');
        break;
      case 'error':
        this.toastr.error(message, 'Lỗi');
        break;
      case 'info':
        this.toastr.info(message, 'Thông tin');
        break;
      case 'warning':
        this.toastr.warning(message, 'Cảnh báo');
        break;
      default:
        this.toastr.show(message);
    }
  }
}
