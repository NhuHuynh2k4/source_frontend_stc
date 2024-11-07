import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClassComponent} from "./pages/class/class.component";

const routes: Routes = [{ path: 'class', component: ClassComponent }, ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
