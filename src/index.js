import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddTechnology from "./feature/admin/AddTechnology.jsx";
import AdminDashboard from "./feature/admin/AdminDashboard.jsx";
import AddConcept from "./feature/admin/AddConcept.jsx";
import Edittechnology from "./feature/admin/Edittechnology.jsx";
import AddContent from "./feature/admin/AddContent.jsx";
import Topicdetails from "./feature/admin/Topicdetails.jsx";

import UserDashboard from "./feature/user/UserDashboard.jsx";
import Technology from "./feature/user/Technology.jsx";
import Technologydetails from "./feature/user/Technologydetails.jsx";
import TopicDetails from "./feature/user/TopicDetails.jsx";
import AdminTechnology from "./feature/admin/AdminTechnology.jsx";
import AddTopicc from "./feature/admin/AddTopicc.jsx";
import EditContent from "./feature/admin/EditContent.jsx";
import EditTopic from "./feature/admin/EditTopic.jsx";
import QuestionBank from "./feature/admin/QuestionBank.jsx";
import Quizes from "./feature/admin/Quizes.jsx";
import CreateQuiz from "./components/CreateQuiz.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard></AdminDashboard>,
        children: [
          {
            path: "/admin/technology",
            element: <AdminTechnology></AdminTechnology>,
          },
          {
            path: "/admin/addtechnology",
            element: <AddTechnology></AddTechnology>,
          },
          {
            path:"/admin/questionbank",
            element: <QuestionBank></QuestionBank>
          },
          {
            path:"/admin/quizes",
            element: <Quizes></Quizes>
          },
          {
            path:"/admin/quizes/createquiz",
            element: <CreateQuiz></CreateQuiz>
          },
          {
            path:"/admin/quizes/editquiz/:Id",
            element: <CreateQuiz></CreateQuiz>
          },
          {
            path: "/admin/addconcept/:tid",
            element: <AddConcept></AddConcept>,
            children: [
              {
                path: "/admin/addconcept/:tid/edittechnology",
                element: <Edittechnology></Edittechnology>,
              },
              {
                path: "/admin/addconcept/:tid/addtopic/:cid",
                element: <AddTopicc></AddTopicc>,
              },
              {
                path: `/admin/addconcept/:tid/edittopic/:cid/:topicid`,
                element: <EditTopic></EditTopic>,
              },
              {
                path: "/admin/addconcept/:tid/topicdetails/:cid/:topicId",
                element: <Topicdetails></Topicdetails>,
                children: [
                  {
                    path: "/admin/addconcept/:tid/topicdetails/:cid/:topicId/addcontent",
                    element: <AddContent></AddContent>,
                  },
                ],
              },
              {
                path: "/admin/addconcept/:tid/edittopic/:cid/:topicId/:contentId/editcontent",
                element: <EditContent></EditContent>,
              },
            ],
          },
          {
            path: "/admin/addconcept/:tid/:cid",
            element: <AddConcept></AddConcept>,
          },
        ],
      },
      {
        path: "/",
        element: <UserDashboard></UserDashboard>,
        children: [
          {
            path: "/",
            element: <Technology></Technology>,
          },
          {
            path: "/Training/:tName",
            element: <Technologydetails></Technologydetails>,
            children: [
              {
                path: "/Training/:tName/:cName/:toName",
                element: <TopicDetails></TopicDetails>,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
