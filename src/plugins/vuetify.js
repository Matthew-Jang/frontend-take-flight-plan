// src/plugins/vuetify.js

import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
// labs calendar
import { VCalendar } from "vuetify/labs/VCalendar"

// load your webfonts
import { loadFonts } from "./webfontloader"
loadFonts()

// styles
import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"

// ───────────────────────────────────────────────────────────
// 1. BRAND THEME
// ───────────────────────────────────────────────────────────
const brandTheme = {
  dark: false,
  colors: {
    primary:    "#811429", // OC Maroon
    secondary:  "#48111c", // OC Dark Maroon
    accent:     "#f9c634", // OC Marigold
    info:       "#bde3dc", // OC Sky
    success:    "#5ec4b6", // OC Ethos
    warning:    "#f68d76", // OC Salmon
    error:      "#48111c", // reuse Dark Maroon
    background: "#f4ecd0", // OC Cream
    surface:    "#ffffff", // White
    // extra tertiaries (optional usage via color="oc-storm")
    "oc-salmon": "#f68d76",
    "oc-sky":    "#bde3dc",
    "oc-storm":  "#708e9a",
    "oc-ethos":  "#5ec4b6",
  },
}

// ───────────────────────────────────────────────────────────
// 2. VUETIFY INSTANCE
// ───────────────────────────────────────────────────────────
export default createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "brandTheme",
    themes: {
      brandTheme,
    },
  },
  defaults: {
    // global ripple on click
    global: {
      ripple: true,
    },
    // branded button defaults
    VBtn: {
      elevation: 2,
      rounded: "8px",            // matches $radius-base
      style: {
        textTransform: "none",
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.875rem",    // 14px
      },
    },
    // branded card defaults
    VCard: {
      elevation: 2,
      rounded: "8px",
    },
    // inputs with comfortable density & rounded corners
    VTextField: {
      density: "comfortable",
      rounded: "8px",
    },
  },
})
