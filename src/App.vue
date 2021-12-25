<template>
  <div>
    <div>
      <p>Current player: {{ gameModel.currentPlayer }}</p>
      <p>Phase: {{ gameModel.phase }}</p>
      <p v-if="gameModel.phase == 'DRAFT' || gameModel.phase == 'ALLDRAFT'">Units to place: {{ gameModel.unitsToPlace }}</p>
      <p>Error: {{ gameModel.error }}</p>
      <!-- <o-button size="medium" variant="primary" @click="moveModalActive = true">
        Open modal (Component)
      </o-button> -->
      <!-- <o-modal v-model:active="moveModalActive">
        <move-modal v-model:units="unitsToMove" @close="moveModalActive = false"/>
      </o-modal> -->
    </div>
    <div class="map-container">
      <img
        class="map"
        alt="Risk board"
        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Risk_board.svg"
      />

      <Marker
        v-for="(territory, index) in gameModel.territories"
        :key="'marker-' + index"
        :territory="territory"
        @click="clicked(territory)"
        :selected="territory.name === lastSelected?.name"
      />
    </div>
  </div>
</template>

<script>
import * as axios from "axios";
import Marker from "./components/Marker.vue";
import MoveModal from './components/MoveModal.vue';


export default {
  name: "App",
  components: {
    Marker,
  },
  data() {
    return {
      gameModel: {},
      lastSelected: null,
      // moveModalActive: false,
      // unitsToMove: 3
    };
  },
  methods: {
    clicked(territory) {
      switch (this.gameModel.phase) {
        case "DRAFT":
        case "ALLDRAFT":
          this.draft(territory);
          break;

        case "ATTACK":
          this.attack(territory);
          break;
        case "MOVE":
          // this.modal();
          this.modal()
          break;
        case "FORTIFY":
          break;
        default:
          console.log("No phase for " + this.gameModel.phase)
      }

    },
    draft(territory) {
      const draft_data = { 
        territory: territory.name 
      };
      axios
        .post("http://localhost:8080/api/draft", draft_data)
        .then((response) => {
          this.gameModel = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    attack(territory) {
      const currentPlayer = this.gameModel.currentPlayer;
      if (this.lastSelected != null && this.lastSelected.player == currentPlayer && territory.player != currentPlayer) {
        console.log("ATTACK")
        const attack_data = { 
          from: this.lastSelected.name,
          to: territory.name 
        };
        axios
          .post("http://localhost:8080/api/attack", attack_data)
          .then((response) => {
            this.gameModel = response.data;
            
          })
          .catch((error) => {
            console.log(error);
          });
        this.lastSelected = null;
        if (this.gameModel.phase == "MOVE") {
          this.modal()
        }
      } else if (territory.player == currentPlayer) {
        this.lastSelected = territory;
      }
    },
    move(unitsToMove) {
      // this.moveModalActive = true;
      console.log(unitsToMove)
      
      axios
        .post("http://localhost:8080/api/move", { units: unitsToMove } )
        .then((response) => {
          this.gameModel = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    modal() {
      // const modal = MoveModal
      this.$oruga.modal.open({
        parent: this,
        component: MoveModal,
        trapFocus: true,
        events: {
          "move-units": this.move
        },
      })
    }
  },
  mounted() {
    axios
      .get("http://localhost:8080/api/game")
      .then((response) => {
        console.log(response.data);
        this.gameModel = response.data;
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
