<template>
  <div>
    <div class="map-container">
      <img
        class="map"
        alt="Risk board"
        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Risk_board.svg"
      />
      <Marker
        v-for="(territory, index) in territories"
        :key="'marker-' + index"
        :territory="territory"
      />
    </div>
  </div>
</template>

<script>
import * as axios from "axios";
import Marker from "./components/Marker.vue";

export default {
  name: "App",
  components: {
    Marker,
  },
  data() {
    return {
      territories: [
        {
          top: 50,
          left: 50,
          units: 1,
          color: "red",
        },
      ],
    };
  },
  mounted() {
    axios
      .get('http://localhost:8080/api/game')
      .then((response) => {
        console.log(response.data);
        this.territories = response.data
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.map-container {
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}
.map {
  width: 100%;
}
</style>
