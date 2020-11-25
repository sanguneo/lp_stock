<template>
  <div class="container">
    <ul id="stockList" :class="{showToUse}">
      <li rel="head">
        <div class="title">물품명</div>
        <div class="existing">개수</div>
        <div class="touse">사용</div>
      </li>
      <li rel="row" v-for="(stock, idx) in stockList">
        <div class="title">{{stock[0]}}</div>
        <div class="existing">{{stock[1]}}</div>
        <div class="touse"><input type="number" @input="inputTouseList(stock[0], $event.target.value)"></div>
      </li>
    </ul>
    <div class="showToUseBox">
      <label>
        <input type="checkbox" v-model="showToUse"/>
        재고물품 사용
      </label>
    </div>
    <div class="form" v-show="showToUse">
      <input type="text" v-model="user" placeholder="사용자 (ex, 교육부 홍길동)">
      <button @click="submit">사용합니다</button>
    </div>
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
    }
  },
  created() {
    this.getStockList()
  },
  methods: {
    getStockList() {
      axios.get('https://sheets.googleapis.com/v4/spreadsheets/1Gu2Btvfw76R2d9QRahYoAKKE2ijjjRr4LbMhD4bjoKY/values/재고현황?key=AIzaSyAS7amO6h0t_fO1wvPOWQpvs7AX2z4rr6I').then(({ data }) => data.values)
        .then(([head, ...stockList]) => {
          this.stockList = stockList;
        })
    },
    inputTouseList(title, count) {
      this.touseList[title] = parseInt(count, 10)|| undefined;
    },
    appendLog(row) {
      axios.put('https://sheets.googleapis.com/v4/spreadsheets/1Gu2Btvfw76R2d9QRahYoAKKE2ijjjRr4LbMhD4bjoKY/values/변동현황!A1:C2?key=AIzaSyAS7amO6h0t_fO1wvPOWQpvs7AX2z4rr6I&valueInputOption=USER_ENTERED', {
        values: [row]
      })
    },
    submit() {
      this.appendLog([Date.now(), this.user, Object.fromEntries(Object.entries(this.touseList).filter(e=>e[1] && e[1]!==0))]);
    }
  }
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#stockList {
  margin:0;
  padding: 0;
  width: 500px;
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
</style>
