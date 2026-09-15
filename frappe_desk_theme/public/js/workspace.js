// (() => {
//     const STORAGE_KEY = "my_current_workspace";

//     function getWorkspaceFromRoute() {
//         const path = window.location.pathname;

//         // Example:
//         // /desk/test
//         // /desk/test/customer
//         const match = path.match(/^\/desk\/([^/]+)/);

//         return match ? match[1] : null;
//     }

//     function saveWorkspace() {
//         const workspace = getWorkspaceFromRoute();

//         if (workspace) {
//             localStorage.setItem(STORAGE_KEY, workspace);
//         }
//     }

//     function restoreWorkspace() {
//         const workspace = localStorage.getItem(STORAGE_KEY);

//         if (!workspace) {
//             return;
//         }

//         const currentWorkspace = getWorkspaceFromRoute();

//         // If Frappe has fallen back to the default workspace,
//         // restore the user's previous workspace.
//         if (!currentWorkspace || currentWorkspace === "home") {
//             window.location.href = `/desk/${workspace}`;
//         }
//     }

//     // Save whenever the URL changes.
//     window.addEventListener("popstate", saveWorkspace);

//     // Initial load
//     setTimeout(() => {
//         saveWorkspace();
//         restoreWorkspace();
//     }, 1000);
// })();

// // console.log("====================================");
// // console.log("MARKETING SERVICES WORKSPACE JS LOADED");
// // console.log("====================================");

// // frappe.ready(() => {
// // console.log("Marketing Services JS is running!");
// // });

// // setTimeout(() => {
// //     console.log("========== ROUTE TEST ==========");
// //     console.log("URL:", window.location.href);
// //     console.log("PATH:", window.location.pathname);

// //     if (typeof frappe !== "undefined") {
// //         console.log("frappe.get_route():", frappe.get_route());
// //     }

// //     console.log("================================");
// // }, 3000);

// console.log("🔥 MARKETING SERVICES WORKSPACE JS LOADED");

// setTimeout(() => {
//     console.log("========== WORKSPACE DEBUG ==========");

//     console.log("URL:", window.location.href);
//     console.log("PATH:", window.location.pathname);

//     if (typeof frappe !== "undefined") {
//         console.log("Frappe route:", frappe.get_route());
//         console.log("Frappe route options:", frappe.get_route_str());
//     }

//     console.log("=====================================");
// }, 2000);
// (() => {
//     const STORAGE_KEY = "my_current_workspace";

//     function saveCurrentWorkspace() {
//         if (typeof frappe === "undefined") {
//             return;
//         }

//         const route = frappe.get_route();

//         console.log("Workspace route:", route);

//         // Frappe v16 workspace route:
//         // ["Workspaces", "test"]
//         if (
//             Array.isArray(route) &&
//             route[0] === "Workspaces" &&
//             route[1]
//         ) {
//             localStorage.setItem(STORAGE_KEY, route[1]);

//             console.log(
//                 "✅ Saved workspace:",
//                 route[1]
//             );
//         }
//     }

//     function restoreWorkspace() {
//         const savedWorkspace = localStorage.getItem(STORAGE_KEY);

//         if (!savedWorkspace) {
//             console.log("No saved workspace");
//             return;
//         }

//         console.log(
//             "💾 Saved workspace:",
//             savedWorkspace
//         );

//         const route = frappe.get_route();

//         // If Frappe has gone to another/default page,
//         // restore the saved workspace.
//         if (
//             !Array.isArray(route) ||
//             route[0] !== "Workspaces" ||
//             route[1] !== savedWorkspace
//         ) {
//             console.log(
//                 "🔄 Restoring workspace:",
//                 savedWorkspace
//             );

//             frappe.set_route("Workspaces", savedWorkspace);
//         }
//     }

//     function checkWorkspace() {
//         const route = frappe.get_route();

//         console.log("Current route:", route);

//         if (
//             Array.isArray(route) &&
//             route[0] === "Workspaces" &&
//             route[1]
//         ) {
//             saveCurrentWorkspace();
//         }
//     }

//     // Wait until Frappe Desk is ready
//     frappe.after_ajax(() => {
//         setTimeout(() => {
//             checkWorkspace();
//         }, 100);
//     });

//     // Detect Frappe route changes
//     if (typeof frappe !== "undefined" && frappe.router) {
//         $(document).on("route_change", () => {
//             setTimeout(() => {
//                 checkWorkspace();
//             }, 100);
//         });
//     }

//     // Restore after initial loading
//     setTimeout(() => {
//         restoreWorkspace();
//     }, 100);
// })();


// (() => {
//     const STORAGE_KEY = "my_current_workspace";

//     function saveCurrentWorkspace() {
//         if (typeof frappe === "undefined") return;

//         const route = frappe.get_route();

