/**
 * ============================================================================
 * Frontend Entry Point
 * ============================================================================
 * This file bootstraps the React application. It:
 *  - Imports global styles
 *  - Mounts <App /> into the root DOM container
 *  - Uses React 18's createRoot() API for concurrent rendering support
 * ============================================================================
 */

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";  // Global styles (variables, layout, animations, components)

/**
 * Mount the main <App /> component inside the #root element.
 * React 18's `createRoot` improves performance and enables concurrent features.
 */
const rootElement = document.getElementById("root");
createRoot(rootElement).render(<App />);
