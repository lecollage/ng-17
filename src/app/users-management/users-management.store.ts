import {HttpErrorResponse} from "@angular/common/http";
import {computed, inject, Injectable, Signal} from "@angular/core";
import {
  patchState,
  signalStore,
  signalStoreFeature,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {EntityId, setAllEntities, setEntity, updateEntity, withEntities} from "@ngrx/signals/entities";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {tapResponse} from "@ngrx/operators";
import {EntityMap} from "@ngrx/signals/entities/src/models";
import {pipe, switchMap, tap} from "rxjs";

import {UsersService} from "./users.service";
import {User} from "./users-management.interface";

type State = {
  selectedId: string;
  loading: boolean;
  loaded: boolean;
  error: HttpErrorResponse | null;
};

const withUsersFeature = () => {
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
      loaded: false,
      error: null
    }),
    withComputed(({selectedId, entities}) => ({
      selectedUser: computed(() => entities().find(user => selectedId() === user.id)),
      allUsers: computed(() => entities())
    })),
    withMethods((store, usersService = inject(UsersService)) => ({
      selectUser(selectedId: string): void {
        patchState(store, {selectedId});
      },
      loadUser$: rxMethod<string>(
        pipe(
          tap(() => patchState(store, {loading: true, loaded: false})),
          switchMap((id) =>
            usersService.loadUser$(id).pipe(
              tapResponse({
                next: (user) => {
                  console.log(`loadUser$ >> user: `, user);
                  patchState(store,
                    setEntity(user),
                    {selectedId: user.id},
                    {loaded: true}
                  );
                },
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
                next: (users) => {
                  patchState(store, setAllEntities(users), {loaded: true})
                },
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
      putUser$: rxMethod<User>(
        pipe(
          tap(() => patchState(store, {loading: true})),
          switchMap((user) =>
            usersService.putUser$(user).pipe(
              tapResponse({
                next: (user) => {
                  patchState(store, updateEntity({id: user.id, changes: user}))
                },
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
    })),
    withHooks({
      onInit: (usersStore) => {
        console.log(`onInit >> `, usersStore)
      },
    })
  )
}

@Injectable({providedIn: 'root'})
export class UsersStore extends signalStore(
  withEntities<User>(),
  withUsersFeature()
) {
}
