"use client";

import { ReactNode } from "react";
import classes from "./Layout.module.css";
import Header from "components/header/Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={classes.layoutWrapper}>
      <Header />
      <main className={classes.mainContent}>{children}</main>
    </div>
  );
}
