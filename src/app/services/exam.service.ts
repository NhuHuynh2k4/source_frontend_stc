import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:5198/api/Exam'; // URL của API cho Exam

  constructor(private http: HttpClient) {}

  // Phương thức lấy danh sách các lớp
  getExams(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all`);
  }

  addExam(testData: any) {
    return this.http.post(`${this.apiUrl}/create`, testData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'  // Dựng chuỗi văn bản thay vì JSON
    });
  }

  // Cập nhật lớp học
  updateExam(testData: any): Observable<any> {
    const url = `${this.apiUrl}/update`;  // Tạo URL với ID của lớp học
    return this.http.put<any>(url, testData, {responseType:"text" as "json"});  // Gửi request PUT
  }

  // Xóa lớp học
  deleteExam(testId: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${testId}`;  // Tạo URL với ID lớp học
    return this.http.delete<any>(url, {responseType:"text" as "json"});  // Gửi request DELETE
  }

  exportToExcel(): Observable<Blob> {
    const url = `${this.apiUrl}/export`; // Địa chỉ API xuất Excel
    return this.http.get(url, {
      responseType: 'blob' // API trả về kiểu file nhị phân
    });
  }
}
