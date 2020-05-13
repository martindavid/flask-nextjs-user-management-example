import React, { Component } from "react";
import { withAuth } from "utils/auth";

class SecurePage extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-12">
          <h1>You can only access this page if you have login</h1>
        </div>
      </div>
    );
  }
}

export default withAuth(SecurePage);
