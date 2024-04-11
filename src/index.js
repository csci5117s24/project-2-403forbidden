import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Home_Page } from './routes/Home'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import UserInfoProvider from './UserInfoProvider'
import { Firearm_Page } from './routes/Firearm_page';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      Home_Page,
      Firearm_Page
    ]
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserInfoProvider>
      <RouterProvider router={router} />
    </UserInfoProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
