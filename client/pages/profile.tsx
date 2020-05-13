import React, { useState, useEffect } from "react";
import { useAuth, withAuth } from "utils/auth";
import { UserApi } from "services";

const Profile = () => {
  const auth = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const api = new UserApi();
        api.setup();
        const response = await api.getUserById(
          auth.token,
          auth.decodedToken.id
        );

        if (response.kind === "ok") {
          setUserData(response.user);
        }
      } catch (err) {
        console.log(err);
      }
    }
    loadUserData();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <h1>Profile</h1>
        <div>
          {userData ? (
            <>
              <div>Id: {userData.id}</div>
              <div>First Name: {userData.firstName}</div>
              <div>Last Name: {userData.lastName}</div>
              <div>Email: {userData.email}</div>
              <div>Is admin: {userData.admin ? "Yes" : "No"}</div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);
