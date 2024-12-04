import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';  // Import CookieService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5198/api/Auth/login';  // Thay thế bằng URL của backend

  constructor(private http: HttpClient, private cookieService: CookieService) {}  // Inject CookieService

  // Đăng nhập và lưu token vào cookies
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, { email, password }, { headers });
  }

  // Lưu token vào cookies sau khi đăng nhập thành công
  setToken(token: string): void {
    this.cookieService.set('token', token, 1, '/'); // Lưu token, hết hạn sau 1 ngày
  }

  // Kiểm tra xem người dùng đã đăng nhập chưa
  isLoggedIn(): boolean {
    return this.cookieService.check('token');  // Kiểm tra token trong cookies
  }

  // Đăng xuất và xóa token trong cookies
  logout(): void {
    this.cookieService.delete('token', '/');  // Xóa token từ cookies
  }

  // Lấy token từ cookies (nếu cần)
  getToken(): string | null {
    return this.cookieService.get('token');
  }
}
