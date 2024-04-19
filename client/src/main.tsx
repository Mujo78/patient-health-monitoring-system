import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./app/store.ts";
import "flowbite/dist/flowbite.css";
import CustomSpinner from "./components/UI/CustomSpinner.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense
        fallback={
          <div className="h-screen w-full">
            <CustomSpinner />
          </div>
        }
      >
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>,
);
