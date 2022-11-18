import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
    state: () => {
        const playerName = null;
        const model = {};
        const lastSelected = null;
        const actionCount = 0;
        return { playerName, model, lastSelected, actionCount }
    },
    persist: {
        storage: sessionStorage,
        paths: ['playerName'],
    },
});