<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body">
        <o-field label="ID">
          <o-input
            type="text"
            v-model="id"
          >
          </o-input>
        </o-field>
      </section>
      <footer class="modal-card-foot">
        <o-button type="button" @click="clicked()">Join</o-button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: "MoveModal",
  emits: ["game-id", "close"],
  data() {
    return {
      id: null
    }
  },
  methods: {
    clicked() {
      this.$emit('game-id', this.id);
      this.$emit('close');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>