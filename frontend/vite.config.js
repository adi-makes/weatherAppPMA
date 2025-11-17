/**
 * ============================================================================
 * Vite Configuration File
 * ============================================================================
 * This file configures the Vite build system for the React frontend.
 *
 * Key features:
 *  - Enables @vitejs/plugin-react (JSX transform, fast refresh)
 *  - Configures the development server port (default: 5173)
 *
 * Additional options (proxy, alias, envDir, etc.) can be added later if needed.
 * ============================================================================
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Export Vite config
export default defineConfig({
  plugins: [
    react() // Enables React Fast Refresh + JSX transformations
  ],

  server: {
    port: 5173, // Local dev server port
  }
});
