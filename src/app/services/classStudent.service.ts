import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClassStudent } from '../pages/class_student/class_student.model';  // Import interface

@Injectable({
    providedIn: 'root'
})
export class ClassStudentService {
    private apiUrl = 'http://localhost:5198/api/ClassStudent'; // URL của API

    constructor(private http: HttpClient) { }

    private selectedClassStudent = new BehaviorSubject<any>(null);
    selectedClassStudent$ = this.selectedClassStudent.asObservable();

    setSelectedClassStudent(classStudent: any) {
        this.selectedClassStudent.next(classStudent);
    }

    // Lấy danh sách tất cả các học sinh lớp
    getClassStudents(): Observable<ClassStudent[]> {
        return this.http.get<ClassStudent[]>(`${this.apiUrl}/get-all`);
    }

    // Lấy thông tin học sinh lớp theo ID
    getClassStudentById(class_StudentID: number): Observable<ClassStudent> {
        return this.http.get<ClassStudent>(`${this.apiUrl}/get-by-id/${class_StudentID}`);
    }

    // Thêm học sinh mới
    addClassStudent(classStudent: { classID: number; studentID: number }): Observable<ClassStudent> {
        return this.http.post<ClassStudent>(`${this.apiUrl}/create`, classStudent);
    }

    // Cập nhật học sinh
    updateClassStudent(classStudent: { class_StudentID: number; classID: number; studentID: number }): Observable<ClassStudent> {
        return this.http.put<ClassStudent>(`${this.apiUrl}/update`, classStudent);
    }

    deleteClassStudent(class_StudentID: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${class_StudentID}`);
    }

}

