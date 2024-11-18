import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

// Import các component cho Class
import { ClassFormComponent } from './pages/class/class-form/class-form.component';
import { ClassTableComponent } from './pages/class/class-table/class-table.component';
import { ClassComponent } from './pages/class/class.component';

// Import các component cho Question
import { QuestionFormComponent } from './pages/question/question-form/question-form.component';
import { QuestionTableComponent } from './pages/question/question-table/question-table.component';
import { QuestionComponent } from './pages/question/question.component';

// Import các component cho Subject
import { SubjectFormComponent } from './pages/Subject/subject-form/subject-form.component';
import { SubjectTableComponent } from './pages/Subject/subject-table/subject-table.component';
import { SubjectComponent } from './pages/Subject/subject.componet'; // Đảm bảo tên file đúng

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,

    // Các component cho Class
    ClassComponent,
    ClassTableComponent,
    ClassFormComponent,

    // Các component cho Question
    QuestionComponent,
    QuestionTableComponent,
    QuestionFormComponent,

    // Các component cho Subject
    SubjectComponent,
    SubjectTableComponent,
    SubjectFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Sử dụng nếu bạn có Web Components
})
export class AppModule { }
