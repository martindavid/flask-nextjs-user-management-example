import App from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import { Header, Footer } from "components/layout";
import { ErrorBoundary } from "components/error-boundary";
import { ProvideAuth, AuthToken, TOKEN_STORAGE_NAME } from "utils/auth";
import { Container } from "reactstrap";
import nookies from "nookies";

type CustomAppProps = {
  auth?: AuthToken;
};

export default class CustomApp extends App<CustomAppProps> {
  static async getInitialProps({ Component, ctx }) {
    const token = nookies.get(ctx)[TOKEN_STORAGE_NAME];
    let initialProps = {};
    if (token) {
      const auth = new AuthToken(token);
      initialProps = { auth };
    }
    if (Component.getInitialProps) {
      return Component.getInitialProps(ctx, initialProps);
    }

    return initialProps;
  }

  get auth() {
    if (this.props.auth) {
      // the server pass to the client serializes the token
      // so we have to reinitialize the authToken class
      //
      // @see https://github.com/zeit/next.js/issues/3536
      return new AuthToken(this.props.auth.token);
    }
    return null;
  }

  componentDidMount() {
    Router.events.on("routeChangeComplete", () => {
      NProgress.start();
    });

    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }

  componentDidCatch(error: any, errorInfo: any) {
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ProvideAuth auth={this.auth}>
        <Header />
        <ErrorBoundary>
          <Container className="mt-3">
            <Component {...pageProps} />
          </Container>
        </ErrorBoundary>
        <Footer />
      </ProvideAuth>
    );
  }
}
