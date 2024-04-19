import Login from "./pages/login";
import Register from "./pages/register";
import Header from "./components/navbar";
import Home from "./pages";
import { AuthProvider } from "./context/";
import { useRoutes } from "react-router-dom";
import Prediction from "./pages/predict";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/predict",
      element: <Prediction />,
    },

  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div>{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
