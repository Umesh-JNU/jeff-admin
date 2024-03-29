import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Store } from "./states/store";

import { AdminProtectedRoute, UnprotectedRoute } from "./routes";
import { Header, SideNavBar, NotFound } from "./components";
import {
  AdminLoginScreen, Dashboard, Profile,
  Users, ViewUser,
  Location, ViewLocation, AddLocation,
  Truck, ViewTruck, AddTruck,
  Mill, ViewMill, AddMill,
  Message, ViewMessage,
  Content, AddContent, EditContent,
  Trip, ViewTrip, CalculateFare,
  TimeTracker, UserTimeTracker
} from "./pages";

function App() {
  const { state } = useContext(Store);
  const { token } = state;

  const pageLocation = useLocation();

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);

  const routeList = [
    { path: "/admin/view-profile", element: <Profile /> },
    { path: "/admin/dashboard", element: <Dashboard /> },
    { path: "/admin/drivers", element: <Users /> },
    { path: "/admin/view/driver/:id", element: <ViewUser /> },
    { path: "/admin/locations", element: <Location /> },
    { path: "/admin/location/create", element: <AddLocation /> },
    { path: "/admin/view/location/:id", element: <ViewLocation /> },
    { path: "/admin/trucks", element: <Truck /> },
    { path: "/admin/truck/create", element: <AddTruck /> },
    { path: "/admin/view/truck/:id", element: <ViewTruck /> },
    { path: "/admin/mills", element: <Mill /> },
    { path: "/admin/mill/create", element: <AddMill /> },
    { path: "/admin/view/mill/:id", element: <ViewMill /> },
    { path: "/admin/trips", element: <Trip /> },
    { path: "/admin/view/trip/:id", element: <ViewTrip /> },
    { path: "/admin/trip/calc-fare", element: <CalculateFare /> },
    { path: "/admin/messages", element: <Message /> },
    { path: "/admin/view/message/:id", element: <ViewMessage /> },
    { path: "/admin/contents", element: <Content /> },
    { path: "/admin/content/create", element: <AddContent /> },
    { path: "/admin/content/edit", element: <EditContent /> },
    { path: "/admin/time-tracker", element: <TimeTracker /> },
    { path: "/admin/time-tracker/dId/:id", element: <UserTimeTracker /> },
  ];

  return (
    <div className="main-wrapper">
      {isExpanded && token && (
        <div className="sidebar-overlay" onClick={sidebarHandler}></div>
      )}
      <div className="sidebar-wrapper">
        <SideNavBar isExpanded={isExpanded} />
      </div>
      <div
        className={`body-wrapper ${isExpanded ? "mini-body" : "full-body"}
        ${token ? "" : "m-0"} d-flex flex-column`}
      >
        <Header sidebarHandler={sidebarHandler} />
        <Routes location={pageLocation} key={pageLocation.pathname}>
          <Route
            path="/"
            element={
              <UnprotectedRoute>
                <AdminLoginScreen />
              </UnprotectedRoute>
            }
          />

          {routeList.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<AdminProtectedRoute>{element}</AdminProtectedRoute>}
            />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default App;
