<script setup lang="ts">
  import { state } from '../components/store.js';
  import { onMounted } from 'vue';

  const getPlayerColor = (player: string) => {
    return player === 'one' ? state.p1color : state.p2color;
  }

  const isOpen = (column: number) => {
    return state.dropstate[column].includes('0') ? true : false;
  }

  // gameboard cell color class
  const getCellClass = (column: number, row: number) => {
    let cellval = String(state.dropstate[column][row]);
    let retstr = String('');
    if (cellval === '0') {return retstr};
    if (cellval === '1') {
        retstr = state.p1color.includes('one') ? 'cellone' : 'celltwo';
      } else {
        retstr = state.p2color.includes('one') ? 'cellone' : 'celltwo';
    }
    return retstr;
  }
  
  onMounted(() => {
    state.initDropState()
  })

</script>

<template>
  <div v-if="!state.gamestart" class="instruction">
    <p>Take turns dropping a token in any column. Be the first to form a horizontal, vertical, or diagonal line of four of your tokens!</p>
    <p id="guide">To play, hover over column to activate, then click to drop token.</p>
    <p id="colorpick">Choose token color for Player One: <span @click="state.setPlayerColors('colorone')"></span><span @click="state.setPlayerColors('colortwo')"></span></p>
  </div>
  <Transition>
    <table v-if="state.gamestart" :class="state.winner.length > 0 ? 'winner' : ''">
      <thead v-if="state.winner.length === 0">
        <tr>
          <th v-for="column, index in state.board_columns" :key="'h' + column">
            <div>
              <div v-if="isOpen(index)" :class="!state.turn ? getPlayerColor('one') : getPlayerColor('two')" @click="state.dropToken(index)"></div>
              <div v-else></div>
            </div>
          </th>
        </tr>
      </thead>
      <thead v-else>
        <tr>
          <th colspan="7">
            <h2>Player <span :class="getPlayerColor(state.winner === '1' ? 'one' : 'two') === 'colorone' ? 'winnerone' : 'winnertwo'">{{state.winner}}</span> Wins!</h2>
            <button @click="state.resetGame()">Play Again</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="column, index in state.board_columns" :key="'b' + column">
            <div>
              <div v-for="row, idx in state.board_rows" :class="getCellClass(index,idx)" :key="row">
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </Transition>
</template>

<style scoped>
  p,
  #guide,
  #colorpick {
    line-height: 26px;
    margin-block-start: 0em;
    margin-block-end: 0em;
  }
  #colorpick > span {
    display: inline-block;
    min-width: 16px;
    width: 16px;
    max-width: 16px;
    min-height: 16px;
    height: 16px;
    max-height: 16px;
    margin-left: 10px;
    border: #000000 solid 1px;
    border-radius: 5px;
  }
  #colorpick > span:hover {
    cursor: pointer;
  }
  #colorpick span:first-child {
    background-color: red;
  }
  #colorpick span:last-child {
    background-color: yellow;
  }
  .v-enter-active {
    transition: opacity 2s;
  }
  .v-enter-from {
    opacity: 0;
  }
  .v-enter-to {
    opacity: 1
  }
  table {
    border: none;
    border-collapse: collapse;
    padding: 0;
    min-width: 50vmin;
    width: 100vmin;
    max-width: 100vmin;
    min-height: 42vmin;
    height: 70vmin;
    max-height: 70vmin;
    margin: 0 auto;
  }
  table.winner {
    min-height: 36vmin;
    height: 60vmin;
    max-height: 60vmin;
  }
  thead,
  tbody {
    background-color: transparent;
  }
  tr {
    border: none;
    border-collapse: collapse;
    padding: 0;
    background-color: transparent;
  }
  th {
    border: none;
    border-collapse: collapse;
    padding: 0;
    min-height: 6vmin;
    height: 10vmin;
    max-height: 10vmin;
    background: transparent;
  }
  th h2 {
    display: inline-block;
    vertical-align: middle;
    color: #ddd;
    font-size: a
  }
  th button {
    display: inline-block;
    vertical-align: middle;
    padding: 5px 10px;
    margin-left: 10px;
    border: none;
    border-radius: 5px;
    background-color: #6a6a6a;
  }
  th button:hover {
    background-color: #ffffff;
    color: #262626;
    cursor: pointer;
  }
  th h2 span.winnerone {
    color: #ff0000;
  }
  th h2 span.winnertwo {
    color: #ffff00;
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
    min-height: 36vmin;
    height: 60vmin;
    max-height: 60vmin;
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
    min-height: 6vmin;
    height: 10vmin;
    max-height: 10vmin;
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