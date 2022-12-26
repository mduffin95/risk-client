<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body">
        <o-field :label="label">
          <o-input
            type="number"
            :min="min"
            :max="max"
            v-model="units"
          >
          </o-input>
        </o-field>
      </section>
      <footer class="modal-card-foot">
        <o-button type="button" @click="clicked()">Move</o-button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: "MoveModal",
  emits: ["move-units"],
  props: {
    label: String,
    min: Number,
    max: Number
  },
  data() {
    return {
      units: this.min
    }
  },
  methods: {
    clicked() {
      this.$emit('move-units', this.units);
      this.$emit('close')
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>