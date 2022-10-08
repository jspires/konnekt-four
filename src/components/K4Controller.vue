<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import K4Board from '../components/K4Board.vue';

  const colors = Object({
    colorone: {
      type: String,
      value: "colorone"
    },
    colortwo: {
      type: String,
      value: "colortwo"
    }
  })

  const gamestart = ref(false)
  const gameState = {
    board_columns: {
        type: Number,
        value: 7
      },
      board_rows: {
        type: Number,
        value: 6
      },
      playerone: {
        type: String,
        value: ''
      },
      playertwo: {
        type: String,
        value: ''
      },
      dropstate: {
        type: Array,
        value: Array(Array(Number()),Array(Number()),Array(Number()),Array(Number()),Array(Number()),Array(Number()),Array(Number()))
      }
  }

  const initDropState = () => {
    for (let z = 0; z < gameState.board_columns.value; z++) {
      for (let y = 0; y < gameState.board_rows.value; y++) {
        gameState.dropstate.value[z].push(-1)
      }
    }
  }

  const setPlayerColors = (pick:string) => {
    gameState.playerone.value = pick;
    gameState.playertwo.value = pick === colors.colorone.value ? colors.colortwo.value : colors.colorone.value;
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
    <p id="colorpick">Choose token color for Player One: <span @click="setPlayerColors(colors.colorone.value)"></span><span @click="setPlayerColors(colors.colortwo.value)"></span></p>
  </div>
  <Transition>
    <K4Board v-if="gamestart"
      :gamestart="gamestart"
      :board_columns="gameState.board_columns.value"
      :board_rows="gameState.board_rows.value"
      :p1color="gameState.playerone.value"
      :p2color="gameState.playertwo.value"
      :dropstate="gameState.dropstate.value"
    >
    </K4Board>
  </Transition>
</template>

<style scoped>
  div,
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
  .v-enter-active,
  .v-leave-active {
    transition: opacity 1s ease;
  }
  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
  .v-enter-to,
  .v-leave-from {
    opacity: 1
  }
  </style>