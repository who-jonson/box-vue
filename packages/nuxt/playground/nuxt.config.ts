export default defineNuxtConfig({
  boxVue: {
    icons: {
      default: {
        icons: ['ContentSharing32']
      },
      fill: [['Calendar16', 'CalendarIcon']]
    }
  },

  modules: [
    '@vue-macros/nuxt',
    '../src/module'
  ]
});
