import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = 'http://localhost:5198/api/Subject'; // Base URL for all Subject-related API requests

  private selectedSubject = new BehaviorSubject<any>(null);
  selectedSubject$ = this.selectedSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Set the currently selected subject
  setSelectedSubject(subject: any): void {
    this.selectedSubject.next(subject);
  }

  // Get all subjects
  getAllSubjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all`);
  }

  // Get a subject by its ID
  getSubjectById(subjectId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-by-id/${subjectId}`);
  }

  // Create a new subject
  createSubject(subjectData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, subjectData);
  }

  // Update a subject based on subjectId
  updateSubject(subjectData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, subjectData);
  }


  // Delete a subject based on subjectId
  deleteSubject(subjectId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${subjectId}`);
  }
}
