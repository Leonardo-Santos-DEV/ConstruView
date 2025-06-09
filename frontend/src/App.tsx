import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import {APP_ROUTES} from "./helpers/constants";
import {LoginScreen} from "./pages/LoginScreen";
import {ProjectsScreen} from "./pages/ProjectsScreen";
import {ProjectDetailScreen} from "./pages/ProjectDetailScreen";
import {DocsScreen} from "./pages/DocsScreen";
import {ThreeSixtyGalleryScreen} from "./pages/ThreeSixtyGalleryScreen";
import {ThreeSixtyViewScreen} from "@/pages/ThreeSixtyViewScreen.tsx";
import {AerialViewsScreen} from "@/pages/AerialViewsScreen.tsx";
import {LiveCamScreen} from "@/pages/LiveCamScreen.tsx";
import {AuthProvider} from "@/context/AuthContext.tsx";
import {AdminRouteVerify} from "@/components/AdminRouteVerify.tsx";
import {ClientsScreen} from "@/pages/ClientsScreen.tsx";
import {ClientUsersScreen} from "@/pages/ClientUsersScreen.tsx";
import {RootRedirect} from "@/components/RootRedirect.tsx";
import {ProtectedRoute} from "@/components/ProtectedRoute.tsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={APP_ROUTES.HOME} element={<RootRedirect/>}/>
          <Route path={APP_ROUTES.LOGIN} element={<LoginScreen/>}/>
          <Route element={<ProtectedRoute />}>
          <Route
            path={APP_ROUTES.PROJECTS}
            element={<ProjectsScreen/>}
          />
          <Route
            path={APP_ROUTES.PROJECT_DETAIL_BASE + "/:projectId"}
            element={<ProjectDetailScreen/>}
          />
          <Route
            path={APP_ROUTES.PROJECT_DETAIL_BASE + "/:projectId" + APP_ROUTES.DOCS_RELATIVE}
            element={<DocsScreen/>}
          />
          <Route
            path={APP_ROUTES.PROJECT_DETAIL_BASE + "/:projectId" + APP_ROUTES.THREE_SIXTY_GALLERY_RELATIVE}
            element={<ThreeSixtyGalleryScreen/>}
          />
          <Route
            path={APP_ROUTES.PROJECT_DETAIL_BASE + "/:projectId" + APP_ROUTES.THREE_SIXTY_VIEW_RELATIVE + "/:viewId"}
            element={<ThreeSixtyViewScreen/>}
          />
          <Route
            path={APP_ROUTES.PROJECT_DETAIL_BASE + "/:projectId" + APP_ROUTES.AERIAL_VIEWS_RELATIVE}
            element={<AerialViewsScreen/>}
          />
          <Route
            path={APP_ROUTES.PROJECT_DETAIL_BASE + "/:projectId" + APP_ROUTES.LIVE_CAM_RELATIVE}
            element={<LiveCamScreen/>}
          />
            <Route element={<AdminRouteVerify/>}>
              <Route path={APP_ROUTES.CLIENTS} element={<ClientsScreen/>}/>
              <Route path={`${APP_ROUTES.CLIENT_USERS_BASE}/:clientId/users`} element={<ClientUsersScreen/>}/>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={APP_ROUTES.LOGIN}/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
