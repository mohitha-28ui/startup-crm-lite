import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";

/**
 * Root Application Component.
 * Wraps routes inside BrowserRouter and mounts the notification Toaster.
 */
function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications config */}
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Dynamic route rendering gate */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
