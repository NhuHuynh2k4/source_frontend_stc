import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:5198/api/student'; // URL gốc cho các thao tác Student

  constructor(private http: HttpClient) { }
  // Phương thức lấy thông tin sinh viên theo ID
  getStudentById(StudentID: number): Observable<{
    id: number;
    studentCode: string;
    studentName: string;
    gender: boolean;
    numberPhone: string;
    address: string;
    email: string;
    birthdayDate: string;
  }> {
    return this.http.get<{
      id: number;
      studentCode: string;
      studentName: string;
      gender: boolean;
      numberPhone: string;
      address: string;
      email: string;
      birthdayDate: string;
    }>(`${this.baseUrl}/get-by-id/${StudentID}`);
  }

  // Phương thức lấy danh sách các sinh viên
  getStudents(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-all`);
  }
 
  
  // Phương thức thêm một sinh viên mới         
  createStudent(studentData: any): Observable<any> {
    console.log("dữ liệu gửi đi: ",studentData);
    return this.http.post<any>(`${this.baseUrl}/create`, studentData);  // giả sử endpoint thêm là `/create`
  }

  // Phương thức cập nhật sinh viên (ví dụ khi cần cập nhật sinh viên)
  updateStudent(studentData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update`, studentData);  // giả sử endpoint cập nhật là `/update`
  }
}
