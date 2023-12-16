import {Component, inject} from '@angular/core';
import {UsersStore} from "./users-management.store";

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss'
})
export class UsersManagementComponent {
  readonly store = inject(UsersStore);
}
