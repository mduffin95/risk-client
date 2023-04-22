import axios from "axios";

function getUrl() {
  let url = process.env.VUE_APP_BACKEND_URL + ":" + process.env.VUE_APP_BACKEND_PORT;
  console.log(url);
  return url;
}

const axiosClient = axios.create({
  baseURL: getUrl(),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export function sendDraft(id, player, territoryName) {
  const draftData = { 
    requestingPlayer: player,
    territory: territoryName 
  }
  return axiosClient.post("/api/games/" + id + "/turn/draft", draftData);
}

export function sendAttack(id, player, fromTerritory, toTerritory) {
  const attack_data = {
    requestingPlayer: player,
    from: fromTerritory,
    to: toTerritory,
  }
  return axiosClient.post("/api/games/" + id + "/turn/attack", attack_data);
}

export function sendMove(id, player, unitsToMove) {
  const moveData = { 
    requestingPlayer: player,
    units: unitsToMove 
  }
  return axiosClient.post("/api/games/" + id + "/turn/move", moveData)
}

export { axiosClient }