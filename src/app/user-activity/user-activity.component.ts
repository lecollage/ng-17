import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-user-activity',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './user-activity.component.html',
  styleUrl: './user-activity.component.scss'
})
export class UserActivityComponent {
  headers: string[] = ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7', 'Column 8'];
  data: string[][] = this.generateDummyData(50, 8);

  generateDummyData(rows: number, columns: number): string[][] {
    const data: string[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < columns; j++) {
        row.push(`Activity ${i + 1}:${j + 1}`);
      }
      data.push(row);
    }
    return data;
  }
}
