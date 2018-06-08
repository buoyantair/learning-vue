
const eventBus = new Vue()
Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
      <label for="recommend"> Would you recommend this project?</label>
      Yes: <input id="recommend" value="yes" v-model="recommend" type="radio">
      No: <input id="recommend" value="no" v-model="recommend" type="radio">
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: false,
      errors: [

      ]
    }
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if(this.name && this.review && this.rating && typeof this.recommend === 'string') {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        eventBus.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if(!this.name) this.errors.push('name required');
        if(!this.review) this.errors.push('review required');
        if(!this.rating) this.errors.push('rating required');
        if(!typeof this.recommend === 'string') this.errors.push('recommendation required');
      }
      
    }
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true,
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">
        {{ detail }}
      </li>
    </ul>
  `
})


Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    }
  },
  template: `
  <div class="product">
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
      <p>Shipping: {{ shipping }}</p>

      <product-details :details="details"></product-details>
      
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
      <button
        v-on:click="removeFromCart"
      >
        Remove product
      </button>
    </div>

    <product-tabs :reviews="reviews">

    </product-tabs>
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
      onSale: true,
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
    },
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
    shipping() {
      return this.premium ? 'Free' : '2.99'
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    })
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true,
    }
  },
  template: `
    <div>
      <span
        class="tab"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectedTab = tab"
        :class="{ activeTab: selectedTab === tab }"
      >
        {{ tab }}
      </span>

      <div v-show="selectedTab === 'Reviews'">
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet</p>
        <ul>
          <li v-for="review in reviews">
            <p>Name: {{ review.name }}</p>
            <p>Review: {{ review.review }}</p>
            <p>Rating: {{ review.rating }}</p>
          </li>
        </ul>
      </div>

      <product-review
        v-show="selectedTab === 'Write a review'"
      ></product-review>
    </div>
  `,
  data() {
    return {
      tabs: [
        'Reviews', 'Write a review'
      ],
      selectedTab: 'Reviews',
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(variantId) {
      this.cart.push(variantId);
    },
    removeFromCart(variantId) {
      this.cart = this.cart.filter(x => x.variantId === variantId);
    },
  }
})