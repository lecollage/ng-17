import {patchState, signalStore, withComputed, withMethods, withState,} from '@ngrx/signals';
import {computed} from "@angular/core";


export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState<{ count: number }>({ count: 0 }),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withMethods(({ count, ...store }) => ({
    increment() {
      patchState(store, { count: count() + 1 });
    },
    decrement() {
      patchState(store, { count: count() - 1 });
    },
  }))
);
