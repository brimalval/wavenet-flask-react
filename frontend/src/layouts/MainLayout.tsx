import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <main>
      <h1 className="text-2xl font-bold">Main Layout</h1>
      <Outlet />
    </main>
  );
}

export default MainLayout;
