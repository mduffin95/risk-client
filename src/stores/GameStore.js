import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
    state: () => {
        const playerName = null;
        const model = {}
        const lastSelected = {}
        return { playerName, model, lastSelected }
    },
    persist: {
        storage: sessionStorage,
        paths: ['playerName'],
    },
});