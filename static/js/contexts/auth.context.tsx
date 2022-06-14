import { DateTime } from 'luxon';
import { createContext, useState } from 'react';
import { signMessage } from '../api-smart-contracts/dcf';
import { authorize, getNonce } from '../api/degen.service';
import { loadState, saveState } from '../utils/localStorage';

interface Authorization {
  username: string | any;
  idToken: string;
  exp: number;
}

interface AuthorizationContextValue {
  auth: Authorization | any,
  signIn(walletId: string, referral: string): void;
  signOut(): void;
}

const AuthorizationContext = createContext<AuthorizationContextValue>({
  auth: null,
  signIn() { },
  signOut() { }
});

const AuthorizationProvider = (props: any) => {
  const [auth, setAuth] = useState<Authorization | any>(loadState());

  const handleSaveAuth = (data: Authorization | any) => {
    saveState(data);
    setAuth(data);
  };

  const signIn = async (walletId: string, referral: string) => {
    const expired = DateTime.fromSeconds(auth?.exp ?? 0) < DateTime.utc().plus({ minutes: 150 });
    if (!auth || expired || auth?.username !== walletId) {
      const { nonce } = await getNonce(walletId, referral);
      const { signature } = await signMessage(nonce);
      const authorization = await authorize(walletId, signature);
      handleSaveAuth(authorization)
      return authorization;
    }

    return auth;
  };
  const signOut = () => handleSaveAuth(null);

  return (
    <div>
      <AuthorizationContext.Provider value={{ auth, signIn, signOut }}>
        {props.children}
      </AuthorizationContext.Provider>
    </div>
  )
};

export { AuthorizationContext, AuthorizationProvider };