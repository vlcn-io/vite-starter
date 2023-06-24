import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import schema from "./schemas/main.mjs";
import { endpoints } from "./SyncEndpoints.ts";
import { DBProvider } from "@vlcn.io/react";

const dbid = "cf5eb45ae3a8497b8df6e6b937d8d993";

// Launch our app.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DBProvider dbid={dbid} schema={schema} endpoints={endpoints}>
    <App dbid={dbid} />
  </DBProvider>
);
