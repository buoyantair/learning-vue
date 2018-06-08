Vue.component('product', {
  template: `
  <div class="product">
    <product message="meow"></product>
    <div class="product-image">
      <img v-bind:src="image" alt="green sock">
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">
        In stock
      </p>
      <p
        v-else :class="{ outOfStock: !inStock }"
      >
        Out of stock
      </p>

      <ul>
        <li v-for="detail in details">
          {{ detail }}
        </li>
      </ul>
      
      <div 
        v-for="(variant, index) in variants"
        :key="variant.variantId"
        class="color-box"
        :style="{ backgroundColor: variant.variantColor }"
        @mouseover="updateProduct(index)"
      >
      </div>

      <button
        v-on:click="addToCart"
        :disabled="!inStock"
        :class="{ disabledButton: !inStock }"
      >Add to cart</button>

      <p>
          {{ test }}
      </p>

      <div class="cart">
        <p>
          Cart({{cart}})
        </p>
      </div>

    </div>
  </div>
  `,
  data() {
   return {
    brand: 'Vue Mastrey',
    product: 'Socks',
    selectedVariant: 0,
    details: [
      "80% cotton",
      "20% polyester",
      "Gender-neutral"
    ],
    variants: [{
        variantId: 2234,
        variantColor: "green",
        variantImage: './assets/green-sock.jpeg',
        variantQuantity: 10,
      },
      {
        variantId: 2235,
        variantColor: "blue",
        variantImage: './assets/blue-sock.jpg',
        variantQuantity: 0,
      }
    ],
    sizes: [
      2,
      5
    ],
    cart: 0,
    onSale: true
   }
  },
  methods: {
    addToCart: function () {
      this.cart += 1;
    },
    updateProduct: function (index) {
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return `${this.brand} ${this.product}`;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    test() {
      return this.onSale ? `${this.brand} is on sale!` : '';
    },
  }
})

const app = new Vue({
  el: '#app',
})