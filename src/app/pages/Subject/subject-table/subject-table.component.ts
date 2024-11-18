import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators'; // For error handling and debugging
import { SubjectService } from '../../../services/subject.service';

declare var bootstrap: any;


declare var bootstrap: any;

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.css']
})
export class SubjectTableComponent implements OnInit {
  subjectForm!: FormGroup;
  isUpdate: boolean = false;
  subjects: any[] = [];
  selectedSubject: any;

  constructor(private subjectService: SubjectService, private fb: FormBuilder) {
    this.subjectForm = this.fb.group({
      subjectsID: [''],
      subjectsCode: [''],
      subjectsName: ['']
    });
  }

  ngOnInit(): void {
    this.fetchSubjects();  // Fetch subjects when component initializes
  }

  // Fetch all subjects from the service
  fetchSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      (data) => {
        this.subjects = data;
        console.log('Subjects data:', data);
      },
      (error) => {
        console.error('Error fetching subjects:', error);
      }
    );
  }

  // Edit subject by subjectID
  onEdit(subjectID: number): void {
    this.subjectService.getSubjectById(subjectID).subscribe({
      next: (subjectData) => {
        this.subjectService.setSelectedSubject(subjectData); // Set selected subject
        const modalElement = document.getElementById('subjectModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();  // Show modal for editing subject
        }
      },
      error: (error) => {
        console.error('Error fetching subject data:', error);
      }
    });
  }
  // Delete a subject
  deleteSubject(subjectId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa môn học này không?')) {
      this.subjectService.deleteSubject(subjectId).pipe(
        tap(() => {
          console.log('Xóa môn học với subjectsID:', subjectId);  // Debug log for subjectID
        }),
        catchError((error) => {
          console.error('Lỗi khi xóa môn học', error);
          return [];  // Return an empty observable to continue the chain
        })
      ).subscribe({
        next: () => {
          console.log('Xóa thành công');
          this.loadSubjects();  // Reload the subject list after deletion
        },
        error: (error) => {
          console.error('Xảy ra lỗi khi xóa', error);  // Handle error during deletion
        }
      });
    }
  }
  // Load the list of subjects
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe((data: any[]) => {
      this.subjects = data;
    });
  }


}
