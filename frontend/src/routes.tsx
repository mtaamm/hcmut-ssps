import { redirect, type RouteObject } from "react-router-dom";
import Layout from "./layout/Layout";
import ErrorBoundary from "./layout/ErrorBoundary";

// Hàm lazy load component
function lazy(moduleLoader: () => Promise<any>) {
  return async () => {
    const component = await moduleLoader();
    return { Component: component.default };
  };
}

// Route chính không có layout (ví dụ: Login)
const routesNoLayout: RouteObject[] = [
  {
    path: "/login",
    lazy: lazy(() => import("./pages/login/Login")),
  },
];

// Route dành cho student
const studentRoutes: RouteObject[] = [
  {
    path: "home",
    lazy: lazy(() => import("./pages/home/HomePage")),
  },
  {
    path: "create-print-job",
    lazy: lazy(() => import("./pages/print/CreatePrintJob")),
  },
  {
    path: "print-history",
    lazy: lazy(() => import("./pages/history/PrintHistory")),
  },
  {
    path: "buy-pages",
    lazy: lazy(() => import("./pages/buy/BuyPages")),
  },
  {
    path: "test",
    lazy: lazy(() => import("./pages/testAPI/test")),
  },
];

// Route dành cho SPSO
const spsoRoutes: RouteObject[] = [
  {
    path: "manage-printers",
    lazy: lazy(() => import("./pages/printers/ManagePrinters")),
  },
  {
    path: "manage-activities",
    lazy: lazy(() => import("./pages/activities/ManageActivities")),
  },
  {
    path: "manage-student-activity/:id",
    lazy: lazy(() => import("./pages/activities/ManageStudent")),
  },
];

// Route tổng hợp với layout (Bọc tất cả route bên trong Layout)
const routesWithLayout: RouteObject[] = [
  {
    path: "/",
    element: <Layout />, // Bọc tất cả route bên trong Layout
    children: [
      {
        path: "",
        loader: () => redirect("/home"), // Redirect đến trang chính khi chưa chỉ định route
      },
      ...studentRoutes, // Gộp route dành cho student
      ...spsoRoutes, // Gộp route dành cho SPSO
    ],
    errorElement: <ErrorBoundary />, // Hiển thị khi có lỗi
  },
  ...routesNoLayout, // Gộp các route không có layout (ví dụ: login)
];

export default routesWithLayout;
