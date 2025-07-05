<template>
  <div class="book">
    <TheHeader :current-route="currentRoute"/>
    <Book />
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from '../components/Base/TheHeader.vue'
import Book from '../views/Book.vue'
import TheFooter from '../components/Base/TheFooter.vue'
export default {
  name: "book-layout",
  data() {
    return {}
  },
  components: {
    TheHeader,
    Book,
    TheFooter
  },
  created() { },
  methods: {},
  computed: {
    currentRoute() {
      return this.$router.currentRoute._value.name
    }
  } 
};
</script>
<style lang="scss" scoped>
.book {
  background-color: #080713;
  min-height: 100vh;
}
</style>