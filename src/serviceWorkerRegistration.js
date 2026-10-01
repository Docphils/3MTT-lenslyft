// Copied from CRA's official PWA setup, with automatic updates enabled.
const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
        window.location.hostname === "[::1]" ||
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|\d{1,2})){3}$/
        )
);

export function register(config = {}) {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
        const swUrl = "/service-worker.js";

        if (isLocalhost) {
            checkValidServiceWorker(swUrl, config);
        } else {
            registerValidSW(swUrl, config);
        }
    }
}

function registerValidSW(swUrl, config) {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let refreshing = false;

    // Reload existing app windows once the updated worker takes control.
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hadController || refreshing) return;

        refreshing = true;
        window.location.reload();
    });

    navigator.serviceWorker
        .register(swUrl, { updateViaCache: "none" })
        .then((registration) => {
            // Check for a deployment update when the app opens.
            registration.update().catch(() => {});

            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (!installingWorker) return;

                installingWorker.onstatechange = () => {
                    if (installingWorker.state !== "installed") return;

                    if (navigator.serviceWorker.controller) {
                        console.log("New content available; applying update.");

                        if (config.onUpdate) {
                            config.onUpdate(registration);
                        }
                    } else {
                        console.log("Content cached for offline use.");

                        if (config.onSuccess) {
                            config.onSuccess(registration);
                        }
                    }
                };
            };
        })
        .catch((error) => {
            console.error("Error during service worker registration:", error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl)
        .then((response) => {
            const contentType = response.headers.get("content-type");

            if (
                response.status === 404 ||
                (contentType && !contentType.includes("javascript"))
            ) {
                navigator.serviceWorker.ready.then((registration) =>
                    registration.unregister().then(() => window.location.reload())
                );
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log("No internet connection. App is running in offline mode.");
        });
}

export function unregister() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) =>
            registration.unregister()
        );
    }
}
