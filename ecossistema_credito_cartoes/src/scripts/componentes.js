(function(){
  function desc(itens){
    return '<details class="cmp-desc"><summary>Ver descrição em texto</summary><ol>'+itens.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ol></details>';
  }
  window.renderFluxo=function(dado,esc){
    var linha=dado.passos.length<=5?' is-row':'';
    var lis=dado.passos.map(function(p){
      var aresta=p.aresta?'<span class="cmp-edge">↓ '+esc(p.aresta)+'</span>':'';
      return '<li>'+aresta+'<b>'+esc(p.titulo)+'</b> '+esc(p.linha||'')+'</li>';
    }).join('');
    var texto=dado.passos.map(function(p,i){return esc((i+1)+'. '+p.titulo+' '+(p.linha||'')+(p.aresta?' ('+p.aresta+')':''));});
    return '<figure class="cmp cmp-fluxo"><figcaption>'+esc(dado.titulo)+'<small>'+esc(dado.leitura)+'</small></figcaption><ol class="cmp-fluxo-list'+linha+'">'+lis+'</ol>'+desc(texto)+'</figure>';
  };
  window.renderComparativo=function(dado,esc){
    var duas=dado.colunas.length===2?' is-2col':'';
    var head=dado.colunas.map(function(c){return '<th scope="col">'+esc(c)+'</th>';}).join('');
    var body=dado.linhas.map(function(linha){
      return '<tr>'+linha.map(function(cel,i){return '<td data-col="'+esc(dado.colunas[i]||'')+'">'+esc(cel)+'</td>';}).join('')+'</tr>';
    }).join('');
    var texto=dado.linhas.map(function(linha){return esc(linha.filter(Boolean).join(' · '));});
    return '<figure class="cmp cmp-comparativo'+duas+'"><figcaption>'+esc(dado.titulo)+'<small>'+esc(dado.leitura)+'</small></figcaption><div class="cmp-scroll" role="region" aria-label="'+esc(dado.titulo)+' (role para os lados)" tabindex="0"><p class="cmp-hint">Role para os lados →</p><table class="cmp-table"><caption class="visually-hidden">'+esc(dado.titulo)+'</caption><thead><tr>'+head+'</tr></thead><tbody>'+body+'</tbody></table></div>'+desc(texto)+'</figure>';
  };
  window.renderAtores=function(dado,esc){
    var camadas=dado.camadas.map(function(c){
      var cards=c.atores.map(function(a){
        var selo=a.aqui?'<span class="cmp-aqui">Ringgo está aqui</span>':'';
        var miolo='<b>'+esc(a.sigla)+'</b><span>'+esc(a.papel)+'</span>'+selo;
        if(a.href) miolo='<a href="'+esc(a.href)+'">'+miolo+'</a>';
        return '<li class="cmp-actor">'+miolo+'</li>';
      }).join('');
      return '<section class="cmp-layer"><h4>'+esc(c.titulo)+'</h4><ul>'+cards+'</ul></section>';
    }).join('');
    var texto=dado.relacoes.map(esc);
    return '<figure class="cmp cmp-atores"><figcaption>'+esc(dado.titulo)+'<small>'+esc(dado.leitura)+'</small></figcaption>'+camadas+'<p>'+texto.join(' ')+'</p>'+desc(texto)+'</figure>';
  };
  window.renderBlocos=function(dado,esc){
    var partes=dado.partes.map(function(p){return '<span>'+esc(p)+'</span>';}).join('<span aria-hidden="true">×</span>');
    return '<figure class="cmp cmp-formula"><figcaption>'+esc(dado.titulo)+'</figcaption><div class="cmp-blocos">'+partes+'<span aria-hidden="true">=</span><span>'+esc(dado.resultado)+'</span></div><p class="cmp-read"><b>Em palavras:</b> '+esc(dado.leitura)+'</p></figure>';
  };
})();
