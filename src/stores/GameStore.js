import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
    state: () => {
        const playerName = null;
        const playerColor = null;
        const model = {};
        const lastSelected = null;
        const actionCount = 0;
        return { playerName, playerColor, model, lastSelected, actionCount }
    },
    persist: {
        paths: ['playerName', 'playerColor'],
    },
});