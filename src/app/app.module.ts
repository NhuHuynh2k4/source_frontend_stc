import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TestComponent } from './pages/test/test.component';
import { TestTableComponent } from './pages/test/test-table/test-table.component';
import { TestFormComponent } from './pages/test/test-form/test-form.component';
import { ExamComponent } from './pages/exam/exam.component';
import { ExamTableComponent } from './pages/exam/exam-table/exam-table.component';
import { ExamFormComponent } from './pages/exam/exam-form/exam-form.component';
import { LoginComponent } from './login/login.component';
import {JwtInterceptor} from "./jwt-interceptor.service";
import {CookieService} from "ngx-cookie-service";
// Import các component cho class student
import {ClassStudentComponent} from './pages/class_student/class_student.component';
import {ClassStudentTableComponent} from "./pages/class_student/class_student_table/class_student_table.component";
import {ClassStudentFormComponent} from "./pages/class_student/class_student_form/class_student_form.component";

// Import các component cho question type
import {QuestionTypeComponent} from './pages/question_type/question_type.component';
import {QuestionTypeTableComponent} from "./pages/question_type/question_type_table/question_type_table.component";
import {QuestionTypeFormComponent} from "./pages/question_type/question_type_form/question_type_form.component";

// Import các component cho subject
import { SubjectFormComponent } from './pages/Subject/subject-form/subject-form.component'; 
import { SubjectTableComponent } from './pages/Subject/subject-table/subject-table.component';
import { SubjectComponent } from './pages/Subject/subject.componet';

// Import các component cho student
import { StudentComponent } from './pages/student/student.component';
import { StudentFormComponent } from './pages/student/student-form/student-form.component';
import { StudentTableComponent } from './pages/student/student-table/student-table.component';


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
    TestComponent,
    TestTableComponent,
    TestFormComponent,
    ExamComponent,
    ExamTableComponent,
    ExamFormComponent,
    LoginComponent,
    ClassStudentComponent,
    ClassStudentTableComponent,
    ClassStudentFormComponent,
    QuestionTypeComponent,
    QuestionTypeTableComponent,
    QuestionTypeFormComponent,
    SubjectFormComponent,
    SubjectTableComponent,
    SubjectComponent,
    StudentComponent,
    StudentFormComponent,
    StudentTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Thời gian hiển thị (3 giây)
      positionClass: 'toast-top-right', // Vị trí hiển thị
      preventDuplicates: true, // Không cho phép thông báo trùng lặp
    })
  ],
  providers: [CookieService,{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Giữ lại nếu sử dụng Web Components
})
export class AppModule { }
