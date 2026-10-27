(function(){
    function norm(s){
      try{
        return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
      }catch(e){
        return (s||'').toLowerCase().replace(/\s+/g,' ').trim();
      }
    }
    var MAX=12;
    var SEARCH_INDEX=[
      {kw:'trilha guiada ringgo narrativa inicio comecar estado',title:'Trilha guiada — início',panel:'trilha-guiada',anchor:'anchor-trilha-inicio',cat:'Fundamentos'},
      {kw:'ringgo ip instituicao pagamento fio',title:'Ringgo e limites da IP',panel:'trilha-guiada',anchor:'anchor-trilha-inicio',cat:'Fundamentos'},
      {kw:'cmn conselho monetario nacional bcb bacen regulador',title:'CMN e Banco Central',panel:'sfn-licencas',anchor:'anchor-cmn-bcb',cat:'Fundamentos'},
      {kw:'sfn licencas escada ip esd sfd banco',title:'SFN e escada de licenças',panel:'sfn-licencas',anchor:'',cat:'Fundamentos'},
      {kw:'mapa sfn brasil camadas bcb bmp consignado',title:'Mapa SFN (Brasil)',panel:'sfn-brasil',anchor:'anchor-mapa-sfn',cat:'Fundamentos'},
      {kw:'esd salario digital folha',title:'ESD — salário digital',panel:'sfn-brasil',anchor:'anchor-mapa-sfn',cat:'Fundamentos'},
      {kw:'sistema monetario reserva fracionaria m0 m2 compulsorio',title:'Sistema monetário e reservas',panel:'sistema-monetario',anchor:'anchor-reserva-fracionaria',cat:'Fundamentos'},
      {kw:'inflacao juros selic copom ipca',title:'Inflação e juros',panel:'inflacao-juros',anchor:'anchor-inflacao',cat:'Fundamentos'},
      {kw:'cambio dolar reservas bretton petrodolar',title:'Sistema global e câmbio',panel:'sistema-global',anchor:'',cat:'Fundamentos'},
      {kw:'economia credito spread pdd rotativo consignado friccao garantia',title:'Economia do crédito',panel:'economia-credito',anchor:'anchor-logica-credito',cat:'Crédito'},
      {kw:'consignado ccb ccd margem averbacao folha parcelas originador',title:'Consignado — produto e operação',panel:'consignado',anchor:'anchor-consignado-produto',cat:'Crédito'},
      {kw:'consignado privado publico servidor inss trilhas dataprev siape',title:'Consignado — três trilhas',panel:'consignado',anchor:'anchor-consignado-trilhas',cat:'Crédito'},
      {kw:'consignado emissao ccb ccd desembolso rh financeiro',title:'Consignado — fluxo back-office',panel:'consignado',anchor:'anchor-consignado-backoffice',cat:'Crédito'},
      {kw:'consignado players fidc cessao securitizadora bmp',title:'Consignado — players e FIDC',panel:'consignado',anchor:'anchor-consignado-players',cat:'Crédito'},
      {kw:'consorcio administradora grupo contemplacao',title:'Consórcio',panel:'economia-credito',anchor:'anchor-consorcio',cat:'Crédito'},
      {kw:'cheque especial limite pre aprovado portabilidade',title:'Cheque especial',panel:'economia-credito',anchor:'',cat:'Crédito'},
      {kw:'credito pessoal score cet',title:'Crédito pessoal e CET',panel:'economia-credito',anchor:'anchor-cet-tac',cat:'Crédito'},
      {kw:'cdi cdb selic captacao',title:'CDI e CDB',panel:'cdi',anchor:'anchor-cdi',cat:'Crédito'},
      {kw:'lci lca precatorio titulos',title:'LCI, LCA e precatórios',panel:'titulos-credito',anchor:'',cat:'Crédito'},
      {kw:'encargos rotativo tac cet iof anatocismo',title:'Encargos e CET',panel:'encargos',anchor:'anchor-cet-tac',cat:'Crédito'},
      {kw:'ecossistema 4 partes portador emissor bandeira adquirente',title:'Ecossistema — 4 participantes',panel:'eco',anchor:'anchor-eco-4partes',cat:'Pagamentos'},
      {kw:'folha pagamento erp esocial e-social cnab convenio bolsao salario clt',title:'Folha & Pagamento — início',panel:'folha',anchor:'anchor-folha-inicio',cat:'Pagamentos'},
      {kw:'quem calcula declara paga erp banco esocial contador inss irrf',title:'Quem faz o quê na folha',panel:'folha',anchor:'anchor-folha-quem-faz',cat:'Pagamentos'},
      {kw:'esocial e-social obrigacao trabalhista previdencia dado nao liquida',title:'e-Social ≠ liquidação',panel:'folha',anchor:'anchor-folha-erp',cat:'Pagamentos'},
      {kw:'governo confere fiscalizacao cruzamento declaracao esocial multa',title:'Como o governo confere a folha',panel:'folha',anchor:'anchor-folha-governo',cat:'Pagamentos'},
      {kw:'arquivo cnab api banco liquido cpf conta vs erp calculo',title:'Arquivo ao banco vs ERP',panel:'folha',anchor:'anchor-folha-arquivo',cat:'Pagamentos'},
      {kw:'fgts guia recolhimento estado liquido colaborador dois dinheiros',title:'Líquido vs guias / FGTS',panel:'folha',anchor:'anchor-folha-fgts',cat:'Pagamentos'},
      {kw:'convenio folha banco ip baas empresa rh arquivo contador',title:'Empresa × banco/IP de folha',panel:'folha',anchor:'anchor-folha-empresa-banco',cat:'Pagamentos'},
      {kw:'fluxo folha privado clt erp bolsao pulverizacao conciliacao',title:'Fluxo privado ERP → colaborador',panel:'folha',anchor:'anchor-folha-fluxo-privado',cat:'Pagamentos'},
      {kw:'sem erp pme planilha contador folha light manual',title:'Quando não tem ERP',panel:'folha',anchor:'anchor-folha-sem-erp',cat:'Pagamentos'},
      {kw:'folha privado publico inss siape dataprev pagamento salario beneficio',title:'Três trilhas de quem paga',panel:'folha',anchor:'anchor-folha-trilhas',cat:'Pagamentos'},
      {kw:'dataprev inss beneficio nao rh privado siape consignado',title:'Onde o Dataprev entra',panel:'folha',anchor:'anchor-folha-dataprev',cat:'Pagamentos'},
      {kw:'ringgo folha beneficios esd antecipacao salarial conta',title:'Ringgo no ciclo de folha',panel:'folha',anchor:'anchor-folha-ringgo',cat:'Pagamentos'},
      {kw:'bandeira emissor scheme fee interchange lucro visa mastercard elo bin',title:'Bandeira × emissor — cobranças e lucro',panel:'eco',anchor:'anchor-bandeira-emissor',cat:'Pagamentos'},
      {kw:'debito credito crebito pre pago pos pago modalidades cartao',title:'Modalidades de cartão',panel:'eco',anchor:'anchor-modalidades-cartao',cat:'Pagamentos'},
      {kw:'beneficio voucher pat alimentacao refeicao frota ringgo',title:'Cartões de benefícios',panel:'eco',anchor:'anchor-beneficios',cat:'Pagamentos'},
      {kw:'compra fluxo captura autorizacao liquidacao',title:'Fluxo da compra com cartão',panel:'eco',anchor:'',cat:'Pagamentos'},
      {kw:'infra bancaria baas taas ccd cip pix boleto bmp celcoin infratech',title:'Infra bancária e parceiros',panel:'infra-bancaria',anchor:'anchor-infratech',cat:'Pagamentos'},
      {kw:'conta bolsao transitoria caucao escrow vinculada concentradora folha',title:'Contas especiais — bolsão, caução, escrow',panel:'infra-bancaria',anchor:'anchor-contas-especiais',cat:'Pagamentos'},
      {kw:'consignado ccd margem folha rh sfd originador',title:'Consignado — resumo canal (Infra)',panel:'infra-bancaria',anchor:'anchor-consignado-fluxo',cat:'Pagamentos'},
      {kw:'mdr interchange merchant discount scheme fee',title:'MDR e decomposição',panel:'taxas',anchor:'anchor-mdr',cat:'Pagamentos'},
      {kw:'tiers cartao classic gold platinum titanium ic',title:'Tiers de cartão e IC',panel:'tiers',anchor:'anchor-tiers-ic',cat:'Pagamentos'},
      {kw:'mcc cnae merchant category codigo estabelecimento receita',title:'MCC e CNAE',panel:'tiers',anchor:'anchor-mcc-cnae',cat:'Pagamentos'},
      {kw:'split crebito marketplace',title:'Split e Crébito',panel:'split',anchor:'anchor-split',cat:'Pagamentos'},
      {kw:'wacc eva valor economico custo capital pdd opex capex',title:'WACC e EVA',panel:'eva',anchor:'anchor-eva-produto',cat:'Mercado'},
      {kw:'fidc securitizadora administradora gestora margem cotas',title:'FIDC — atores e cotas',panel:'mercado',anchor:'anchor-fidc-atores',cat:'Mercado'},
      {kw:'risco sacado antecipacao recebiveis sacado cedente',title:'Risco sacado e recebíveis',panel:'economia-credito',anchor:'anchor-risco-sacado',cat:'Crédito'},
      {kw:'fidc acoes mercado capitais securitizacao',title:'FIDC e ações',panel:'mercado',anchor:'',cat:'Mercado'},
      {kw:'infratech baas taas celcoin ip scd licenca',title:'Infratech, IP e SCD',panel:'infra-bancaria',anchor:'anchor-infratech',cat:'Pagamentos'},
      {kw:'antecipacao recebiveis lojista duplicata cartao d+n',title:'Antecipação de recebíveis',panel:'economia-credito',anchor:'anchor-antecipacao-recebiveis',cat:'Crédito'},
      {kw:'venture capital vc rodada diluicao pro-rata pmf',title:'Venture capital e rodadas',panel:'vc',anchor:'',cat:'Mercado'},
      {kw:'recuperacao judicial rj lei 11101',title:'Recuperação judicial',panel:'rj',anchor:'',cat:'Risco'},
      {kw:'pci dss seguranca bandeira',title:'PCI-DSS',panel:'pci',anchor:'anchor-pci',cat:'Risco'},
      {kw:'tokenizacao 3ds 3-d secure',title:'Tokenização e 3DS',panel:'pci',anchor:'',cat:'Risco'},
      {kw:'chargeback fraude contestacao',title:'Chargeback',panel:'chargeback',anchor:'anchor-chargeback',cat:'Risco'},
      {kw:'glossario termos definicoes dicionario',title:'Glossário completo',panel:'glossario',anchor:'anchor-glossario',cat:'Mercado'},
      {kw:'pix spi dict ted str spb',title:'Pix e trilhos (SPI/STR)',panel:'sfn-brasil',anchor:'anchor-mapa-sfn',cat:'Fundamentos'},
      {kw:'bin sponsor program manager cartao corporativo',title:'BIN sponsor e program manager',panel:'sfn-brasil',anchor:'anchor-mapa-sfn',cat:'Fundamentos'},
      {kw:'interchange ic adquirente credenciadora',title:'Interchange e credenciadora',panel:'taxas',anchor:'anchor-mdr',cat:'Pagamentos'},
      {kw:'antecipacao salarial earned wage ewa',title:'Antecipação salarial',panel:'economia-credito',anchor:'',cat:'Crédito'},
      {kw:'fgc garantidor deposito segregacao ip',title:'FGC e segregação em IP',panel:'sfn-brasil',anchor:'anchor-mapa-sfn',cat:'Fundamentos'},
      {kw:'basileia capital regulacao banco s1 s2',title:'Basileia e bancos S1/S2',panel:'sfn-licencas',anchor:'',cat:'Fundamentos'},
      {kw:'open finance itp pagamento iniciador',title:'ITP / Open Finance',panel:'glossario',anchor:'',cat:'Mercado'},
      {kw:'unit economics churn cac ltv',title:'Unit economics (RJ / startups)',panel:'rj',anchor:'',cat:'Risco'}
    ];
    var inp=document.getElementById('nav-search-input');
    var dd=document.getElementById('nav-search-dropdown');
    if(!inp||!dd)return;
    var activeIdx=-1;
    var currentList=[];
    function scoreEntry(qNorm,e){
      var k=e._kn||(e._kn=norm(e.kw));
      if(!qNorm)return 0;
      if(k.indexOf(qNorm)>=0)return 100+(k.indexOf(qNorm)===0?10:0);
      var parts=qNorm.split(' ').filter(Boolean);
      var hit=0;
      for(var i=0;i<parts.length;i++){
        if(k.indexOf(parts[i])>=0)hit++;
      }
      return hit===parts.length&&parts.length?50:0;
    }
    function indiceGerado(){
      var node=document.getElementById('search-index');
      if(!node)return [];
      try{return JSON.parse(node.textContent)||[];}catch(e){return [];}
    }
    function deIndice(item){
      var tipo=item.t==='termo'?'Termo':item.t==='secao'?'Seção':item.t==='aula'?('Aula '+String(item.n).padStart(2,'0')):'Aba';
      return {title:item.ti,cat:tipo+(item.tx?' · '+item.tx:''),panel:item.t==='aula'?'trilha-guiada':(item.ab||''),anchor:'',kind:item.t,hash:item.a||'',st:item.st||''};
    }
    function scoreIndice(qn,item){
      var hay=norm((item.ti||'')+' '+(item.tx||'')+' '+((item.k)||[]).join(' '));
      if(!hay)return 0;
      if(hay.indexOf(qn)<0){
        var parts=qn.split(' ').filter(Boolean);
        for(var i=0;i<parts.length;i++) if(hay.indexOf(parts[i])<0) return 0;
      }
      var rank=item.t==='termo'?300:(item.t==='aula'?100:200);
      if(norm(item.ti||'').indexOf(qn)===0) rank+=40;
      if(item.t==='termo'&&norm(item.ti||'')===qn) rank+=80;
      return rank;
    }
    function filterList(q){
      var qn=norm(q);
      if(qn.length<2)return [];
      var scored=indiceGerado().map(function(item){
        return {e:deIndice(item),s:scoreIndice(qn,item)};
      }).concat(SEARCH_INDEX.map(function(e){
        return {e:e,s:scoreEntry(qn,e)};
      })).filter(function(x){return x.s>0;});
      scored.sort(function(a,b){return b.s-a.s||(a.e.title>b.e.title?1:-1);});
      var seen={},out=[];
      for(var i=0;i<scored.length&&out.length<MAX;i++){
        var key=(scored[i].e.hash||'')+'|'+(scored[i].e.panel||'')+'|'+(scored[i].e.anchor||'')+'|'+scored[i].e.title;
        if(seen[key])continue;
        seen[key]=1;
        out.push(scored[i].e);
      }
      return out;
    }
    function closeDropdown(){
      dd.classList.remove('is-open');
      dd.hidden=true;
      dd.innerHTML='';
      inp.setAttribute('aria-expanded','false');
      activeIdx=-1;
      currentList=[];
    }
    function openDropdown(){
      dd.classList.add('is-open');
      dd.hidden=false;
      inp.setAttribute('aria-expanded','true');
    }
    function renderList(list){
      currentList=list;
      activeIdx=list.length?0:-1;
      dd.innerHTML='';
      if(!list.length){
        dd.innerHTML='<div class="nav-search-empty" role="option"></div>';
        dd.querySelector('.nav-search-empty').textContent='Nada encontrado para “'+inp.value+'”. Tente uma sigla ou o nome de um produto.';
        openDropdown();
        return;
      }
      var hint=document.createElement('div');
      hint.className='nav-search-hint';
      hint.textContent='↑ ↓ navegar · Enter abrir · Esc fechar';
      dd.appendChild(hint);
      for(var i=0;i<list.length;i++){
        (function(idx){
          var e=list[idx];
          var btn=document.createElement('button');
          btn.type='button';
          btn.className='nav-search-item'+(idx===0?' is-active':'');
          btn.setAttribute('role','option');
          btn.id='nav-search-opt-'+idx;
          btn.innerHTML='<span class="ns-title"></span><span class="ns-meta"></span>';
          btn.querySelector('.ns-title').textContent=e.title;
          btn.querySelector('.ns-meta').textContent=e.kind?e.cat:('Aba: '+e.cat+(e.anchor?' · salta para seção':''));
          if(e.kind==='aula'&&e.st&&window.badgeTrilha){
            var marca=document.createElement('span');
            marca.innerHTML=window.badgeTrilha(e.st);
            if(marca.firstChild) btn.querySelector('.ns-meta').appendChild(marca.firstChild);
          }
          btn.addEventListener('mousedown',function(ev){ev.preventDefault();});
          btn.addEventListener('click',function(){applyEntry(e);});
          dd.appendChild(btn);
        })(i);
      }
      openDropdown();
    }
    function highlightActive(){
      var items=dd.querySelectorAll('.nav-search-item');
      items.forEach(function(node,i){
        node.classList.toggle('is-active',i===activeIdx);
      });
    }
    function applyEntry(e){
      if(typeof setTabCategoryFilter==='function') setTabCategoryFilter('all');
      if(e.hash){
        if(location.hash!==e.hash) location.hash=e.hash;
        else if(window.aplicarRota) window.aplicarRota();
        closeDropdown();
        inp.value='';
        inp.blur();
        return;
      }
      var tab=document.querySelector('.tab[data-panel="'+e.panel+'"]');
      showPanel(e.panel,tab||null,e.anchor||'');
      closeDropdown();
      inp.value='';
      inp.blur();
      if(!e.anchor)return;
      var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          var el=document.getElementById(e.anchor);
          if(!el)return;
          el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
          el.classList.remove('jump-flash');
          void el.offsetWidth;
          el.classList.add('jump-flash');
          window.setTimeout(function(){el.classList.remove('jump-flash');},1200);
        });
      });
    }
    function onInput(){
      var v=inp.value;
      var list=filterList(v);
      if(norm(v).length<2){closeDropdown();return;}
      renderList(list);
    }
    inp.addEventListener('input',onInput);
    inp.addEventListener('focus',function(){
      if(norm(inp.value).length>=2) onInput();
    });
    inp.addEventListener('keydown',function(ev){
      if(!dd.classList.contains('is-open')||!currentList.length){
        if(ev.key==='Escape'){inp.blur();closeDropdown();}
        return;
      }
      if(ev.key==='Escape'){ev.preventDefault();closeDropdown();return;}
      if(ev.key==='ArrowDown'){ev.preventDefault();activeIdx=Math.min(activeIdx+1,currentList.length-1);highlightActive();return;}
      if(ev.key==='ArrowUp'){ev.preventDefault();activeIdx=Math.max(activeIdx-1,0);highlightActive();return;}
      if(ev.key==='Enter'){
        ev.preventDefault();
        if(activeIdx>=0&&currentList[activeIdx]) applyEntry(currentList[activeIdx]);
        return;
      }
    });
    document.addEventListener('click',function(ev){
      if(!inp.contains(ev.target)&&!dd.contains(ev.target)) closeDropdown();
    });
    document.addEventListener('keydown',function(ev){
      if(ev.key!=='/'||ev.ctrlKey||ev.metaKey||ev.altKey)return;
      var t=ev.target;
      if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||(t.isContentEditable)))return;
      ev.preventDefault();
      inp.focus();
      inp.select();
    });
  })();
