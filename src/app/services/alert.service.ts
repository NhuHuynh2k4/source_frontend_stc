import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  alertMessage: string = '';
  alertType: string = '';

  displayAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  clearAlert(): void {
    this.alertMessage = '';
    this.alertType = '';
  }
}
