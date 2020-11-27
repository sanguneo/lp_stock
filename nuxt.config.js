export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'lp_stock',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=600, user-scalable=no' },
      { hid: 'description', name: 'description', content: '' },
      { name:"theme-color", content:"#ffffff"},
      { name:"msapplication-TileColor", content:"#ffffff"},
      { name:"msapplication-TileImage", content:"/ms-icon-144x144.png"}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "icon", type:"image/png", sizes:"16x16", href:"/favicon-16x16.png"},
      { rel: "icon", type:"image/png", sizes:"32x32", href:"/favicon-32x32.png"},
      { rel: "icon", type:"image/png", sizes:"96x96", href:"/favicon-96x96.png"},
      { rel: "icon", type:"image/png", sizes:"192x192", href:"/android-icon-192x192.png"},
      { rel: "apple-touch-icon", sizes:"57x57", href:"/apple-icon-57x57.png"},
      { rel: "apple-touch-icon", sizes:"60x60", href:"/apple-icon-60x60.png"},
      { rel: "apple-touch-icon", sizes:"72x72", href:"/apple-icon-72x72.png"},
      { rel: "apple-touch-icon", sizes:"76x76", href:"/apple-icon-76x76.png"},
      { rel: "apple-touch-icon", sizes:"114x114", href:"/apple-icon-114x114.png"},
      { rel: "apple-touch-icon", sizes:"120x120", href:"/apple-icon-120x120.png"},
      { rel: "apple-touch-icon", sizes:"144x144", href:"/apple-icon-144x144.png"},
      { rel: "apple-touch-icon", sizes:"152x152", href:"/apple-icon-152x152.png"},
      { rel: "apple-touch-icon", sizes:"180x180", href:"/apple-icon-180x180.png"},
      { rel: "apple-touch-startup-image", href:"/icon.png"},
      { rel: "manifest", href:"/manifest.json"},
    ],
    script: [
      { src: "/pwacompat.min.js", async: true },
    ]
  },

  srcDir: 'src/',

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: ['@nuxtjs/pwa'],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
