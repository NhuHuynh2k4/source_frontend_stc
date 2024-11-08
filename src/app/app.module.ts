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
    QuestionFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Giữ lại nếu sử dụng Web Components
})
export class AppModule { }
