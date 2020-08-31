import React, { Fragment, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { ContactsSideBar } from "../Contacts/ContactsSideBar";
function WidePageLayout({ children }) {
  const location = useLocation();
  // Scroll to top if path changes
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Fragment>
      <Navbar />
      <ContactsSideBar />
      {children}
      <Footer />
    </Fragment>
  );
}

export default WidePageLayout;
