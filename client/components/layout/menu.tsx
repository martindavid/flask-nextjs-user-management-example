import React from "react";
import {
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Link from "next/link";
import { logout, useAuth } from "utils/auth";
import Router from "next/router";

export const Menu = () => {
  const auth = useAuth();

  const onLogoutClick = () => {
    logout();
    Router.push("/login");
  };

  return (
    <Nav className="ml-auto" navbar>
      <NavItem>
        <Link href="/" passHref>
          <NavLink>Home</NavLink>
        </Link>
      </NavItem>
      {auth && (
        <NavItem>
          <Link href="/secure-page" passHref>
            <NavLink>Secure Page</NavLink>
          </Link>
        </NavItem>
      )}
      {!auth ? (
        <NavItem>
          <Link href="/login" passHref>
            <NavLink>Login</NavLink>
          </Link>
        </NavItem>
      ) : (
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            User Menu
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <Link passHref href="/profile">
                <NavLink>Profile</NavLink>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <a
                onClick={() => {
                  onLogoutClick();
                }}
              >
                Logout
              </a>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </Nav>
  );
};
