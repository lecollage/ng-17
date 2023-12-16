import {patchState, signalStore, signalStoreFeature, type, withComputed, withMethods, withState,} from '@ngrx/signals';
import {EntityId, setAllEntities, withEntities} from "@ngrx/signals/entities";

import {computed, inject, Signal} from "@angular/core";
import {User} from "./users-management.interface";
import {pipe, switchMap, tap} from "rxjs";
import {UsersService} from "./users.service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {tapResponse} from "@ngrx/operators";
import {EntityMap} from "@ngrx/signals/entities/src/models";

export type Entity = { id: EntityId };

type State = { users: User[]; loading: boolean; };

const initialState: State = {
  users: [],
  loading: false,
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
    withState({
      selectedId: '',
      loading: false
    }),
    withComputed(({selectedId, entities}) => ({
      selectedUser: computed(() => entities().find(user => selectedId() === user.id))
    })),
    withMethods((store, usersService = inject(UsersService)) => ({
      loadAll$: rxMethod<void>(
        pipe(
          tap(() => patchState(store, {loading: true})),
          switchMap(() =>
            usersService.loadAll$().pipe(
              tapResponse({
                next: (users) => patchState(store, setAllEntities(users)),
                error: console.error,
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
