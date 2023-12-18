import React from "react";
import {Outlet} from "react-router-dom";
import Header from "../components/Header/Header";

const RootLayout: React.FC = () => {
    console.log('<RootLayout/>');

  return (
      <div className="memories_container">
          <Header/>
          <div>
              <div className="memories_container-content">
                <Outlet/>
              </div>
          </div>

      </div>
  );
}

export default RootLayout;

