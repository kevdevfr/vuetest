import VueInputAutowidth from 'vue-input-autowidth'
Vue.use(VueInputAutowidth)  /* ajoute une directive v-autowidth pour les champs inputs élastiques */

/* directive pour gérer les clicks extérieurs */
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});


/* déclaration du composant field pour les champs du tooltip/dropdown */
var field = Vue.component('field', {
  template: `
    <div class="form__field">
      <input type="text" v-model="formattedValue" :id="id"
      @blur="focusOut"
      @focus="focusIn"
      @keypress="isNumber"
      v-autowidth="{maxWidth: '100%', minWidth: '1em', comfortZone: 6}">
      <label :for="id">{{this.label}}</label>
    </div>
  `, /* Le label est après l'input pour pouvoir gérer son highlighting directement en css */
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
     id: null,
     thousandValue: this.value, /* variable tampon pour le formattage du champ */
     formattedValue: this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }
  },
  methods: {
    focusOut: function() {
        /* retire les espaces pour affecter la valeur à la variable */
        this.thousandValue = parseFloat(this.formattedValue.replace(/\s/g, ''))
        /* ajoute les espaces pour affecter la valeur formatée au champ */
        this.formattedValue = this.thousandValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },
    focusIn: function() {
        /* retire le formattage avant édition par l'utilisateur */
        this.formattedValue = this.thousandValue.toString()
    },
    isNumber: function(evt) {
      /* filtre pour refuser les caractères autres que des chiffres */
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    }
  },
  mounted() {
    /* ajout d'un id pour que les labels puissent cibler les champs */
    this.id = this._uid
  }
});

/* instance de Vue sur l'élément tooltip, peut-être que app serait plus correct */
var tooltip =  new Vue({
  el: '#tooltip',
  data: {
    title: 'Manage rules',
    isActive: false,
    isHovering : false
},
methods: {
  toggle () {
    this.isActive = !this.isActive
  },
  hide () {
    this.isActive = false
  }
}
});
