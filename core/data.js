// data.js
// Cấu hình nhẹ, không đụng dữ liệu heroes/items (đã load từ JSON).
// Dùng để giữ text/đường dẫn chung, không xung đột với main.js hiện tại.

(function () {
  const AppConfig = {
    assets: {
      heroesPath: "./assets/heroes",
      itemsPath: "./assets/items"
    },
    text: {
      queueFull: "You have queued 5 enemies already!",
      searchPlaceholder: "Search hero…"
    }
  };

  // expose
  window.AppConfig = AppConfig;
})();
