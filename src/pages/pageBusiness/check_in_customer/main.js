import Vue from 'vue'
import App from './check_in_customer'

// add this to handle exception
Vue.config.errorHandler = function (err) {
    if (console && console.error) {
      console.error(err)
    }
  }

const app = new Vue(App)
app.$mount()
