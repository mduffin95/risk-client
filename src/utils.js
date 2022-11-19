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

export function sendDraft(id, territoryName) {
    return axiosClient.post("/api/games/" + id + "/turn/draft", { territory: territoryName });
}

export function sendAttack(id, fromTerritory, toTerritory) {
    const attack_data = {
      from: fromTerritory,
      to: toTerritory,
    }
    return axiosClient.post("/api/games/" + id + "/turn/attack", attack_data);
}

export { axiosClient }