import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:5198/api/student'; // URL gốc cho các thao tác Student

  private selectedStudent = new BehaviorSubject<any>(null);
  selectedStudent$ = this.selectedStudent.asObservable();

  constructor(private http: HttpClient) { }

  setSelectedStudent(student: any) {
    this.selectedStudent.next(student);
  }

  // Phương thức lấy thông tin sinh viên theo ID
  getStudentById(StudentID: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-by-id/${StudentID}`);
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

  // Xóa sinh viên
  deleteStudent(StudentID: number): Observable<any> {
    const url = `${this.baseUrl}/delete/${StudentID}`;  // Tạo URL với ID lớp học
    return this.http.delete<any>(url);  // Gửi request DELETE
  }
  exportToExcel(): Observable<Blob> {
    const url = `${this.baseUrl}/export`; // Địa chỉ API xuất Excel
    return this.http.get(url, {
      responseType: 'blob' // API trả về kiểu file nhị phân
    });
  }
}
