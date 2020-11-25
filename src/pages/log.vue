<template>
  <div class="container">
    <div class="AppTitle">🧴 LPP 재고관리 / 사용내역 <nuxt-link to="/">🛒</nuxt-link></div>
    <ul id="logList" :class="{showToUse}" ref="stockList">
      <li rel="head">
        <div class="date">사용일</div>
        <div class="user">사용자</div>
        <div class="log">사용내역</div>
      </li>
      <li rel="row" v-for="(log, idx) in logList">
        <div class="date">{{log[0]}}</div>
        <div class="user">{{log[1]}}</div>
        <div class="log" v-html="log[2].split(' | ').map(e=>'<div>' + e.trim() + '</div>').join('\n')"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'index',
  data() {
    return {
      logList: [],
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    getLogList() {
      axios.get('https://sheets.googleapis.com/v4/spreadsheets/1S3iYUo638NEz3cUXcFlWctLBnqC1FT-rAdoVg91e3FM/values/변동현황?key=AIzaSyAS7amO6h0t_fO1wvPOWQpvs7AX2z4rr6I').then(({ data }) => data.values)
        .then(([head, ...logList]) => {
          this.logList = logList;
        })
    },
  }
}
</script>

<style lang="scss">
#logList {
  margin:0;
  padding: 0;
  width: 600px;
  box-sizing: border-box;
  border: 1px solid black;
  list-style: none;
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
.showToUseBox {
  margin: 20px 0;
  width: 500px;
  text-align: left;
}
.form {
  width: 500px;
  display: flex;
  justify-content: flex-end;
  & > input {
    padding: 0 10px;
    height: 50px;
    width: 200px;
  }
  & > button {
    margin-left: 10px;
    width: 100px;
  }
}
</style>
