import React from 'react';
import Dashboard from '../Layout/Dashboard';
import Login from '../Pages/Auth/Login';
import ForgetPassword from '../Pages/Auth/ForgetPassword';
import Otp from '../Pages/Auth/Otp';
import ResetPassword from '../Pages/Auth/ResetPassword';
import { createBrowserRouter } from 'react-router';
import UserManage from '../Pages/Dashboard/UserManage/UserManage.jsx';
import TermsCondition from '../Pages/Dashboard/TermsCondition';
import PrivacyPolicy from '../Pages/Dashboard/PrivacyPolicy';
import Profile from '../Pages/Dashboard/Profile.jsx';
import ManagerManage from '../Pages/Dashboard/ManagerManage/ManagerManage.jsx';
import FinanceManagement from '../Pages/Dashboard/FinanceManger/FinanceManagement.jsx';
import OfficeManage from '../Pages/Dashboard/OfficeManager/OfficeManage.jsx';
import ProjectManagement from '../Pages/Dashboard/ProjectManagement.jsx';
import ProjectDetails from '../Pages/Dashboard/ProjectDetails.jsx';
import ProjectPhotos from '../Components/Project_Details_photo/ProjectPhotos.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import CreateNewProject from '../Pages/Dashboard/CreateNewProject';
import EditProjects from '../Pages/Dashboard/EditProjects.jsx';
import AllDocuments from '../Pages/Dashboard/AllDocuments.jsx';
export const Routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: <UserManage />,
      },
      {
        path: '/manager-manage',
        element: <ManagerManage />,
      },

      {
        path: '/finance-management',
        element: <FinanceManagement />,
      },
      {
        path: '/Office-manage',
        element: <OfficeManage />,
      },
      {
        path: '/project-manage',
        element: <ProjectManagement />,
      },
      {
        path: '/project-manage/:id',
        element: <ProjectDetails />,
      },
      {
        path: '/all-document',
        element: <AllDocuments />,
      },
      {
        path: '/project-all_photos',
        element: <ProjectPhotos />,
      },
      {
        path: '/add-new-project',
        element: <CreateNewProject />,
      },
      {
        path: '/edit-project',
        element: <EditProjects />,
      },
      {
        path: '/terms-&-condition',
        element: <TermsCondition />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgetPassword />,
  },
  {
    path: '/otp',
    element: <Otp />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
]);
