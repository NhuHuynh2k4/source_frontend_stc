import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ClassFormComponent } from './pages/class/class-form/class-form.component';
import { ClassTableComponent } from './pages/class/class-table/class-table.component';
import { ClassComponent } from './pages/class/class.component';

// Import các component cho question
import { QuestionFormComponent } from './pages/question/question-form/question-form.component';
import { QuestionTableComponent } from './pages/question/question-table/question-table.component';
import { QuestionComponent } from './pages/question/question.component';

// Import các component cho student
import { StudentFormComponent } from './pages/student/student-form/student-form.component';
import { StudentTableComponent } from './pages/student/student-table/student-table.component';
import { StudentComponent } from './pages/student/student.component';

// Import các component cho subject
import { SubjectFormComponent } from './pages/Subject/subject-form/subject-form.component'; // Thêm SubjectFormComponent
import { SubjectTableComponent } from './pages/Subject/subject-table/subject-table.component'; // Thêm SubjectTableComponent
import { SubjectComponent } from './pages/Subject/subject.componet'; // Thêm component Subject

import { ReactiveFormsModule } from '@angular/forms'; // Import this module

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClassComponent,
    ClassTableComponent,
    ClassFormComponent,
    QuestionComponent,               // Đảm bảo đã khai báo các component cho Question
    QuestionTableComponent,
    QuestionFormComponent,
    StudentComponent,
    StudentFormComponent,
    StudentTableComponent,
    // Khai báo các component của Subject
    SubjectComponent,
    SubjectFormComponent,
    SubjectTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule  // Add this to imports
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Giữ lại nếu sử dụng Web Components
})
export class AppModule { }
