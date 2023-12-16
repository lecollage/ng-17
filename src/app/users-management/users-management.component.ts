import {Component, inject} from '@angular/core';
import {UsersStore} from "./users-management.store";
import {UsersService} from "./users.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss',
  providers: [
    UsersService,
    UsersStore
  ]
})
export class UsersManagementComponent {
  readonly store = inject(UsersStore);

  ngOnInit() {
    this.store.loadAll$()
  }
}
