import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';  // Import CookieService
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService  // Inject CookieService
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
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

  onSubmit() {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        // Lưu token vào cookies thay vì localStorage
        this.cookieService.set('token', response.token, 1, '/');  // Token hết hạn sau 1 ngày
        // Chuyển hướng đến trang chính sau khi đăng nhập thành công
        this.showSuccess('Đăng nhập thành công!', 'Thành công');
        this.router.navigate(['/student']);
      },
      error: () => {
        // Hiển thị thông báo lỗi nếu đăng nhập thất bại
        this.errorMessage = 'Email hoặc mật khẩu không chính xác';
      }
    });
  }
}
