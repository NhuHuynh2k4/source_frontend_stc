import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassComponent } from './pages/class/class.component';
import { QuestionComponent } from './pages/question/question.component'; // Import QuestionComponent

const routes: Routes = [
  { path: 'class', component: ClassComponent },
  { path: 'question', component: QuestionComponent },  // Thêm route cho QuestionComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
