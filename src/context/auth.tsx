import { createAsync } from '@solidjs/router';
import { createContext, onMount, Show, useContext } from 'solid-js';
import { createStore, unwrap, produce, StoreSetter } from 'solid-js/store';
import { set } from 'valibot';
import { api } from '~/lib/api';

interface authState {
  isAuthenticated: boolean,
  accessToken: string,
  expires: string,
  subscriptionId: string,
  isLoading: boolean
}

const initialState: authState = {
  isAuthenticated: false,
  accessToken: '',
  expires: '',
  subscriptionId: '',
  isLoading: true
}

const AuthStateContext = createContext(initialState);

export default function AuthProvider(props: { children: any }) {
  const [store, setStore] = createStore(initialState);

  const displayStore = (store: authState) => {
    const storeObj = unwrap(store);
    console.log('store: ', storeObj);
    return storeObj;
  }

  onMount(async () => {
    try {
      // Sign in
      const loginUser = await api.auth.login.query();
      // console.log("login: ", loginUser);
      // TODO: Set accessToken and expires from login
      // TODO: Set isAuthenticated to true
      // TODO: Start the SSE client and grab the subscriptionId
      // TODO: Subscribe to the SSE client for the three sensors
      setStore("accessToken", loginUser.accessToken);
      setStore("expires", loginUser.expires);
      setStore("isAuthenticated", true);
    
    } catch (error) {
      console.error('Error: ', error);
      setStore("isAuthenticated", false);
      setStore("accessToken", '');
      setStore("expires", '');
    } finally {
      setStore("isLoading", false);
      displayStore(store);
    }
  });

  return (
    <AuthStateContext.Provider value={store}>
      <Show when={!store.isLoading} fallback={<p>loading...</p>}>
        {props.children}
      </Show>
    </AuthStateContext.Provider>
  )
}

export const UseAuthState = () => useContext(AuthStateContext);