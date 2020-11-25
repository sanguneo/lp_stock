<template>
  <div class="container">
    <div class="AppTitle"><a href="https://docs.google.com/spreadsheets/d/1S3iYUo638NEz3cUXcFlWctLBnqC1FT-rAdoVg91e3FM/edit#gid=0" target="_blank">🧴</a> LPP 재고관리 <nuxt-link to="/log">🛒</nuxt-link></div>
    <ul id="stockList" :class="{showToUse}" ref="stockList">
      <li rel="head">
        <div class="title">물품명</div>
        <div class="existing">개수</div>
        <div class="touse">사용</div>
      </li>
      <li rel="row" v-for="(stock, idx) in stockList">
        <div class="title">{{stock[0]}}</div>
        <div class="existing">{{stock[1]}}</div>
        <div class="touse"><input type="number" @input="inputTouseList('A' + (idx + 2) +'|' + stock[0], $event.target.value)"></div>
      </li>
    </ul>
    <div class="showToUseBox">
      <label>
        <input type="checkbox" v-model="showToUse"/>
        재고물품 사용
      </label>
    </div>
    <div class="form" v-show="showToUse">
      <input type="text" v-model="user" placeholder="사용자 (ex, 교육부 홍길동)" ref="user">
      <button @click="submit">사용합니다</button>
    </div>
    <div v-show="fetching" class="fetching"><div class="loader"></div></div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'index',
  data() {
    return {
      stockList: [],
      touseList: {},
      showToUse: false,
      user: null,
      fetching:false
    }
  },
  created() {
    this.getStockList()
  },
  methods: {
    getStockList() {
      this.fetching = true;
      axios.get('https://sheets.googleapis.com/v4/spreadsheets/1S3iYUo638NEz3cUXcFlWctLBnqC1FT-rAdoVg91e3FM/values/재고현황?key=AIzaSyAS7amO6h0t_fO1wvPOWQpvs7AX2z4rr6I').then(({ data }) => data.values)
        .then(([head, ...stockList]) => {
          this.stockList = stockList;
          this.fetching = false;
        })
    },
    inputTouseList(title, count) {
      if (!count || count === 0 || count === '') {
        if (this.touseList[title]) delete this.touseList[title];
        return;
      }
      this.touseList[title] = parseInt(count, 10) || undefined;
    },
    appendLog(row) {
      this.fetching = true;
      const id = 'id_' + Date.now()
      const jsonp = document.createElement('script')
      window.callback = (...args) => console.log(...args)
      window.jsonpLoaded = () => document.head.removeChild(jsonp);
      jsonp.id = id;
      jsonp.src = 'https://script.google.com/macros/s/AKfycbyHrqmT5deP6pprUS7wDlocGjjrL8v3FQGvjRkob5BAdEoNDXc/exec?method=updateStock&userdata=' +encodeURIComponent(JSON.stringify(row))+ '&v=' + id;
      jsonp.onload = () => {
        document.head.removeChild(document.querySelector(`#${id}`));
        Array.from(this.$refs.stockList.querySelectorAll('input')).forEach(e=> {
          e.value = null;
        })
        this.fetching = false;
        this.getStockList();
      }
      document.head.appendChild(jsonp);
    },
    submit() {
      if (!this.user && this.user !== '') {
        alert('사용자를 입력해주세요.');
        this.$refs.user.focus();
        return;
      }

      this.appendLog({time: new Date().toLocaleDateString(), user: this.user, use: Object.entries(this.touseList).filter(e=>e[1] && e[1]!==0).map(e=>([e[0].split('|')[0].slice(1), e[1]])), useString: Object.entries(this.touseList).filter(e=>e[1] && e[1]!==0).map(e=>[e[0].split('|')[1], e[1]].join(' : ') + '개').join('   |   ')});
      this.touseList = {}

    }
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

#stockList {
  margin:0;
  padding: 0;
  width: 100vw;
  max-width: 500px;
  box-sizing: border-box;
  border: 1px solid black;
  list-style: none;
  & > li {
    height: 40px;
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
    & > .title {
      flex: 1;
    }
    & > .existing {
      width: 100px;
      justify-content: center;
    }
    & > .touse {
      width: 100px;
      justify-content: center;
    }
    &[rel=head] {
      background-color: lightgray;
      font-weight: bold;
    }
    &[rel=row] {
      & > .existing {
        justify-content: flex-end;
      }
      & > .touse {
        justify-content: flex-end;
        & > input[type=number] {
          box-sizing: border-box;
          height: 30px;
          width: 100%;
        }
      }
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
