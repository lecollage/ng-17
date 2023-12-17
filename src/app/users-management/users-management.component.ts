import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  Signal
} from '@angular/core';
import {JsonPipe, NgOptimizedImage} from "@angular/common";

import {UsersStore} from "./users-management.store";
import {User} from "./users-management.interface";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [JsonPipe, NgOptimizedImage],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersManagementComponent {
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly usersCount = signal(0, {});

  readonly store = inject(UsersStore);

  readonly users: Signal<User[]> = this.store.entities;

  readonly isLoading = this.store.loading;

  readonly error = this.store.error;

  readonly errorMessage = computed(() => {
    console.log(`errorMessage: ${this.error()?.message}`)

    return this.error()?.message || ''
  } );

  ngOnInit() {
    this.store.loadAll$();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.usersCount.set(this.users().length)
        console.log(`Number of users is ${this.usersCount()}`)
      }, {allowSignalWrites: true})
    });
  }

  onEdit(id: string) {
    this.store.selectUser(id)

    console.log(this.store.selectedUser())

    this.router.navigate([`./user`, id], {relativeTo: this.route})
  }
}
