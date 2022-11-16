import { defineStore } from "pinia";

export const useGameStore = defineStore("game", () => {
    const playerName = null;
    const model = {}
    const lastSelected = {}
    return { playerName, model, lastSelected }
});