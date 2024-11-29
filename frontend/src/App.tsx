import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./routes";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "./index.css"; // style your component using tailwind or css

function App() {
  return (
    <PrimeReactProvider>
      <RouterProvider router={createBrowserRouter(routes)}></RouterProvider>
    </PrimeReactProvider>
  );
}

export default App;
