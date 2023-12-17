import {ChangeDetectionStrategy, Component, DestroyRef, effect, inject, Injector, OnInit, Signal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {JsonPipe, NgTemplateOutlet} from "@angular/common";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {filter, map} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {UsersStore} from "../users-management.store";
import {User} from "../users-management.interface";
import {UserActivityComponent} from "../../user-activity/user-activity.component";

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    NgTemplateOutlet,
    UserActivityComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {
  private readonly injector = inject(Injector)
  private readonly destroyRef = inject(DestroyRef);

  private userId: number | undefined

  private readonly route = inject(ActivatedRoute);

  readonly store = inject(UsersStore);

  readonly users: Signal<User[]> = this.store.entities;

  readonly isLoading = this.store.loading;
  readonly isLoaded = this.store.loaded;

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  });


  ngOnInit() {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef),
        filter(({id}) => id !== undefined),
        map(({id}) => id as string)
      )
      .subscribe((id) => {
        console.log(`params: `, id)
        console.log(`entities: `, this.store.entities())
        if (!this.store.selectedUser()) {
          this.store.loadUser$(id!);
        }
      });

    console.log(`BEFORE loadUser$: `, this.userId)

    effect(() => {
      console.log(`selectedUser: `, this.store.selectedUser());

      const selectedUser = this.store.selectedUser()

      if (selectedUser) {
        this.fillForm(selectedUser)
      }
    }, {injector: this.injector});

    // dev preview
    toObservable(this.store.selectedUser, {injector: this.injector})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        console.log(`from toObservable >> `, user)
      })
  }

  onSubmit() {
    console.log(this.form.value);
    this.store.putUser$({...this.store.selectedUser()!, name: this.form.value.name!})
  }

  private fillForm(user: User) {
    if (!user) {
      return;
    }

    this.form.setValue({name: user.name})
  }
}
