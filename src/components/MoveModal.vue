<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Units</p>
        <o-icon
          clickable
          native-type="button"
          icon="times"
          @click="$emit('close')"
        />
      </header>
      <section class="modal-card-body">
        {{ units }}
        <o-field label="Units">
          <o-input
            type="number"
            v-model="units"
          >
          </o-input>
        </o-field>
      </section>
      <footer class="modal-card-foot">
        <o-button type="button" @click="$emit('move-units', units)">Move</o-button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: "MoveModal",
  emits: ["move-units"],
  data() {
    return {
      units: 0
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>