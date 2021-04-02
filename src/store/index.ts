const createStore = require("tiny-little-store").default;

export const store = createStore({ isLoading: false, data: null, currentJourney: null, sherpaPath: null });
const { mutation } = store;
const setLoading = mutation((_store: any, value: any) => ({isLoading: value}));
const setData = mutation((_store: any, data: any) => ({ data }));
export const setCurrentJourney = mutation((_store: any, id: any) => ({ currentJourney: id }))
export const setSherpaRoot = mutation((_store: any, root: string) => ({ sherpaPath: root }))
