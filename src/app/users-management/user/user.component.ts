import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private readonly router = inject(Router);

  constructor() {
    console.log(`extras: `, this.router.getCurrentNavigation()?.extras.state)
  }

  ngOnInit() {
  }
}
