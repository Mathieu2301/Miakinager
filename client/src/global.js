import header from './vues/components/header.vue'
import footer from './vues/components/footer.vue'

import loader from './vues/components/loader.vue'

export const components = {
    'miak-header':  header,
    'miak-footer':  footer,
    loader:         loader,
}

export const filters = {
    memory: val => Math.round(val/100000)/10,
    uppercasefirst: val => val[0].toUpperCase() + val.slice(1),
}