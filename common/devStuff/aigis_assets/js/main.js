window.onload = function () {
  var toggle = document.getElementById('toggle');
  var theme = document.getElementById('theme');
  var sidemenuToggle = document.getElementById('sidemenu-toggle');
  var codeToggle = document.getElementById('code-toggle');
  var viewToggle = document.getElementById('view-toggle');
  var ratio_toggle = document.getElementById('ratio-toggle');
  var width_menu = document.getElementById('width-menu');
  var previewWidth = document.getElementById("previewWidth");
  var preview = document.getElementsByClassName("aigis-preview");
  var showWidthArea = document.getElementById("showWidthArea");

  var MAIN_WIDTH = '780px';
  var SUB_WIDTH = '320px';

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
      changePreviewAreaWidth('');
    } else {
      var view = theme.getAttribute('href').replace(/sp/,'pc-L25');
      theme.href = view;
    }
    toggle.classList.toggle('view-is-sp');
  }
  ratio_toggle.onclick = function() {
    var view;
    if (theme.getAttribute('href').match(/pc-L25/)) {
      view = theme.getAttribute('href').replace(/pc-L25/,'pc-N00');
    } else {
      view = theme.getAttribute('href').replace(/pc-N00/,'pc-L25');
    }
    theme.href = view;
    toggle.classList.toggle('layout-n00');
  }

  width_menu.onchange = function() {
    if (theme.getAttribute('href').match(/sp/)) {
      return;
    }
    var preview_width;
    switch (this.value) {
      case "all":
        preview_width = '';
        break;
      case "main":
        preview_width = MAIN_WIDTH;
        break;
      case "sub":
        preview_width = SUB_WIDTH;
    }
    changePreviewAreaWidth(preview_width);
  }

  function changeWidth() {
    showWidthArea.textContent = previewWidth.value;
    for (var i=0;i<preview.length;i++) {
      preview[i].style.width = previewWidth.value + 'px';
    }
  }

  function changePreviewAreaWidth(width){
    $.each(preview, function(i, previewArea){
      previewArea.style.width = width;
    });
  }
  // previewWidth.addEventListener("change", changeWidth, false);

  // area-allのwidthが初期であたってしまうので、mainに変更しておく
  changePreviewAreaWidth(MAIN_WIDTH);

  //パラメータにlayout=spが渡された時の動作
  var inputLayoutType = 'l25';
  var match = location.search.match(/l=(.*?)(&|$)/);
  if(match){
    inputLayoutType = decodeURIComponent(match[1]);
  }
  if(inputLayoutType==='sp'){
    theme.href = theme.getAttribute('href').replace(/pc-L25/,'sp');
    toggle.classList.toggle('view-is-sp');
  }
}



