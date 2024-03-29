const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/CingRong/'
  }
} : {}
export default {
  target: 'static',
  ...routerBase,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '慶榮五金行 | CingRong',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
  { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'Keywords', content: '慶榮,慶榮五金行,五金行,CingRong,鋁欄杆,鋁門,鋁窗,紗門,紗窗,百葉鋁窗,鋁材買賣業務,一般大小五金,一般機械,建築五金,建材買賣業務'},
      { name: 'Description', content: '慶榮五金行 | CingRong 鋁欄杆、鋁門、鋁窗、紗門、紗窗、百葉鋁窗、鋁材買賣業務、一般大小五金、一般機械、建築五金、建材買賣業務'},
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://raw.githubusercontent.com/dwm331/CingRong/main/static/img/logo/android-chrome-192x192.png' },
      { property: 'og:title', content: '慶榮五金行 | CingRong 鋁材買賣業務、一般大小五金、一般機械、建築五金、建材買賣業務' },
      { property: 'og:description', content: '慶榮五金行 | CingRong 鋁欄杆、鋁門、鋁窗、紗門、紗窗、百葉鋁窗、鋁材買賣業務、一般大小五金、一般機械、建築五金、建材買賣業務'},
      { property: 'og:url', content: 'https://dwm331.github.io/CingRong/' },
      { name: 'google-site-verification', content: 'XcnBcvJXnhxMKG5AoFu9t_vXLBirG4kVOgXr-tXRm1c' },
      { name: 'msvalidate.01', content: 'E1A716417EA63AD8F62A4D7AE9368303' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://raw.githubusercontent.com/dwm331/CingRong/main/static/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/jpeg', href: 'https://raw.githubusercontent.com/dwm331/CingRong/main/static/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/fireauth.js'
  ],
  services: [
    '~/services/fireinit.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],

  vendor: [
    'firebase'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  axios: {
    // Used as fallback if no runtime config is provided，https://axios.nuxtjs.org/options/
  }
}
