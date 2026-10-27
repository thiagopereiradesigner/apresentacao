(function(){
    var KEY='mapa-sistema-financeiro-theme';
    var root=document.documentElement;
    var btnL=document.getElementById('btn-theme-light');
    var btnD=document.getElementById('btn-theme-dark');
    function apply(theme){
      var t=theme==='light'?'light':'dark';
      root.setAttribute('data-theme',t);
      root.setAttribute('data-ds-theme',t==='light'?'ringgo':'ringgo-dark');
      root.style.colorScheme=t==='light'?'only light':'dark';
      try{localStorage.setItem(KEY,t);}catch(e){}
      var metaCs=document.getElementById('meta-color-scheme');
      var metaTc=document.getElementById('meta-theme-color');
      if(metaCs)metaCs.setAttribute('content',t==='light'?'light':'dark');
      if(metaTc)metaTc.setAttribute('content',t==='light'?'#FFFFFF':'#0B0F14');
      if(btnL&&btnD){
        btnL.setAttribute('aria-pressed',t==='light'?'true':'false');
        btnD.setAttribute('aria-pressed',t==='dark'?'true':'false');
      }
    }
    function init(){
      var stored=null;
      try{stored=localStorage.getItem(KEY);}catch(e){}
      if(stored==='light'||stored==='dark'){apply(stored);return;}
      if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches){apply('light');}
      else{apply('dark');}
    }
    init();
    if(btnL)btnL.addEventListener('click',function(){apply('light');});
    if(btnD)btnD.addEventListener('click',function(){apply('dark');});
  })();
