<template>
  <div :id="territory.name"
    :style="'top: ' + territory.top + '%; left: ' + territory.left + '%; border-color: ' + territory.player.color"
    class="circle"
    :class="{ optionSelected: selected }"
  >{{ territory.units }}</div>
</template>

<script>
export default {
  name: 'TokenMarker',
  props: {
    territory: Object,
    selected: Boolean
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.circle {
    position: absolute;
    border-radius: 50%;
    text-align: center;
    vertical-align: middle;
    width: 3vw;
    height: 3vw;
    line-height: calc(3vw - 6px);
    font-size: 1vw;
    border: 3px solid;
    background: white;
}

.optionSelected {
    background: gainsboro;
}
</style>
