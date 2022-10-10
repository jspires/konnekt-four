<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import K4Board from '../components/K4Board.vue';

  const gamestart = ref(false)
  const gamestate = {
    board_columns: {
      type: Number(),
      value: 7
    },
    board_rows: {
      type: Number(),
      value: 6
    },
    playerone: {
      type: String(),
      value: ''
    },
    playertwo: {
      type: String(),
      value: ''
    },
    dropstate: {
      type: Array(Array<string>()),
      value: Array(Array(),Array(),Array(),Array(),Array(),Array(),Array())
    }
  }

  const initDropState = () => {
    for (let z = 0; z < gamestate.board_columns.value; z++) {
      for (let y = 0; y < gamestate.board_rows.value; y++) {
        gamestate.dropstate.value[z].push('0')
      }
    }
  }

  const setPlayerColors = (pick:string) => {
    gamestate.playerone.value = pick;
    gamestate.playertwo.value = pick === 'colorone' ? 'colortwo' : 'colorone';
    gamestart.value = true;
  }

  onMounted(() => {
    initDropState()
  })

</script>

<template>
  <div v-if="!gamestart">
    <p>Take turns dropping a token in any column. Be the first to form a horizontal, vertical, or diagonal line of four of your tokens!</p>
    <p id="guide">To play, hover over column to activate, then click to drop token.</p>
    <p id="colorpick">Choose token color for Player One: <span @click="setPlayerColors('colorone')"></span><span @click="setPlayerColors('colortwo')"></span></p>
  </div>
  <Transition>
    <div v-if="gamestart">
      <K4Board
        :gamestart="gamestart"
        :board_columns="gamestate.board_columns.value"
        :board_rows="gamestate.board_rows.value"
        :p1color="gamestate.playerone.value"
        :p2color="gamestate.playertwo.value"
        :dropstate="gamestate.dropstate.value"
      >
      </K4Board>
    </div>
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
  </style>