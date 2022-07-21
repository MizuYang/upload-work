import { createApp } from 'vue'
import 'bootstrap'
import axios from 'axios'
import VueAxios from 'vue-axios'

// import 'vue-simple-uploader/dist/style.css'
// import uploader from 'vue-simple-uploader'
import uploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(uploader)
app.use(router)
app.use(VueAxios, axios)

app.mount('#app')
