<script setup lang="ts">
  import { ref, reactive } from 'vue'

  const props = defineProps<{
    gamestart: Boolean
    board_columns: Number
    board_rows: Number
    p1color: String
    p2color: String
    dropstate: Array<Array<String>>
  }>()

  const getPlayerColor = (player:string) => {
    return player === 'one' ? props.p1color : props.p2color;
  }

  const dropstate = reactive(props.dropstate);

  const turn = ref(false)
  const dropToken = (column:string) => {
    // gameboard column full
    if (!dropstate[parseInt(column)].includes('0')) {return false}
    else {
      // first token to last row, etc., because gravity
      for (let n = 5; n > -1; n--) {
        if (dropstate[parseInt(column)][n] === '0') {
          dropstate[parseInt(column)][n] = turn.value ? '2' : '1';
          break;
        } 
      }
      turn.value = !turn.value;
      checkForWin();
    }
    
    
  }
  //console.log(dropstate)
  const isOpen = (column:string) => {
    return dropstate[parseInt(column)].includes('0') ? true : false;
  }

  // gameboard cell color class
  const getCellClass = (column:string, row:string) => {
    let cellval = String(dropstate[parseInt(column)][parseInt(row)]);
    let retstr = String('');
    if (cellval === '0') {return retstr};
    if (cellval === '1') {
        retstr = props.p1color.includes('one') ? 'cellone' : 'celltwo';
      } else {
        retstr = props.p2color.includes('one') ? 'cellone' : 'celltwo';
    }
    return retstr;
  }

  const winner = ref('');
  const checkForWin = () => {
    let testarr = [];

    // columns
    for (let z = 0; z < dropstate.length; z++) {
      for (let n = dropstate[z].length - 1; n > -1 ; n--) {
        testarr.push(dropstate[z][n]);
      }
      winner.value = testarr.join('').includes('1111') ? '1' : testarr.join('').includes('2222') ? '2' : '';
      if (winner.value.length > 0) {
        return;
      }
      testarr = [];
    }

    // rows
    for (let z = 0; z < dropstate[0].length; z++) {
      for (let n = 0; n < dropstate.length; n++) {
        testarr.push(dropstate[n][z]);
      }
      winner.value = testarr.join('').includes('1111') ? '1' : testarr.join('').includes('2222') ? '2' : '';
      if (winner.value.length > 0) {
        return;
      }
      testarr = [];
    }

    // diagonals
    // dir: \
    for (let z = 0; z < dropstate.length / 2; z++) {
      for (let n = 0; n < dropstate[z].length / 2; n++) {
        testarr.push(dropstate[z][n]);
        for (let k = 1; k <= dropstate[z].length - k; k++) {
          testarr.push(dropstate[z + k][n + k]);
        }
        winner.value = testarr.join('').includes('1111') ? '1' : testarr.join('').includes('2222') ? '2' : '';
        if (winner.value.length > 0) {
          return;
        }
        testarr = [];
      }
    }

    // dir: /
    for (let n = Math.floor(((dropstate.length) / 2)); n < dropstate.length; n++) {
      for (let z = 0; z < Math.floor((dropstate[n].length) / 2); z++) {
        testarr.push(dropstate[n][z])
        for (let k = 1; k <= dropstate[n].length - k; k++) {
          testarr.push(dropstate[n - k][z + k])
        }
        winner.value = testarr.join('').includes('1111') ? '1' : testarr.join('').includes('2222') ? '2' : ''
        if (winner.value.length > 0) {
          return;
        }
        testarr = []
      }
    }
  }

</script>

<template>
    <h1 v-if="winner.length > 0">Player <span :class="getPlayerColor(winner === '1' ? 'one' : 'two') === 'colorone' ? 'winnerone' : 'winnertwo'">{{winner}}</span> Wins!</h1>
    <table>
      <thead v-if="winner.length === 0">
        <tr>
          <th v-for="column, index in props.board_columns" :key="'h' + column">
            <div>
              <div v-if="isOpen(index)" :class="!turn ? getPlayerColor('one') : getPlayerColor('two')" @click="dropToken(index)"></div>
              <div v-else></div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="column, index in props.board_columns" :key="'b' + column">
            <div>
              <div v-for="row, idx in props.board_rows" :class="getCellClass(index,idx)" :key="row">
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
</template>

<style scoped>
  h1 {
    color: #ddd;
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-bottom: 30px;
  }
  span.winnerone {
    color: #ff0000;
  }
  span.winnertwo {
    color: #ffff00;
  }
  table {
    border: none;
    border-collapse: collapse;
    padding: 0;
    min-width: 80%;
    width: 80%;
    max-width: 80%;
    min-height: 70vh;
    height: 70vh;
    max-height: 70vh;
    margin: 0 auto;
  }
  thead,
  tbody {
    background-color: transparent;
  }
  tr {
    border: none;
    border-collapse: collapse;
    padding: 0;
    min-width: 100%;
    width: 100%;
    max-width: 100%;
    background-color: transparent;
  }
  th {
    border: none;
    border-collapse: collapse;
    padding: 0;
    min-height: 10vh;
    height: 10vh;
    max-height: 10vh;
    background: transparent;
  }
  .colorone:hover {
    background: radial-gradient(circle at center, #ff0000, #ff0000 50%, transparent 51%, transparent 100%) no-repeat;
  }
  .colortwo:hover {
    background: radial-gradient(circle at center, #ffff00, #ffff00 50%, transparent 51%, transparent 100%) no-repeat;
  }
  .colorone:active,
  .colortwo:active {
    cursor: s-resize;
  }
  td {
    border: none;
    border-collapse: collapse;
    padding: 0;
    min-height: 60vh;
    height: 60vh;
    max-height: 60vh;
    background: #999999;
  }
  th > div,
  td > div {
    min-height: 100%;
    height: 100%;
    max-height: 100%;
    position: relative;
  }
  th div div,
  td div div {
    border: 2px solid transparent;
    position: relative;
    left: 0px;
    top: 0px;
    min-width: 100%;
    width: 100%;
    max-width: 100%;
    min-height: 10vh;
    height: 10vh;
    max-height: 10vh;
  }
  th div div.colorone,
  th div div.colortwo {
    border: 2px solid transparent;
    position: relative;
    left: 0px;
    top: 0px;
    background-color: transparent;
    z-index: 1;
  }
  td div div {
    border: 2px solid #000099;
    background: radial-gradient(circle at center, transparent, transparent 50%,#000099 51%,#000099 100%);
    position: relative;
    z-index: 20
  }
  td > div > div.cellone {
    background: radial-gradient(circle at center, #ff0000, #ff0000 50%,#000099 51%,#000099 100%);
  }
  td > div > div.celltwo {
    background: radial-gradient(circle at center, #ffff00, #ffff00 50%,#000099 51%,#000099 100%);
  }
  td div div div {
    min-width: 100%;
    width: 100%;
    max-width: 100%;
    min-height: 100%;
    height: 100%;
    max-height: 100%;
    position: absolute;
    z-index: 10;
  }
</style>