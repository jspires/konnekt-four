<script setup lang="ts">
  import { ref, reactive, onUpdated } from 'vue'

  const props = defineProps<{
    gamestart: Boolean
    board_columns: Number
    board_rows: Number
    p1color: String
    p2color: String
    dropstate: Array<Array<Number>>
  }>()

  const getPlayerColor = (player:string) => {
    return player === 'one' ? props.p1color : props.p2color;
  }

  const dropstate = reactive(props.dropstate);

  const turn = ref(false)
  const drop = (column:string) => {
    if (!dropstate[parseInt(column)].includes(-1)) {return false}
    else {
      for (let n = 5; n > -1; n--) {
        if (dropstate[parseInt(column)][n] === -1) {
          dropstate[parseInt(column)][n] = turn.value ? 1 : 0;
          break;
        } 
      }
      turn.value = !turn.value
    }
    
    
  }
  //console.log(dropstate)
  const isOpen = (column:string) => {
    return dropstate[parseInt(column)].includes(-1) ? true : false
  }

  const getCellClass = (column:string, row:string) => {
    let cellval = Number(dropstate[parseInt(column)][parseInt(row)])
    let retstr = String('')
    if (cellval === -1) {return retstr}
    if (cellval === 0) {
        retstr = props.p1color.includes('one') ? 'cellone' : 'celltwo'
      } else {
        retstr = props.p2color.includes('one') ? 'cellone' : 'celltwo'
    }
    return retstr
  }

  const winner = ref('')
  const checkForWin = () => {
    let testarr = [];

    // columns
    for (let z = 0; z < dropstate.length; z++) {
      for (let n = dropstate[z].length - 1; n > -1 ; n--) {
        if (dropstate[z][n] === 0) {
          testarr.push('p1')
        }
        else if (dropstate[z][n] === 1) {
          testarr.push('p2')
        } else {
          testarr.push('xx')
        }
      }
      if (testarr.join('').includes('p1p1p1p1')) {
        winner.value = '1';
        return 'column test'
      }
      if (testarr.join('').includes('p2p2p2p2')) {
        winner.value = '2';
        return 'column test'
      }
      testarr = []
    }
    
    // rows
    for (let z = 0; z < dropstate[0].length; z++) {
      for (let n = 0; n < dropstate.length; n++) {
        if (dropstate[n][z] === 0) {
          testarr.push('p1')
        }
        else if (dropstate[n][z] === 1) {
          testarr.push('p2')
        } else {
          testarr.push('xx')
        }
      }
      if (testarr.join('').includes('p1p1p1p1')) {
        winner.value = '1';
        return 'row test'
      }
      if (testarr.join('').includes('p2p2p2p2')) {
        winner.value = '2';
        return 'row test'
      }
      testarr = []
    }
    //return;
    // diagonals
    // top -> down
    for (let z = 0; z < dropstate.length / 2; z++) {
      for (let n = 0; n < dropstate[z].length / 2; n++) {
        if (dropstate[z][n] === 0) {
          testarr.push('p1')
        }
        else if (dropstate[z][n] === 1) {
          testarr.push('p2')
        } else {
          testarr.push('xx')
        }
        for (let k = 1; k <= dropstate[z].length - k; k++) {
          if (dropstate[z + k][n + k] === 0) {
            testarr.push('p1')
          }
          else if (dropstate[z + k][n + k] === 1) {
            testarr.push('p2')
          } else {
            testarr.push('xx')
          }
        }
        if (testarr.join('').includes('p1p1p1p1')) {
          winner.value = '1'
          return 'diagonal test'
        }
        if (testarr.join('+').includes('p2p2p2p2')) {
          winner.value = '2'
          return 'diagonal test'
        }
        testarr = []
      }
    }
    // bottom -> up
    for (let n = Math.floor(((dropstate.length) / 2)); n < dropstate.length; n++) {
      for (let z = 0; z < Math.floor((dropstate[n].length) / 2); z++) {
        if (dropstate[n][z] === 0) {
          testarr.push('p1')
        }
        else if (dropstate[n][z] === 1) {
          testarr.push('p2')
        } else {
          testarr.push('xx')
        }
        for (let k = 1; k <= dropstate[n].length - k; k++) {
          if (dropstate[n - k][z + k] === 0) {
            testarr.push('p1')
          }
          else if (dropstate[n - k][z + k] === 1) {
            testarr.push('p2')
          } else {
            testarr.push('xx')
          }
        }
        if (testarr.join('').includes('p1p1p1p1')) {
          winner.value = '1'
          return 'diagonal test'
        }
        if (testarr.join('').includes('p2p2p2p2')) {
          winner.value = '2'
          return 'diagonal test'
        }
        testarr = []
      }
    }

  }

  onUpdated(() => {
    const gridtest = checkForWin()
    if (winner.value.length > 0) {console.log('Player ' + winner.value + ' wins from ' + gridtest + '!')}
  })

</script>

<template>
    <h1 v-if="winner.length > 0">Player <span :class="getPlayerColor(winner === '1' ? 'one' : 'two') === 'colorone' ? 'winnerone' : 'winnertwo'">{{winner}}</span> Wins!</h1>
    <table v-else>
      <tbody>
        <tr>
          <td v-for="column, index in props.board_columns" :key="column">
            <div>
              <div v-if="isOpen(index)" :class="!turn ? getPlayerColor('one') : getPlayerColor('two')" @click="drop(index)"></div>
              <div v-else></div>
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
    color: #ccc;
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
    margin: 0 auto;
  }
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
  .colorone:hover {
    background: radial-gradient(circle at center, #ff0000, #ff0000 50%, transparent 51%, transparent 100%);
  }
  .colortwo:hover {
    background: radial-gradient(circle at center, #ffff00, #ffff00 50%, transparent 51%, transparent 100%);
  }
  .colorone:active,
  .colortwo:active {
    cursor: s-resize;
  }
  td {
    border: none;
    border-collapse: collapse;
    padding: 0;
    min-height: 42vmax;
    height: 42vmax;
    max-height: 42vmax;
    background: linear-gradient(to bottom, transparent, transparent 14.5%, #999999 14.6%, #999999 100%);
  }
  td > div {
    min-height: 100%;
    height: 100%;
    max-height: 100%;
    position: relative;
  }
  td div div {
    border: 2px solid transparent;
    min-width: 100%;
    width: 100%;
    max-width: 100%;
    min-height: 6vmax;
    height: 6vmax;
    max-height: 6vmax;
  }
  td div div.colorone,
  td div div.colortwo {
    border: 2px solid transparent;
    position: relative;
    left: 0px;
    top: 0px;
    z-index: 3;
    background-color: transparent;
    z-index: 1;
  }
  td div div:nth-child(1n+2) {
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