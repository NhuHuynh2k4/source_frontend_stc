import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuestionType } from '../pages/question_type/question_type.model';

@Injectable({
    providedIn: 'root'
})
export class QuestionTypeService {
    private apiUrl = 'http://localhost:5198/api/QuestionType'; // URL của API

    constructor(private http: HttpClient) { }

    private selectedQuestionType = new BehaviorSubject<any>(null);
    selectedQuestionType$ = this.selectedQuestionType.asObservable();

    setSelectedQuestionType(questionType: any) {
        this.selectedQuestionType.next(questionType);
    }

    // Lấy danh sách tất cả các học sinh lớp
    getQuestionType(): Observable<QuestionType[]> {
        return this.http.get<QuestionType[]>(`${this.apiUrl}/get-all`);
    }

    // Lấy thông tin học sinh lớp theo ID
    getQuestionTypeById(questionTypeID: number): Observable<QuestionType> {
        return this.http.get<QuestionType>(`${this.apiUrl}/get-by-id/${questionTypeID}`);
    }

    // Thêm học sinh mới
    addQuestionType(questionType: { questionTypeID: number; questionTypeCode: String; questionTypeName: String }): Observable<QuestionType> {
        return this.http.post<QuestionType>(`${this.apiUrl}/create`, questionType);
    }

    // Cập nhật học sinh
    updateQuestionType(questionType: { questionTypeID: number; questionTypeCode: String; questionTypeName: String }): Observable<QuestionType> {
        return this.http.put<QuestionType>(`${this.apiUrl}/update`, questionType);
    }

    deleteQuestionType(questionTypeID: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${questionTypeID}`);
    }
}
