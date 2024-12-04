import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'http://localhost:5198/api/Class'; // URL của API cho Class

  constructor(private http: HttpClient) {}

  // Phương thức lấy danh sách các lớp
  getClasses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all`);
  }

  addClass(classData: any) {
    return this.http.post(`${this.apiUrl}/create`, classData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'  // Dựng chuỗi văn bản thay vì JSON
    });
  }

  // Cập nhật lớp học
  updateClass(classData: any): Observable<any> {
    const url = `${this.apiUrl}/update`;  // Tạo URL với ID của lớp học
    return this.http.put<any>(url, classData,{ responseType: 'text' as 'json' });  // Gửi request PUT
  }

  // Xóa lớp học
  deleteClass(classId: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${classId}`;  // Tạo URL với ID lớp học
    return this.http.delete<any>(url,{ responseType: 'text' as 'json' });  // Gửi request DELETE
  }

  searchClasses(classCode: string, className: string, session: string, subjectName: string): Observable<any> {
    const params = new HttpParams()
      .set('classCode', classCode)
      .set('className', className)
      .set('session', session)
      .set('subjectName', subjectName);

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  exportToExcel(): Observable<Blob> {
    const url = `${this.apiUrl}/export`; // Địa chỉ API xuất Excel
    return this.http.get(url, {
      responseType: 'blob' // API trả về kiểu file nhị phân
    });
  }

}
