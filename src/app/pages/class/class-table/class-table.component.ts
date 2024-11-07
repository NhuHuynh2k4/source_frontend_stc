import {Component, OnInit} from '@angular/core';
import {ClassService} from "../../../services/class.service";

@Component({
  selector: 'app-class-table',
  templateUrl: './class-table.component.html',
  styleUrls: ['./class-table.component.css']
})
export class ClassTableComponent implements OnInit{
  classes: any[] = [];

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
    this.classService.getClasses().subscribe(
      data => this.classes = data,
      error => console.error(error)
    );
  }
}
