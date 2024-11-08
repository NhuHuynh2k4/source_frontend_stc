import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClassStudentService {
    private apiUrl = 'http://localhost:5198/api/ClassStudent/get-all'; // URL của API cho Class Student

    constructor(private http: HttpClient) { }

    // Phương thức lấy danh sách các lớp
    getClassStudents(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    // Phương thức thêm một lớp mới
    addClassStudent(classStudentData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, classStudentData);
    }
}
