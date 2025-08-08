import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './routers'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Card from 'primevue/card'
import Textarea from 'primevue/textarea'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './assets/main.css'

import Tag from 'primevue/tag'
import Tooltip from 'primevue/tooltip'

import Chips from 'primevue/chips'


const app = createApp(App)

app.component('Chips', Chips)
app.use(PrimeVue)
app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)
app.component('Tag', Tag)
app.directive('tooltip', Tooltip)
app.component('Button', Button)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)
app.component('InputText', InputText)
app.component('Checkbox', Checkbox)
app.component('Card', Card)
app.component('Textarea', Textarea)

app.mount('#app')
