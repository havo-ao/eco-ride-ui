import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import StationsPage from "../pages/StationsPage";
import RegisterPage from "../pages/RegisterPage";
import RidesPage from "../pages/RidesPage";
import AppContainer from "../components/AppContainer";
import { PublicOnly, RequireAuth } from "./guards";
import { AddCommentPage } from '../pages/AddCommentPage';
import { CommentsPage } from '../pages/ViewCommentsPage';
import VerifyEmail from '../pages/VerifyEmail'; 
import UserProfilePage from '../pages/UserProfilePage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      <Route
        path="/home"
        element={
          <AppContainer>
            <HomePage />
          </AppContainer>
        }
      />
      
      <Route
        path="/login"
        element={
          <AppContainer>
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          </AppContainer>
        }
      />
      
      <Route
        path="/register"
        element={
          <AppContainer>
            <PublicOnly>
              <RegisterPage />
            </PublicOnly>
          </AppContainer>
        }
      />

      <Route
        path="/activate/:token"
        element={
          <AppContainer>
            <PublicOnly>
              <VerifyEmail />
            </PublicOnly>
          </AppContainer>
        }
      />

      <Route
        path="/stations"
        element={
          <AppContainer>
            <RequireAuth>
              <StationsPage />
            </RequireAuth>
          </AppContainer>
        }
      />

      <Route
        path="/rides"
        element={
          <AppContainer>
            <RequireAuth>
              <RidesPage />
            </RequireAuth>
          </AppContainer>
        }
      />

      <Route
        path="/profile"
        element={
          <AppContainer>
            <RequireAuth>
              <UserProfilePage />
            </RequireAuth>
          </AppContainer>
        }
      />

      <Route 
        path="/comment" 
        element={
          <AppContainer>
            <AddCommentPage />
          </AppContainer>
        } 
      /> 

      <Route 
        path="/commentList" 
        element={
          <AppContainer>
            <CommentsPage />
          </AppContainer>
        } 
      /> 

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}