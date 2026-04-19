importScripts("/scram/scramjet.all.js");

if (navigator.userAgent.includes("Firefox")) {
        Object.defineProperty(globalThis, "crossOriginIsolated", {
                value: true,
                writable: true,
        });
}

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

// Take control immediately without waiting for old clients to close
self.addEventListener("install", () => self.skipWaiting());

// Claim all open pages so the SW starts intercepting right away
self.addEventListener("activate", (event) => {
        event.waitUntil(self.clients.claim());
});

async function handleRequest(event) {
        await scramjet.loadConfig();

        if (scramjet.route(event)) {
                return scramjet.fetch(event);
        }

        return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
        event.respondWith(handleRequest(event));
});
