import React, { useContext, createContext } from "react";
import { AuthToken } from "./auth-token";

// @ts-ignore
export const authContext = createContext();

type ProviderAuthProps = {
  auth: AuthToken;
  children: React.ReactNode | React.ReactChildren;
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = (): AuthToken => {
  return useContext(authContext);
};

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth(props: ProviderAuthProps) {
  return (
    <authContext.Provider value={props.auth}>
      {props.children}
    </authContext.Provider>
  );
}
