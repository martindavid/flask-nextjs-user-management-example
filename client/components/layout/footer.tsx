import React from "react";
import styled from "styled-components";

const CustomFooter = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  line-height: 60px;
  background-color: #f5f5f5;
`;

export const Footer = () => {
  return (
    <CustomFooter className="bg-dark">
      <div className="container">
        <span className="text-white">
          &#169;
          {`${new Date().getFullYear()} Company Inc. All Rights Reserved`}
        </span>
        <div className="float-right">
          <a
            href="https://github.com/martindavid/flask-nextjs-user-management-example/pull/21/files"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </div>
      </div>
    </CustomFooter>
  );
};

Footer.displayName = "Footer";
