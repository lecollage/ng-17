import {patchState, signalStore, signalStoreFeature, type, withComputed, withMethods, withState,} from '@ngrx/signals';
import {EntityId, setAllEntities, setEntity, withEntities} from "@ngrx/signals/entities";

import {computed, inject, Signal} from "@angular/core";
import {User} from "./users-management.interface";
import {pipe, switchMap, tap} from "rxjs";
import {UsersService} from "./users.service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {tapResponse} from "@ngrx/operators";
import {EntityMap} from "@ngrx/signals/entities/src/models";
import {HttpErrorResponse} from "@angular/common/http";

export type Entity = { id: EntityId };

type State = {
  selectedId: string;
  loading: boolean;
  error: HttpErrorResponse | null;
};

export function withUsersFeature() {
  return signalStoreFeature
  (
    {
      state: type<{
        entityMap: EntityMap<User>,
        ids: EntityId[],
      }>(),
      signals: type<{
        entities: Signal<User[]>
      }>(),
      methods: {}
    },
    withState<State>({
      selectedId: '',
      loading: false,
      error: null
    }),
    withComputed(({selectedId, entities}) => ({
      selectedUser: computed(() => entities().find(user => selectedId() === user.id))
    })),
    withMethods((store, usersService = inject(UsersService)) => ({
      selectUser(selectedId: string): void {
        patchState(store, {selectedId});
      },
      loadUser$: rxMethod<string>(
        pipe(
          tap(() => patchState(store, {loading: true})),
          switchMap((id) =>
            usersService.loadUser$(id).pipe(
              tapResponse({
                next: (user) => patchState(store, setEntity(user)),
                error: (error: HttpErrorResponse) => {
                  console.error(error);
                  patchState(store, {error})
                },
                finalize: () => patchState(store, {loading: false}),
              }),
            ),
          ),
        )
      ),
      loadAll$: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {loading: true})),
          switchMap(() =>
            usersService.loadAll$().pipe(
              tapResponse({
                next: (users) => patchState(store, setAllEntities(users)),
                error: (error: HttpErrorResponse) => {
                  console.error(error);
                  patchState(store, {error})
                },
                finalize: () => patchState(store, {loading: false}),
              }),
            ),
          ),
        )
      )
    }))
  )
}

export const UsersStore = signalStore(
  withEntities<User>(),
  withUsersFeature()
);
