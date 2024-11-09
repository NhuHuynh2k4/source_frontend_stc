import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Đảm bảo service này có thể được sử dụng trong toàn bộ ứng dụng
})
export class QuestionService {

  private apiUrl = 'http://localhost:5198/api/Question/get-all';  // URL API của bạn

  constructor(private http: HttpClient) {}

  // Phương thức để lấy danh sách câu hỏi
  getAllQuestions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
