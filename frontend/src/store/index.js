// File: src/store/index.js
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_USER(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      commit("SET_LOADING", true);
      try {
        const response = await axios.get("/api/current-user");
        if (response.data && response.data.user) {
          commit("SET_USER", response.data.user);
        } else {
          commit("CLEAR_USER");
        }
        commit("SET_ERROR", null);
      } catch (error) {
        commit("CLEAR_USER");
        commit("SET_ERROR", "Failed to fetch user data");
        console.error("Error fetching user:", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async logout({ commit }) {
      try {
        await axios.get("/logout");
        commit("CLEAR_USER");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    user: (state) => state.user,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
});
