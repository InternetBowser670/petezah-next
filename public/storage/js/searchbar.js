document.querySelector(".url-input").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      var url = this.value;
      var isAUrl = url.includes(".");
  
      if (isAUrl) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "http://" + url;
        }
  
        window.navigator.serviceWorker
          .register("/petezah/sw.js", {
            scope: __uv$config.prefix,
          })
          .then(() => {
            window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
          });
      } else {
        var searchUrl = "https://duckduckgo.com/?q=" + encodeURIComponent(url);
        window.navigator.serviceWorker
          .register("/petezah/sw.js", {
            scope: __uv$config.prefix,
          })
          .then(() => {
            window.location.href = __uv$config.prefix + __uv$config.encodeUrl(searchUrl);
          });
      }
    }
  });
  
  document.querySelector(".url-input").addEventListener("focus", function () {
    if (this.value && this.value.indexOf(".") !== -1) {
      this.value = "https://" + this.value;
    }
  });
  
  document.querySelector(".url-input").addEventListener("blur", function () {
    this.value = this.value.replace(/^https?:\/\//, "");
  });