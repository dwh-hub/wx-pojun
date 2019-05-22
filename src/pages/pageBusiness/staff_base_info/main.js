import Vue from 'vue'
import App from './staff_base_info'

// add this to handle exception
Vue.config.errorHandler = function (err) {
    if (console && console.error) {
      console.error(err)
    }
  }

const app = new Vue(App)
app.$mount()
