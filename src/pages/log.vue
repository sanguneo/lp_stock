<template>
  <div class="container">
    <div class="AppTitle">🧴 LPP 물품관리 / 사용내역 <nuxt-link to="/">🛒</nuxt-link></div>
    <div class="search">
      <select v-model="thismonth">
        <option :value="month" v-for="month in monthList">{{month}}</option>
      </select>
      <input type="text" v-model="searchUser" placeholder="사용자를 검색해보세요( ex 상구너 )">
    </div>
    <ul id="logList" class="logList" ref="stockList">
      <li rel="head">
        <div class="date">사용일</div>
        <div class="user">사용자</div>
        <div class="log">사용내역</div>
      </li>
      <li rel="row" v-for="(log, idx) in logListComputed">
        <div class="date">{{log[0]}}</div>
        <div class="user">{{log[1]}}</div>
        <div class="log" v-html="log[2].map(e=>'<div>' + e + '개</div>').join('\n')"></div>
      </li>
    </ul>
    <div class="subtitle">월 총 사용</div>
    <ul id="monthlyList" class="logList">
      <li rel="head">
        <div class="date">사용월</div>
        <div class="log">사용내역</div>
      </li>
      <li rel="row" v-for="(log, idx) in monthlyList">
        <div class="date">{{log[0]}}</div>
        <div class="log" v-html="log[1]"></div>
      </li>
    </ul>
    <div v-show="fetching" class="fetching"><div class="loader"></div></div>
  </div>
</template>

<script>
import axios from 'axios';

const thismonthCalc = (() => {
  const date = new Date();
  return date.getFullYear().toString().padStart(4, '0') + '. ' + (date.getMonth() + 1).toString().padStart(2, '0') + '.'
})();
export default {
  name: 'log',
  data() {
    return {
      user: null,
      logList: [],
      stockList: {},
      isManager: false,
      fetching:false,
      searchUser: null,
      thismonth: thismonthCalc
    }
  },
  computed: {
    logListComputed() {
      let loglist = this.logList.filter(log => log[0].startsWith(this.thismonth)) || [];
      loglist = loglist.map(log => ([
        log[0], log[1], log[2]
          .split('\n')
          .map(logRow => logRow.split(':').map(logCol => logCol.trim()))
          .map(logRow => (this.stockList[logRow[0]] + ' : ' + logRow[1]))
      ]));
      loglist = (this.searchUser && this.searchUser !== '' ? loglist.filter(log => log[1].trim().includes(this.searchUser.trim())) : loglist);
      return this.isManager ? loglist : loglist.filter(log => String(log[1]).trim() === String(this.user).trim())
    },
    monthList() {
      return Array.from(new Set([...this.logList.map(e=> e[0].split(' ').splice(0,2).join(' ')), thismonthCalc]));
    },
    monthlyList() {
      const monthlyObject = {};
      for (const month of this.monthList) {
        let sameMonth = {};
        let sameMonthArray = this.logList.filter(e=>e.length > 0 && e[0].startsWith(month) && e[1] && e[2] && typeof e[2] === 'string');
        if (sameMonthArray.length === 0) continue;
        let sameMonthArrayCalculated = sameMonthArray.map(log =>log[2].split('\n').map(e=>e.split(':').map(r=>r.trim())))
          .flat(1)
          .map(e=>([e[0], parseInt(e[1].replace('개', ''), 10)]));
        for (const sameMonthItem of sameMonthArrayCalculated) {
          if (!sameMonth[sameMonthItem[0]]) sameMonth[sameMonthItem[0]] = 0;
          sameMonth[sameMonthItem[0]] += parseInt(sameMonthItem[1], 10);
        }
        monthlyObject[month] = Object.entries(sameMonth).map(e=>this.stockList[e[0].trim()] + ' : ' + e[1] + '개').join('<br>');
      }
      return Object.entries(monthlyObject);
    }
  },
  async created() {
    this.user = window.localStorage.lpuser || null;
    this.isManager = !!window.localStorage.isManager;
    if (!this.isManager) {
      this.searchUser = this.user;
    }
    await this.getStockList();
    await this.getLogList()
  },
  methods: {
    getStockList() {
      this.fetching = true;
      return axios.get('https://sheets.googleapis.com/v4/spreadsheets/1S3iYUo638NEz3cUXcFlWctLBnqC1FT-rAdoVg91e3FM/values/재고현황?key=AIzaSyAS7amO6h0t_fO1wvPOWQpvs7AX2z4rr6I').then(({ data }) => data.values)
        .then(([head, ...stockList]) => {
          this.stockList = Object.fromEntries(stockList.map(stock => ([stock[0], stock[1]])));
          this.fetching = false;
        })
    },
    getLogList() {
      this.fetching = true;
      return axios.get('https://sheets.googleapis.com/v4/spreadsheets/1S3iYUo638NEz3cUXcFlWctLBnqC1FT-rAdoVg91e3FM/values/변동내역?key=AIzaSyAS7amO6h0t_fO1wvPOWQpvs7AX2z4rr6I').then(({ data }) => data.values)
        .then(([head, ...logList]) => {
          this.logList = logList.filter(e=>e[2]);
          this.fetching = false;
        })
    },
  }
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  max-width:100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.AppTitle {
  font-size: 30px;
  margin-bottom: 20px;
  a {
    text-decoration: none;
  }
}
.search {
  width: 500px;
  margin-top: 50px;
  margin-bottom: 10px;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  select, input {
    height: 30px;
  }
  input {
    width: calc(100% - 100px);
  }
}
.subtitle {
  margin-top: 50px;
  font-size: 20px;
}
.logList {
  margin:0;
  padding: 0;
  width: 500px;
  box-sizing: border-box;
  border: 1px solid black;
  list-style: none;
  font-size: 15px;
  & > li {
    min-height: 40px;
    display: flex;
    list-style: none;

    border-bottom: 1px solid gray;
    &:last-child {
      border-bottom: 0;
    }
    & > div {
      display: flex;
      padding: 0 10px;
      align-items: center;
    }
    & > .date {
      width: 150px;
    }
    & > .user {
      width: 150px;
    }
    & > .log {
      flex:1;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
    }
    &[rel=head] {
      background-color: lightgray;
      font-weight: bold;
    }
    &[rel=row] {
    }
  }
  &:not(.showToUse){
    & > li > div.touse {
      display: none;
    }
  }
}
.fetching {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(#000000, 0.5);
  z-index: 12800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader,
.loader:before,
.loader:after {
  background: #ffffff;
  -webkit-animation: load1 1s infinite ease-in-out;
  animation: load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}
.loader {
  color: #ffffff;
  text-indent: -9999em;
  margin: 88px auto;
  position: relative;
  font-size: 11px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  position: absolute;
  top: 0;
  content: '';
}
.loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 1.5em;
}
@-webkit-keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
@keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
</style>
