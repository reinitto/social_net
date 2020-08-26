import React, { Fragment } from "react";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
function PageLayout({ children }) {
  return (
    <Fragment>
      <Navbar />
      <div style={{ maxWidth: "1024px", margin: "auto" }}>{children}</div>
      <Footer />
    </Fragment>
  );
}

export default PageLayout;
