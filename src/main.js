import { createApp } from 'vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './style.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);


import App from './App.vue'

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app')
