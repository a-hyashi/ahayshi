window.onload = function () {
  var toggle = document.getElementById('toggle');
  var theme = document.getElementById('theme');
  var sidemenuToggle = document.getElementById('sidemenu-toggle');
  var codeToggle = document.getElementById('code-toggle');
  var viewToggle = document.getElementById('view-toggle');
  var previewWidth = document.getElementById("previewWidth");
  var preview = document.getElementsByClassName("aigis-preview");
  var showWidthArea = document.getElementById("showWidthArea");

  sidemenuToggle.onclick = function() {
    toggle.classList.toggle('sidemenu-is-closed');
  }
  codeToggle.onclick = function() {
    toggle.classList.toggle('code-is-closed');
  }
  viewToggle.onclick = function() {
    if (theme.getAttribute('href').match(/pc/)) {
      var view = theme.getAttribute('href').replace(/pc-L25/,'sp');
      theme.href = view;
    } else {
      var view = theme.getAttribute('href').replace(/sp/,'pc-L25');
      theme.href = view;
    }
    toggle.classList.toggle('view-is-sp');
  }

  function changeWidth() {
    showWidthArea.textContent = previewWidth.value;
    for (var i=0;i<preview.length;i++) {
      preview[i].style.width = previewWidth.value + 'px';
    }
  }
  // previewWidth.addEventListener("change", changeWidth, false);
}



