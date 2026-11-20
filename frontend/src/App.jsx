import {Routes, Route ,Navigate} from "react-router";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import CreateProblemPage from "./pages/CreateProblemPage.jsx";
import EditProblemPage from "./pages/EditProblemPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);



  return(
  <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<HomePage></HomePage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<LoginPage></LoginPage>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<SignupPage></SignupPage>}></Route>
      
      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/create"
        element={
          <AdminRoute>
            <CreateProblemPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={
          <AdminRoute>
            <EditProblemPage />
          </AdminRoute>
        }
      />
    </Routes>
  </>
  )
}

export default App;