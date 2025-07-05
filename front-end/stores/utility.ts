import { StateCreator, StoreApi, useStore } from 'zustand';
import { PersistOptions } from 'zustand/middleware';

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export function createSlice<T extends object, U extends object>(
  config: StateCreator<T, [['zustand/immer', never]], [], U>
) {
  return config;
}
export function createPersistedSlice<T extends object, U extends object>(
  config: StateCreator<T, [['zustand/immer', never]], [], U>,
  options?: PersistOptions<U>
) {
  return { config, options };
}
