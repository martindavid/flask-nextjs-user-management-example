import Router from "next/router";
import { NextPageContext } from "next";
import React, { Component } from "react";
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

export function withAuth(WrappedComponent: any) {
  return class AuthWrapper extends Component<AuthProps> {
    static async getInitialProps(ctx: NextPageContext, props: AuthProps) {
      const { auth } = props;
      if (!auth || (auth && auth.isExpired)) {
        redirectToLogin(ctx.res);
      }
      const initialProps = { auth };
      if (WrappedComponent.getInitialProps) {
        return WrappedComponent.getInitialProps(ctx, initialProps);
      }
      return initialProps;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
