import React from "react";
import ReactDOM from "react-dom/client"; // 👈 Notice the "/client"
import App from "./App";
import "./index.css";

import {AuthProvider} from "./context/AuthContext";
import {UserDataProvider} from "./context/userDataContext";
import {SearchProvider} from "./context/SearchContext";
import {FilterProvider} from "./context/FilterContext";
import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faStar as solidStar,
    faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Call it at the end
serviceWorkerRegistration.register({
    onUpdate: (registration) => {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    },
});

library.add(solidStar, faStarHalfAlt);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <UserDataProvider>
                <FilterProvider>
                    <SearchProvider>
                        <App />
                    </SearchProvider>
                </FilterProvider>
            </UserDataProvider>
        </AuthProvider>
    </React.StrictMode>
);
