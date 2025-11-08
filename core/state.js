// state.js
// Lưu và khôi phục trạng thái tối giản, tương thích với update mới.
// Không ép buộc main.js phải dùng; chỉ cung cấp tiện ích toàn cục an toàn.

(function () {
  const KEY = "enemyQueue";

  const AppState = {
    MAX: 5,
    enemyQueue: [],

    load() {
      try {
        const raw = localStorage.getItem(KEY);
        AppState.enemyQueue = raw ? JSON.parse(raw) : [];
      } catch (_) {
        AppState.enemyQueue = [];
      }
      return AppState.enemyQueue;
    },

    save(queue) {
      try {
        if (Array.isArray(queue)) AppState.enemyQueue = queue.slice(0, AppState.MAX);
        localStorage.setItem(KEY, JSON.stringify(AppState.enemyQueue));
      } catch (_) { /* ignore */ }
      return AppState.enemyQueue;
    },

    clear() {
      AppState.enemyQueue = [];
      try { localStorage.setItem(KEY, "[]"); } catch (_) { /* ignore */ }
      return AppState.enemyQueue;
    }
  };

  // expose
  window.AppState = AppState;
})();
