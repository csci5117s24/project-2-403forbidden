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
import { Firearm_Inventory_Page } from './routes/FirearmInventory.jsx';
// import { Firearm_Detail_Page } from './routes/Firearm_detail.jsx';
import {Rangevisit_Add_Page} from './routes/Rangevisit_add_page'
import {Rangevisit_Detail_Page} from './routes/Rangevisit_detail_page'
import FirearmMaintenanceInventory from './routes/FirearmMaintenanceInventory'; 
import AddMaintenance from './routes/AddMaintenance';
import DetailMaintenance from './routes/DetailMaintenance';
import EditMaintenance from './routes/EditMaintenance';
import { Firearm_Details_Page } from './routes/FirearmDetails.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      Home_Page,
      Firearm_Page,
      Firearm_Inventory_Page,
      Rangevisit_Add_Page,
      Rangevisit_Detail_Page,
      Firearm_Details_Page,
      { path: "/firearm_maintenance", element: <FirearmMaintenanceInventory /> },
      { path: "/addMaintenance", element: <AddMaintenance /> } ,
      { path: "/detailMaintenance/:firearmId", element: <DetailMaintenance /> } ,
      { path: "/editMaintenance/:id", element:<EditMaintenance /> },
      Firearm_Details_Page,

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
