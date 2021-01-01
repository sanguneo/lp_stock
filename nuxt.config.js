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
      { rel: 'stylesheet', href: '//fonts.googleapis.com/earlyaccess/notosanskr.css'},
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
