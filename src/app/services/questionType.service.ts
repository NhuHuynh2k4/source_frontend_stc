import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QuestionTypeService {
    private apiUrl = 'http://localhost:5198/api/QuestionType/get-all'; // URL của API cho Class Student

    constructor(private http: HttpClient) { }

    // Phương thức lấy danh sách các lớp
    getQuestionTypes(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    // Phương thức thêm một lớp mới
    addQuestionType(questionTypeData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, questionTypeData);
    }
}
