import axios from "axios";

export default {
  state() {
    return {
      stockList: [],
    };
  },

  getters: {
    stockList(state) {
      return state.stockList;
    },
  },

  mutations: {
    setStocklist(state, stockList) {
      state.stockList = stockList;
    }
  },

  actions: {
    fetchStockList(store) {
      return axios.get('https://sheets.googleapis.com/v4/spreadsheets/1S3iYUo638NEz3cUXcFlWctLBnqC1FT-rAdoVg91e3FM/values/재고현황?key=AIzaSyAS7amO6h0t_fO1wvPOWQpvs7AX2z4rr6I').then(({ data }) => data.values)
        .then(([head, ...stockList]) => {
          localStorage.lpStock_list = JSON.stringify(stockList);
          store.commit('setStocklist', [...stockList.filter(e=>e[3] != 0), ...stockList.filter(e=>e[3] == 0)]);
        })
    },
  },
};
