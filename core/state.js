// state.js
const AppState = {
  MAX: 5,
  enemyQueue: [],

  load: function () {
    try {
      const raw = localStorage.getItem("enemyQueue");
      this.enemyQueue = raw ? JSON.parse(raw) : [];
    } catch {
      this.enemyQueue = [];
    }
    return this.enemyQueue;
  },

  save: function (queue) {
    if (Array.isArray(queue)) this.enemyQueue = queue.slice(0, this.MAX);
    try {
      localStorage.setItem("enemyQueue", JSON.stringify(this.enemyQueue));
    } catch {}
  },

  clear: function () {
    this.enemyQueue = [];
    try {
      localStorage.setItem("enemyQueue", "[]");
    } catch {}
  },
};
