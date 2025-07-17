import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import i18n from './i18n'
import './styles/theme.css'

const app = createApp(App)

if (localStorage.getItem('darkTheme') === '1') {
  document.body.classList.add('dark-theme')
}

app.use(router)
app.use(i18n)

app.mount('#app')
