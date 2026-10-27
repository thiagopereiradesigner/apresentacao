(function(){
  var PROG='trilha.v1.progresso';
  var baseTitle=document.title;
  var curriculo=null;
  var nomes={};
  var avisoSalvo=false;
  var aberto=0;

  function esc(s){
    return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function nn(n){return String(n).padStart(2,'0');}
  function aulaPorNumero(n){
    for(var i=0;i<curriculo.aulas.length;i++) if(curriculo.aulas[i].n===n) return curriculo.aulas[i];
    return null;
  }
  function moduloDa(n){
    for(var i=0;i<curriculo.modulos.length;i++){
      if(curriculo.modulos[i].aulas.indexOf(n)>=0) return {m:curriculo.modulos[i],i:i};
    }
    return null;
  }
  function nomeAba(slug){
    return nomes[slug]||slug;
  }
  function icon(kind){
    if(kind==='dada') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/></svg>';
    if(kind==='a seguir') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/></svg>';
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  }
  function statusAttr(status){
    if(status==='a seguir') return 'a-seguir';
    if(status==='em breve') return 'em-breve';
    return 'dada';
  }
  function badge(status){
    var label=status==='dada'?'Dada':status==='a seguir'?'A seguir':'Em breve';
    return '<span class="badge-status" data-status="'+statusAttr(status)+'">'+icon(status)+esc(label)+'<span class="visually-hidden">Status: '+esc(label)+'</span></span>';
  }
  window.badgeTrilha=badge;
  function lerProgresso(){
    try{
      var raw=localStorage.getItem(PROG);
      if(!raw) return {v:1,lidas:[]};
      var o=JSON.parse(raw);
      if(!o||o.v!==1||!Array.isArray(o.lidas)) return {v:1,lidas:[]};
      return o;
    }catch(e){
      return {v:1,lidas:[],bloqueado:true};
    }
  }
  function lidasValidas(prog){
    var set={};
    (prog.lidas||[]).forEach(function(n){
      var a=aulaPorNumero(n);
      if(a&&a.status==='dada') set[n]=true;
    });
    return set;
  }
  function salvar(nums){
    var o={v:1,lidas:nums,t:new Date().toISOString()};
    try{
      localStorage.setItem(PROG,JSON.stringify(o));
      return true;
    }catch(e){
      avisoSalvo=true;
      return false;
    }
  }
  function anunciar(msg){
    var live=document.getElementById('route-live');
    if(!live) return;
    var texto=String(msg).slice(0,80);
    window.setTimeout(function(){live.textContent=texto;},100);
    window.setTimeout(function(){if(live.textContent===texto) live.textContent='';},4100);
  }
  function reduzido(){
    return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function pousar(el){
    if(!el) return;
    if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','-1');
    el.classList.add('route-landed');
    el.scrollIntoView({behavior:reduzido()?'auto':'smooth',block:'start'});
    try{el.focus({preventScroll:true});}catch(e){el.focus();}
    function sair(){el.classList.remove('route-landed');el.removeEventListener('blur',sair);}
    el.addEventListener('blur',sair);
  }
  window.focarRota=function(id){pousar(document.getElementById(id));};

  function hashAtual(){
    try{return decodeURIComponent((location.hash||'').replace(/^#/,''));}
    catch(e){return (location.hash||'').replace(/^#/,'');}
  }
  function lerRota(){
    var raw=hashAtual();
    if(!raw) return {tipo:'home'};
    if(raw.indexOf('aula-')===0){
      var corpo=raw.slice(5);
      var barra=corpo.indexOf('/');
      var num=parseInt(barra<0?corpo:corpo.slice(0,barra),10);
      var bloco=barra<0?'':corpo.slice(barra+1);
      if(!(num>=1&&num<=22)) return {tipo:'invalida'};
      return {tipo:'aula',n:num,bloco:bloco};
    }
    var id=raw,secao='';
    if(raw.indexOf('aba-')===0) raw=raw.slice(4);
    var s=raw.indexOf('/');
    if(s>=0){id=raw.slice(0,s);secao=raw.slice(s+1);}
    else id=raw;
    if(document.getElementById('panel-'+id)) return {tipo:'aba',id:id,secao:secao};
    return {tipo:'invalida'};
  }

  function desenhar(prog){
    var root=document.getElementById('trilha-app');
    if(!root||!curriculo) return;
    var lidas=lidasValidas(prog);
    var dadas=curriculo.aulas.filter(function(a){return a.status==='dada';}).length;
    var lidasN=Object.keys(lidas).length;
    var html='';
    html+='<div class="trilha-progresso card-bento">';
    html+='<div class="st">Trilha</div>';
    html+='<p id="trilha-lidas">'+lidasN+' de '+dadas+' aulas lidas</p>';
    html+='<div role="progressbar" aria-valuemin="0" aria-valuemax="'+dadas+'" aria-valuenow="'+lidasN+'" aria-valuetext="'+lidasN+' de '+dadas+' aulas lidas" style="height:8px;border-radius:99px;background:var(--surface2);overflow:hidden"><div style="height:100%;width:'+(dadas?Math.round(100*lidasN/dadas):0)+'%;background:var(--accent)"></div></div>';
    html+='<p class="trilha-nota">'+dadas+' de '+curriculo.aulas.length+' aulas dadas até agora. Seu progresso fica só neste navegador.</p>';
    if(prog.bloqueado||avisoSalvo) html+='<p class="note" role="status">Não consegui salvar seu progresso neste navegador.</p>';
    html+='</div><div class="modulos-grid">';
    curriculo.modulos.forEach(function(mod){
      var ys=mod.aulas.filter(function(n){var a=aulaPorNumero(n);return a&&a.status==='dada';}).length;
      html+='<article class="card-bento"><h2 class="st">'+esc(mod.id)+' · '+esc(mod.titulo)+'</h2>';
      html+='<p class="trilha-nota">'+ys+' de '+mod.aulas.length+' aulas dadas</p><ol class="trilha-ol">';
      mod.aulas.forEach(function(n){
        var a=aulaPorNumero(n);
        if(!a) return;
        html+='<li><a class="trilha-aula" href="#aula-'+nn(n)+'"><span class="trilha-aula-t">Aula '+nn(n)+' · '+esc(a.titulo)+'</span><span class="trilha-aula-side">';
        if(lidas[n]) html+='<span class="trilha-lida">Lida ✓</span>';
        html+=badge(a.status)+'</span></a></li>';
      });
      html+='</ol></article>';
    });
    html+='</div><div id="aula-aberta"></div>';
    html+='<h2 class="st">Próximos módulos</h2><div class="em-breve-grid">';
    curriculo.modulos_em_breve.forEach(function(mod){
      var faixa=typeof mod.aulas==='string'?(/[–-]/.test(mod.aulas)?'Aulas '+mod.aulas:'Aula '+mod.aulas):(mod.aulas.length===1?('Aula '+mod.aulas[0]):('Aulas '+mod.aulas[0]+' a '+mod.aulas[mod.aulas.length-1]));
      html+='<article class="card-bento" aria-disabled="true"><h3 class="st">'+esc(mod.id)+' · '+esc(mod.titulo)+'</h3><p class="trilha-nota">'+esc(faixa)+'</p>'+badge('em breve')+'</article>';
    });
    html+='</div>';
    root.innerHTML=html;
    if(aberto) desenharAula(aberto,prog);
  }

  function secaoBloco(n,slug,titulo,corpo){
    return '<section id="aula-'+nn(n)+'-'+slug+'"><h3 class="st">'+esc(titulo)+'</h3>'+corpo+'</section>';
  }
  function montarExtras(a,n,indice){
    var html='';
    if(a.fluxo&&window.renderFluxo) html+=window.renderFluxo(a.fluxo,esc);
    if(a.comparativo&&window.renderComparativo) html+=window.renderComparativo(a.comparativo,esc);
    if(a.atores&&window.renderAtores) html+=window.renderAtores(a.atores,esc);
    if(a.formula&&a.formula.html){
      var nota=a.formula.conferencia?'<p class="trilha-nota">'+esc(a.formula.conferencia)+'</p>':'';
      html+=secaoBloco(n,'formula','Fórmula',a.formula.html+nota);
      indice.push({slug:'formula',rotulo:'Fórmula'});
    }
    if(a.formulaBlocos&&window.renderBlocos){
      html+=secaoBloco(n,'formula','Fórmula',window.renderBlocos(a.formulaBlocos,esc));
      indice.push({slug:'formula',rotulo:'Fórmula'});
    }
    return html;
  }
  function listaAbas(rel){
    return rel.map(function(r){
      return '<li><a class="trilha-aula" href="#aba-'+esc(r.slug)+'">'+esc(nomeAba(r.slug))+'</a></li>';
    }).join('');
  }
  function listaVizinhos(n){
    var html='';
    if(n>1){
      var ant=aulaPorNumero(n-1);
      html+='<li><a class="trilha-aula" href="#aula-'+nn(n-1)+'">← Aula '+nn(n-1)+(ant?' · '+esc(ant.titulo):'')+'</a></li>';
    }
    if(n<curriculo.aulas.length){
      var prox=aulaPorNumero(n+1);
      html+='<li><a class="trilha-aula" href="#aula-'+nn(n+1)+'">Aula '+nn(n+1)+(prox?' · '+esc(prox.titulo):'')+' →</a></li>';
    }
    return html;
  }
  function desenharAula(n,prog){
    var box=document.getElementById('aula-aberta');
    var a=aulaPorNumero(n);
    if(!box||!a) return;
    var lidas=lidasValidas(prog);
    var indice=[];
    var rel=a.abas_relacionadas||[];
    var html='<article class="card-bento aula-corpo" id="aula-'+nn(n)+'">';
    html+='<p class="trilha-nota">Aula '+nn(n)+'</p>';
    html+='<h2 class="aula-title" tabindex="-1">'+esc(a.titulo)+'</h2>'+badge(a.status);
    var mod=moduloDa(n);
    html+='<p class="aula-chips">';
    if(mod) html+='<span class="aula-chip">'+esc(mod.m.id)+' · '+esc(mod.m.titulo)+'</span>';
    (a.pre_requisitos||[]).forEach(function(pre){
      html+='<a class="aula-chip" href="#aula-'+nn(pre)+'">Aula '+nn(pre)+'</a>';
    });
    html+='</p>';
    html+='<div class="aula-layout"><div class="aula-main">';
    if(a.status==='a seguir'){
      html+='<p class="note">Esta aula ainda não foi dada. O que segue é um roteiro para você acompanhar, não o conteúdo final.</p>';
      if(a.resumo){ html+=secaoBloco(n,'resumo','Resumo','<p>'+esc(a.resumo)+'</p>'); indice.push({slug:'resumo',rotulo:'Resumo'}); }
      if(a.no_trabalho){ html+=secaoBloco(n,'no-trabalho','No seu trabalho','<p>'+esc(a.no_trabalho)+'</p>'); indice.push({slug:'no-trabalho',rotulo:'No seu trabalho'}); }
      if(rel.length){ html+=secaoBloco(n,'estudo','Estude agora nas abas','<ul class="trilha-ol">'+listaAbas(rel)+'</ul>'); indice.push({slug:'estudo',rotulo:'Estude agora'}); }
      if(a.referencias&&a.referencias.length){
        var refs=a.referencias.map(function(nome){return '<li>'+esc(nome)+'</li>';}).join('');
        html+=secaoBloco(n,'referencias','Referências oficiais','<ul class="trilha-ol">'+refs+'</ul>');
        indice.push({slug:'referencias',rotulo:'Referências'});
      }
      var viz=listaVizinhos(n);
      if(viz){ html+=secaoBloco(n,'ligacoes','Ligações','<ul class="trilha-ol">'+viz+'</ul>'); indice.push({slug:'ligacoes',rotulo:'Ligações'}); }
    } else {
      if(a.resumo) html+='<p class="trilha-nota">'+esc(a.resumo)+'</p>';
      if(a.cenario){ html+=secaoBloco(n,'cenario','Cenário Ringgo','<p>'+esc(a.cenario)+'</p>'); indice.push({slug:'cenario',rotulo:'Cenário Ringgo'}); }
      html+=montarExtras(a,n,indice);
      if(a.erros&&a.erros.length){
        var itens=a.erros.map(function(item){
          return '<p class="note"><strong>Erro.</strong> '+esc(item.erro)+' <strong>Por quê.</strong> '+esc(item.porque)+' <strong>Como evitar.</strong> '+esc(item.evitar)+'</p>';
        }).join('');
        html+=secaoBloco(n,'erros','Erros comuns',itens);
        indice.push({slug:'erros',rotulo:'Erros comuns'});
      }
    }
    if(a.status!=='a seguir'&&rel.length){
      indice.push({slug:'ligacoes',rotulo:'Ligações'});
      html+='<section id="aula-'+nn(n)+'-ligacoes"><h3 class="st">Ligações</h3><ul class="trilha-ol">';
      rel.forEach(function(r){
        html+='<li><a class="trilha-aula" href="#aba-'+esc(r.slug)+'">'+esc(nomeAba(r.slug))+'</a></li>';
      });
      html+='</ul></section>';
    }
    html+='<nav class="aula-nav" aria-label="Navegação entre aulas">';
    if(n>1){
      var ant=aulaPorNumero(n-1);
      html+='<a href="#aula-'+nn(n-1)+'">← Aula '+nn(n-1)+(ant?'<small>'+esc(ant.titulo)+'</small>':'')+'</a>';
    }
    if(n<curriculo.aulas.length){
      var prox=aulaPorNumero(n+1);
      html+='<a href="#aula-'+nn(n+1)+'">Aula '+nn(n+1)+' →'+(prox?'<small>'+esc(prox.titulo)+'</small>':'')+'</a>';
    }
    if(n===curriculo.aulas.length) html+='<a href="#aba-trilha-guiada">Voltar à trilha</a>';
    html+='</nav>';
    if(a.status==='dada'){
      var on=!!lidas[n];
      html+='<p><button type="button" class="btn" id="btn-lida" aria-pressed="'+(on?'true':'false')+'">'+(on?'Desmarcar como lida':'Marcar como lida')+'</button></p>';
    } else {
      html+='<p class="trilha-nota">Prévia</p>';
    }
    html+='</div>';
    if(indice.length){
      html+='<nav class="aula-indice" aria-label="Nesta aula"><p class="trilha-nota">Nesta aula</p>';
      indice.forEach(function(item){
        html+='<a href="#aula-'+nn(n)+'/'+esc(item.slug)+'">'+esc(item.rotulo)+'</a>';
      });
      html+='</nav>';
    }
    html+='</div></article>';
    box.innerHTML=html;
    var btn=document.getElementById('btn-lida');
    if(btn) btn.addEventListener('click',function(){alternarLida(n);});
  }

  function alternarLida(n){
    var prog=lerProgresso();
    var nums=(prog.lidas||[]).filter(function(x){
      var a=aulaPorNumero(x);
      return a&&a.status==='dada'&&x!==n;
    });
    var a=aulaPorNumero(n);
    if(a&&a.status==='dada'&&(prog.lidas||[]).indexOf(n)<0) nums.push(n);
    nums.sort(function(x,y){return x-y;});
    if(!salvar(nums)) avisoSalvo=true;
    aberto=n;
    desenhar(lerProgresso());
    var titulo=document.getElementById('aula-'+nn(n));
    if(titulo) pousar(titulo.querySelector('.aula-title')||titulo);
  }

  function banner(rota){
    var sel=document.getElementById('nav-select');
    if(sel){
      var atual=rota.tipo==='aba'?rota.id:'trilha-guiada';
      if(sel.value!==atual) sel.value=atual;
    }
    document.querySelectorAll('.voltar-banner').forEach(function(el){el.remove();});
    var de=history.state&&history.state.de;
    if(!de) return;
    var texto='',href='#'+de;
    var aula=de.match(/^aula-(\d+)/);
    if(aula) texto='← Voltar à Aula '+nn(parseInt(aula[1],10));
    else if(de.indexOf('aba-')===0){
      var slug=de.slice(4).split('/')[0];
      texto='← Voltar à aba '+nomeAba(slug);
    } else return;
    var painel=rota.tipo==='aula'?document.getElementById('panel-trilha-guiada'):document.getElementById('panel-'+rota.id);
    if(!painel) return;
    var p=document.createElement('p');
    p.className='voltar-banner';
    p.innerHTML='<a href="'+esc(href)+'">'+esc(texto)+'</a>';
    painel.insertBefore(p,painel.firstChild);
  }

  function aplicarRota(){
    var rota=lerRota();
    aberto=rota.tipo==='aula'?rota.n:0;
    desenhar(lerProgresso());
    if(rota.tipo==='aba'){
      var tabA=document.querySelector('.tab[data-panel="'+rota.id+'"]');
      if(typeof showPanel==='function') showPanel(rota.id,tabA,'',true);
      var secEl=rota.secao?document.getElementById(rota.secao):null;
      var alvo=secEl||document.querySelector('#panel-'+rota.id+' .st, #panel-'+rota.id+' h2');
      pousar(alvo);
      document.title=nomeAba(rota.id)+' — '+baseTitle;
      var nomeSec=secEl?(secEl.textContent||'').replace(/\s+/g,' ').trim():'';
      anunciar(secEl?('Aba '+nomeAba(rota.id)+', seção '+nomeSec+' aberta.'):('Aba '+nomeAba(rota.id)+' aberta.'));
      banner(rota);
      return;
    }
    var tab=document.querySelector('.tab[data-panel="trilha-guiada"]');
    if(typeof showPanel==='function') showPanel('trilha-guiada',tab,'',true);
    if(rota.tipo==='aula'){
      var a=aulaPorNumero(rota.n);
      var mod=moduloDa(rota.n);
      var el=document.getElementById('aula-'+nn(rota.n));
      var bloco=rota.bloco?document.getElementById('aula-'+nn(rota.n)+'-'+rota.bloco):null;
      pousar(bloco||(el&&el.querySelector('.aula-title'))||el);
      document.title='Aula '+nn(rota.n)+' · '+(a?a.titulo:'')+' — '+baseTitle;
      if(rota.bloco&&!bloco) anunciar('Bloco não encontrado. Abri a Aula '+nn(rota.n)+'.');
      else anunciar('Aula '+nn(rota.n)+' de '+curriculo.aulas.length+' aberta. '+(mod?mod.m.id.replace('M','Módulo ')+'.':''));
    } else {
      document.title=baseTitle;
      if(rota.tipo==='invalida') anunciar('Endereço não encontrado. Abri a Trilha guiada.');
    }
    banner(rota);
  }
  window.aplicarRota=aplicarRota;

  document.addEventListener('click',function(ev){
    if(ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey||ev.button) return;
    var a=ev.target.closest&&ev.target.closest('a[href^="#aula-"],a[href^="#aba-"]');
    if(!a) return;
    ev.preventDefault();
    var href=a.getAttribute('href');
    var de=hashAtual();
    if(('#'+de)===href){aplicarRota();return;}
    history.pushState({de:de||null},'',href);
    aplicarRota();
  });
  window.addEventListener('hashchange',aplicarRota);
  window.addEventListener('popstate',aplicarRota);

  function init(){
    var node=document.getElementById('data-curriculo');
    if(!node) return;
    curriculo=JSON.parse(node.textContent);
    document.querySelectorAll('.tab[data-panel]').forEach(function(t){
      var clone=t.cloneNode(true);
      var badgeEl=clone.querySelector('.tab-badge');
      if(badgeEl) badgeEl.remove();
      nomes[t.getAttribute('data-panel')]=clone.textContent.replace(/\s+/g,' ').trim();
    });
    aplicarRota();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
