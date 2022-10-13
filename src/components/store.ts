import { reactive } from 'vue'

export type state = {
  gamestart: boolean;
  board_columns: number;
  board_rows: number;
  turn: boolean;
  winner: string;
  p1color: string;
  p2color: string;
  drop_state: string[][];
  initDropState: Function;
  setPlayerColors: Function;
  dropToken: Function;
  testForwin: Function;
  resetGame: Function;
}

export const state = reactive({
  gamestart: false,
  board_columns: 7,
  board_rows: 6,
  turn: false,
  winner: '',
  p1color: '',
  p2color: '',
  dropstate: Array(Array(),Array(),Array(),Array(),Array(),Array(),Array()),
  initDropState() {
    for (let z = 0; z < this.board_columns; z++) {
      for (let y = 0; y < this.board_rows; y++) {
        this.dropstate[z].push('0')
      }
    }
  },
  setPlayerColors(pick: string)  {
    this.p1color = pick;
    this.p2color = pick === 'colorone' ? 'colortwo' : 'colorone';
    this.gamestart = true;
  },
  dropToken(column: number) {
    if (!this.dropstate[column].includes('0')) {return false}
    else {
      let trackarr = Array<number>(column);
      for (let n = 5; n > -1; n--) {
        if (this.dropstate[column][n] === '0') {
          trackarr.push(n),
          this.dropstate[column][n] = this.turn ? '2' : '1';
          break;
        } 
      }
      this.turn = !this.turn;
      this.testForWin();
    }
  },
  testForWin() {
    let testarr = Array<string>();
    // columns
    for (let z = 0; z < this.dropstate.length; z++) {
      for (let n = this.dropstate[z].length - 1; n > -1 ; n--) {
        testarr.push(this.dropstate[z][n]);
      }
      if (this.testForMatch(testarr)) {return}
      testarr = [];
    }
    // rows
    for (let z = 0; z < this.dropstate[0].length; z++) {
      for (let n = 0; n < this.dropstate.length; n++) {
        testarr.push(this.dropstate[n][z]);
      }
      if (this.testForMatch(testarr)) {return}
      testarr = [];
    }

    // diagonals
    // dir: \
    for (let z = 0; z < this.dropstate.length / 2; z++) {
      for (let n = 0; n < this.dropstate[z].length / 2; n++) {
        testarr.push(this.dropstate[z][n]);
        for (let k = 1; k <= this.dropstate[z].length - k; k++) {
          testarr.push(this.dropstate[z + k][n + k]);
        }
        if (this.testForMatch(testarr)) {return}
        testarr = [];
      }
    }

    // dir: /
    for (let n = Math.floor(((this.dropstate.length) / 2)); n < this.dropstate.length; n++) {
      for (let z = 0; z < Math.floor((this.dropstate[n].length) / 2); z++) {
        testarr.push(this.dropstate[n][z])
        for (let k = 1; k <= this.dropstate[n].length - k; k++) {
          testarr.push(this.dropstate[n - k][z + k])
        }
        if (this.testForMatch(testarr)) {return}
        testarr = [];
      }
    }
  },
  testForMatch(testarr: string[]) {
    this.winner = testarr.join('').includes('1111') ? '1' : testarr.join('').includes('2222') ? '2' : '';
    return this.winner.length > 0
  },
  resetGame() {
    this.winner = '';
    this.p1color = '';
    this.p2color = '';
    this.turn = false;
    this.gamestart = false;
    this.dropstate = Array(Array(),Array(),Array(),Array(),Array(),Array(),Array());
    this.initDropState();
  }
  

})