//         if (
//             Array.isArray(route) &&
//             route[0] === "Workspaces" &&
//             route[1]
//         ) {
//             localStorage.setItem(STORAGE_KEY, route[1]);

//             console.log("✅ Workspace saved:", route[1]);
//         }
//     }

//     function restoreWorkspace() {
//         const savedWorkspace = localStorage.getItem(STORAGE_KEY);

//         if (!savedWorkspace) {
//             console.log("No saved workspace");
//             return;
//         }

//         const route = frappe.get_route();

//         if (
//             !Array.isArray(route) ||
//             route[0] !== "Workspaces" ||
//             route[1] !== savedWorkspace
//         ) {
//             console.log("🔄 Restoring:", savedWorkspace);

//             frappe.set_route("Workspaces", savedWorkspace);
//         }
//     }

//     // Check repeatedly after Desk loads
//     function monitorWorkspace() {
//         let lastRoute = "";

//         setInterval(() => {
//             if (typeof frappe === "undefined") return;

//             const route = frappe.get_route();

//             if (!Array.isArray(route)) return;

//             const routeString = route.join("/");

//             if (routeString !== lastRoute) {
//                 lastRoute = routeString;

//                 console.log("🔀 Route changed:", route);

//                 if (
//                     route[0] === "Workspaces" &&
//                     route[1]
//                 ) {
//                     saveCurrentWorkspace();
//                 }
//             }
//         }, 300);
//     }

//     frappe.after_ajax(() => {
//         setTimeout(() => {
//             restoreWorkspace();
//             monitorWorkspace();
//         }, 500);
//     });
// })();


(() => {
    const STORAGE_KEY = "my_current_workspace";
    const PAGE_ROUTE_KEY = "my_current_page_route";

    function isWorkspaceRoute(route) {
        return (
            Array.isArray(route) &&
            route[0] === "Workspaces" &&
            route[1]
        );
    }

    function saveCurrentWorkspace() {
        if (typeof frappe === "undefined") return;

        const route = frappe.get_route();

        if (isWorkspaceRoute(route)) {
            localStorage.setItem(
                STORAGE_KEY,
                route[1]
            );

            console.log(
                "✅ Workspace saved:",
                route[1]
            );
        }
    }

    function saveCurrentPage() {
        if (typeof frappe === "undefined") return;

        const route = frappe.get_route();

        if (
            Array.isArray(route) &&
            route.length &&
            !isWorkspaceRoute(route)
        ) {
            localStorage.setItem(
                PAGE_ROUTE_KEY,
                JSON.stringify(route)
            );

            console.log(
                "📄 Page saved:",
                route
            );
        }
    }

    function restoreWorkspaceAndPage() {
        if (typeof frappe === "undefined") return;

        const savedWorkspace =
            localStorage.getItem(STORAGE_KEY);

        const savedPage =
            localStorage.getItem(PAGE_ROUTE_KEY);

        if (!savedWorkspace) {
            console.log("No saved workspace");
            return;
        }

        const currentRoute = frappe.get_route();

        console.log(
            "Current route:",
            currentRoute
        );

        /*
         * If we are already on a Workspace,
         * don't replace the current page.
         */
        if (isWorkspaceRoute(currentRoute)) {
            if (currentRoute[1] !== savedWorkspace) {

                console.log(
                    "🔄 Restoring workspace:",
                    savedWorkspace
                );

                frappe.set_route(
                    "Workspaces",
                    savedWorkspace
                );
            }

            return;
        }

        /*
         * We are on another page.
         *
         * Restore Workspace first.
         */
        console.log(
            "🏠 Restoring workspace:",
            savedWorkspace
        );

        frappe.set_route(
            "Workspaces",
            savedWorkspace
        );

        /*
         * Then restore the page.
         */
        if (savedPage) {
            try {
                const pageRoute =
                    JSON.parse(savedPage);

                console.log(
                    "📄 Restoring page:",
                    pageRoute
                );

                setTimeout(() => {

                    frappe.set_route(
                        ...pageRoute
                    );

                }, 500);

            } catch (error) {

                console.error(
                    "❌ Could not restore page:",
                    error
                );

            }
        }
    }

    function monitorWorkspace() {

        let lastRoute = "";

        setInterval(() => {

            if (
                typeof frappe === "undefined"
            ) {
                return;
            }

            const route =
                frappe.get_route();

            if (!Array.isArray(route)) {
                return;
            }

            const routeString =
                route.join("/");

            if (
                routeString !== lastRoute
            ) {

                lastRoute =
                    routeString;

                console.log(
                    "🔀 Route changed:",
                    route
                );

                if (
                    isWorkspaceRoute(route)
                ) {

                    saveCurrentWorkspace();

                } else {

                    saveCurrentPage();

                }
            }

        }, 300);
    }

    frappe.after_ajax(() => {

        setTimeout(() => {

            restoreWorkspaceAndPage();

            monitorWorkspace();

        }, 500);

    });

})();