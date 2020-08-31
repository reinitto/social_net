import React, { Fragment } from "react";
import WidePageLayout from "./WidePageLayout";
// import Navbar from "./Navbar";
// import { Footer } from "./Footer";
function PageLayout({ children }) {
  return (
    <WidePageLayout>
      <div style={{ maxWidth: "1024px", margin: "auto" }}>{children}</div>
    </WidePageLayout>
  );
}

export default PageLayout;
