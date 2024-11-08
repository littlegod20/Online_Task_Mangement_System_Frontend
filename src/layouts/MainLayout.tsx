import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <main className="flex-grow p-4 mx-auto py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
