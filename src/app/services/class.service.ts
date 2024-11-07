import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'http://localhost:5198/api/Class/get-all'; // URL của API cho Class

  constructor(private http: HttpClient) {}

  // Phương thức lấy danh sách các lớp
  getClasses(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Phương thức thêm một lớp mới
  addClass(classData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, classData);
  }
}
