import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={isHome ? "" : "pt-24"}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
