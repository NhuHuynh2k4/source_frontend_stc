import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = 'http://localhost:5198/api/Question'; // Base URL cho tất cả các API liên quan đến Question

  private selectedQuestion = new BehaviorSubject<any>(null);
  selectedQuestion$ = this.selectedQuestion.asObservable();

  constructor(private http: HttpClient) {}

  // Thiết lập câu hỏi hiện tại được chọn
  setSelectedQuestion(question: any): void {
    this.selectedQuestion.next(question);
  }

  // Lấy danh sách tất cả các câu hỏi
  getAllQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all`);
  }

  // Lấy chi tiết câu hỏi theo ID
  getQuestionById(questionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-by-id/${questionId}`);
  }

  // Tạo mới một câu hỏi
  createQuestion(questionData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, questionData);
  }

  // Cập nhật câu hỏi
  updateQuestion(questionData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, questionData);
  }

  // Xóa câu hỏi theo ID
  deleteQuestion(questionId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${questionId}`);
  }
  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
}
}
