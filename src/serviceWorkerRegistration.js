// Copied from CRA’s official PWA setup
const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
        window.location.hostname === "[::1]" ||
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})){3}$/
        )
);

export function register(config) {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
        const swUrl = `/service-worker.js`;

        if (isLocalhost) {
            // Dev: check if service worker exists
            checkValidServiceWorker(swUrl, config);
        } else {
            registerValidSW(swUrl, config);
        }
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) return;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === "installed") {
                        if (navigator.serviceWorker.controller) {
                            console.log("New content available; refresh.");
                            if (config && config.onUpdate)
                                config.onUpdate(registration);
                        } else {
                            console.log("Content cached for offline use.");
                            if (config && config.onSuccess)
                                config.onSuccess(registration);
                        }
                    }
                };
            };
        })
        .catch((error) =>
            console.error("Error during service worker registration:", error)
        );
}

function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl)
        .then((response) => {
            const contentType = response.headers.get("content-type");
            if (
                response.status === 404 ||
                (contentType && contentType.indexOf("javascript") === -1)
            ) {
                navigator.serviceWorker.ready.then((registration) =>
                    registration
                        .unregister()
                        .then(() => window.location.reload())
                );
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log(
                "No internet connection. App is running in offline mode."
            );
        });
}

export function unregister() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) =>
            registration.unregister()
        );
    }
}
