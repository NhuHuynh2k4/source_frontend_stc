import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassComponent } from './pages/class/class.component';
import { QuestionComponent } from './pages/question/question.component'; // Import QuestionComponent
import { StudentComponent } from './pages/student/student.component';
import { SubjectComponent } from './pages/Subject/subject.componet';
const routes: Routes = [
  { path: 'class', component: ClassComponent },
  { path: 'question', component: QuestionComponent },  // Thêm route cho QuestionComponent
  { path: 'student', component: StudentComponent },
  { path: 'subject', component: SubjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
