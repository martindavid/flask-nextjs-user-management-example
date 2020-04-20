import Router from "next/router";
import { NextPageContext } from "next";
import React, { Component, useContext, createContext } from "react";
import { AuthToken } from "./auth-token";
import { redirectToLogin } from "./redirect";
import nookies from "nookies";
import Cookies from "js-cookie";

export const TOKEN_STORAGE_NAME = "app.authToken";

export function login(token: string) {
  nookies.set(null, TOKEN_STORAGE_NAME, token, {
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  Router.push("/");
}

export function logout() {
  Cookies.remove(TOKEN_STORAGE_NAME, { path: "/" });
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now().toString());
}

export type AuthProps = {
  auth: AuthToken;
};

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

export function withAuth(WrappedComponent: any) {
  return class AuthWrapper extends Component<AuthProps> {
    static async getInitialProps(ctx: NextPageContext) {
      const token = nookies.get(ctx)[TOKEN_STORAGE_NAME];
      const auth = new AuthToken(token);
      const initialProps = { auth };
      if (auth.isExpired) {
        redirectToLogin(ctx.res);
      }
      if (WrappedComponent.getInitialProps) {
        return WrappedComponent.getInitialProps(ctx, initialProps);
      }

      return initialProps;
    }

    get auth() {
      // the server pass to the client serializes the token
      // so we have to reinitialize the authToken class
      //
      // @see https://github.com/zeit/next.js/issues/3536
      return new AuthToken(this.props.auth.token);
    }

    render() {
      return (
        <ProvideAuth auth={this.auth}>
          <WrappedComponent {...this.props} />
        </ProvideAuth>
      );
    }
  };
}
