import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassComponent } from './pages/class/class.component';
import { QuestionComponent } from './pages/question/question.component';
import { ClassTableComponent } from "./pages/class/class-table/class-table.component";
import { TestComponent } from "./pages/test/test.component";
import { ExamComponent } from "./pages/exam/exam.component";
import { authGuard } from "./auth.guard";
import { LoginComponent } from "./login/login.component"; // Import QuestionComponent
import { ClassStudentComponent } from "./pages/class_student/class_student.component";
import { QuestionTypeComponent } from './pages/question_type/question_type.component';
import { SubjectComponent } from './pages/Subject/subject.componet';
import { StudentComponent } from './pages/student/student.component'; 

const routes: Routes = [
  { path: 'class', component: ClassComponent, canActivate: [authGuard] },
  { path: 'test', component: TestComponent, canActivate: [authGuard] },
  { path: 'question', component: QuestionComponent, canActivate: [authGuard] },
  { path: 'class-table', component: ClassTableComponent, canActivate: [authGuard] },
  { path: 'exam', component: ExamComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'class-student', component: ClassStudentComponent, canActivate: [authGuard]},
  { path: 'question-type', component: QuestionTypeComponent, canActivate: [authGuard]},
  { path: 'subject', component: SubjectComponent, canActivate: [authGuard]},
  { path: 'student', component: StudentComponent, canActivate: [authGuard]},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// , canActivate: [authGuard]
