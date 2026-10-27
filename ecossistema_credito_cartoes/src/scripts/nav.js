function showPanel(id,el,section,fromHash){
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    const p=document.getElementById('panel-'+id);
    if(!p)return;
    p.classList.add('active');
    void p.offsetWidth;
    if(el) el.classList.add('active');
    else{
      var t=document.querySelector('.tab[data-panel="'+id+'"]');
      if(t) t.classList.add('active');
    }
    var sec=typeof section==='string'?section:'';
    if(!fromHash){
      var next='#aba-'+id+(sec?'/'+sec:'');
      if(location.hash!==next) history.pushState(null,'',next);
    }
    if(!fromHash && window.aplicarRota) window.aplicarRota();
    else if(sec && window.focarRota) window.focarRota(sec);
  }
  var SFN_MAP_DETAILS={
    bcb:{title:'Banco Central do Brasil',type:'Regulador apex — BCB',desc:'Regulador máximo do SFN. Resoluções e circulares definem o que cada tipo de instituição pode fazer. Autoriza bancos, IPs, SCDs e ESDs.',responsibilities:['Emitir licenças','Supervisionar liquidez e patrimônio de referência','Regular Pix, TED e instrumentos de pagamento','Publicar normas (ex.: Res. 80/2021 — IPs)','Aplicar sanções e intervenções'],tags:['Res. BCB 80/2021','SFN','SPB'],example:'Toda mudança de licença ou produto regulado passa pelo BCB, com requisitos de capital, governança e compliance.',onni:null},
    cmn:{title:'Conselho Monetário Nacional',type:'Normativo — CMN',desc:'Órgão normativo máximo. Define políticas monetárias e de crédito que o BCB executa. Composto por Min. da Fazenda, Min. do Planejamento e Presidente do BCB.',responsibilities:['Diretrizes de política monetária','Limites e regras de crédito','Marco de câmbio','Orientação sobre poupança e investimento'],tags:['Política monetária','Crédito'],example:'Ex.: tetos e regras de linhas de crédito (consignado privado etc.) partem do arcabouço CMN/BCB.',onni:null},
    banco_s1_s2:{title:'Banco múltiplo / comercial',type:'IF — segmento S1 / S2',desc:'Licença plena: capta depósito à vista, concede crédito, emite CDB, câmbio. Maiores requisitos de capital e governança.',responsibilities:['Captar depósitos e CDB/LCI/LCA','Crédito amplo','Câmbio e derivativos','Participação no SPB','Basileia III'],tags:['Basileia III','Depósito à vista','SPB'],example:'Grandes bancos e digitais que migraram para licença bancária plena.',onni:'A IP exemplo apoia-se em banco S1/S2 para TED, custódia e, quando necessário, originação de crédito por parceiro.'},
    banco_emissao:{title:'Banco emissor de cartão',type:'Emissor — membro de bandeira',desc:'Instituição que emite cartão ao portador: limite, fatura, liquidação com a bandeira. Cartão de crédito exige membro emissor.',responsibilities:['Emitir cartão físico/virtual','Gerir limite e cobrança','Liquidação com a bandeira','Chargeback e disputas','Risco de crédito do portador'],tags:['BIN sponsor','Chargeback','Tokenização'],example:'Emissão própria ou via parceiro que cede BIN enquanto o program manager cuida da UX.',onni:'Cartão corporativo costuma combinar program manager (IP) + BIN sponsor bancário.'},
    idic:{title:'FGC — Fundo Garantidor de Crédito',type:'Garantia',desc:'Garante depósitos em IFs até o limite legal por CPF/CNPJ. Conta de pagamento em IP segue regime de segregação e custódia — não é o mesmo mecanismo do FGC em depósito bancário.',responsibilities:['Proteção a depositantes em IFs cobertas','Administração do fundo','Pagamento em liquidação/intervenção'],tags:['Limite legal','CPF/CNPJ'],example:'CDB em banco coberto x saldo em IP: regras de proteção diferem.',onni:'Recursos de clientes da IP ficam segregados e aplicados em ativos de baixo risco; custodiante costuma ser banco parceiro.'},
    ip:{title:'Instituição de Pagamento',type:'IP — Res. BCB nº 80/2021',desc:'Conta de pagamento, Pix, boleto (com parceiros), cartão pré-pago. Não capta depósito à vista como banco nem concede crédito com recursos próprios.',responsibilities:['Contas de pagamento','Pix e transferências','Cartão pré-pago/débito','Segregação de recursos','Capital mínimo regulatório'],tags:['Conta de pagamento','Moeda eletrônica','Sem captação de depósito'],example:'Modelo de grandes apps de pagamento e wallet.',onni:'Uma IP de folha terceiriza originação de crédito (CCB, pessoal) para SCD/banco parceiro.'},
    sfd:{title:'Sociedade de Crédito Direto (SCD)',type:'SCD — crédito sem depósito público',desc:'Concede crédito com recursos próprios; capta via debêntures, FIDC etc., não via depósito de público em geral. No mercado, às vezes chamada SFD.',responsibilities:['Empréstimos e financiamentos','Funding via mercado de dívida / FIDC','Originar e ceder carteiras'],tags:['SCD','SFD','Crédito próprio','FIDC','Sem depósito'],example:'Parceiro típico para formalizar CCB em consignado quando a distribuição é feita por IP.',onni:'Evolução possível: a própria IP buscar SCD para reduzir dependência de um único originador.'},
    esd:{title:'Emissor de Salário Digital',type:'ESD — Lei 13.986/2020',desc:'Recebe folha diretamente do empregador na conta de pagamento, sem banco intermediário na cadeia do salário.',responsibilities:['Homologação e operação da folha digital','Crédito em conta do trabalhador','Requisitos de segurança e resiliência'],tags:['Folha direta','Alta barreira regulatória'],example:'Muda aquisição, dados de folha e viabilidade de desconto na fonte para crédito.',onni:'Para a IP exemplo, ESD é salto de categoria: conta principal onde o salário cai, com efeito em CAC e risco de crédito.'},
    baas:{title:'Banking as a Service (BaaS)',type:'Infraestrutura',desc:'IF/IP que abre licença e APIs para terceiros ofertarem serviços financeiros sem licença própria.',responsibilities:['APIs de conta, cartão, Pix, crédito','Compliance regulatório para parceiros','Liquidação junto ao BCB'],tags:['API-first','White-label'],example:'Parceiro origina CCB ou oferece trilho de boleto/CIP para quem não participa direto da câmara.',onni:'IP de folha costuma ser cliente de BaaS para crédito e cobrança; no futuro pode virar BaaS para empresas.'},
    correspondente:{title:'Correspondente bancário',type:'Distribuição',desc:'Empresa que presta serviços ao público em nome da IF contratante, sem licença bancária própria.',responsibilities:['Saques, recebimentos, encaminhamento de propostas','Distribuição de produtos da IF'],tags:['Sem licença própria','Responsabilidade da IF'],example:'Rede física ou digital que estende o alcance do emissor.',onni:'Parceiros HR ou rede física podem atuar como correspondentes para antecipação ou produtos da IF.'},
    boleto:{title:'Boleto registrado',type:'CIP / cobrança',desc:'Boleto registrado exige participação na infraestrutura de registro e liquidação (ex.: CIP). IPs em geral usam banco ou BaaS participante.',responsibilities:['Registro do título','Liquidação ao beneficiário','Baixa e reconciliação'],tags:['CIP','FEBRABAN'],example:'Cliente vê boleto “da marca”, mas o registro pode ser de IF participante da câmara.',onni:'A IP exemplo delega emissão/registro a IF com acesso CIP ou a BaaS com esse acesso.'},
    taas:{title:'Tech as a Service (TaaS)',type:'Fornecedor de software',desc:'Core, ledger e motores sem licença financeira: a IF contratante responde pelo regulatório.',responsibilities:['Core bancário','Motores de crédito e integrações','SLA e continuidade'],tags:['Sem licença IF','Core banking'],example:'“Traga sua licença, use nossa plataforma”.',onni:'Diferente de BaaS: TaaS não empresta licença; só tecnologia.'},
    consignado:{title:'Crédito consignado / CCB',type:'Produto',desc:'Desconto em folha ou benefício; três trilhas: privado (RH empresa), público servidor (órgão/SIAPE) e INSS (Dataprev). CCB formaliza a operação.',responsibilities:['Originador emite CCB','Desconto na fonte conforme trilha','Margem consignável regulada'],tags:['CCB','CCD','Privado · Público · INSS'],example:'Privado: app IP → SCD → averbação RH → desconto mensal. INSS: margem Dataprev.',onni:'IP exemplo foca consignado privado; INSS e servidor exigem outros convênios.'},
    antecipacao:{title:'Antecipação salarial',type:'Produto — adiantamento',desc:'Acesso a valores já trabalhados antes do pagamento; com acordo do empregador. Não é novo empréstimo no mesmo sentido do consignado.',responsibilities:['Validação com empregador','Limite sobre saldo “ganho”','Desconto na folha do período'],tags:['Earned wage access','Menor barreira para IP'],example:'IP pode oferecer sem ser banco, desde estruturado como adiantamento.',onni:'Encaixa na licença de IP: frequência e hábito de uso sem exigir CCB.'},
    cartao_corp:{title:'Cartão corporativo',type:'Produto',desc:'Em geral combina program manager (UX, limites, categorias) com emissor/BIN sponsor e bandeira.',responsibilities:['Program manager: app e políticas','Sponsor: BIN e lastro regulatório','Bandeira: rede e regras'],tags:['Pré-pago ou crédito','BIN sponsor'],example:'Mesmo padrão de várias fintechs antes de virarem emissoras diretos.',onni:'IP controla experiência; banco parceiro sustenta emissão perante a bandeira.'},
    pix:{title:'Pix / TED',type:'Pagamentos — BCB / SPB',desc:'Pix operado pelo BCB; TED via STR. IPs grandes participam de Pix; TED frequentemente via banco liquidante.',responsibilities:['Pix: participação conforme escala','TED: acesso indireto se não for participante STR'],tags:['SPI','STR','DICT'],example:'Cliente vê tudo no app da IP; liquidação pode passar por parceiro.',onni:'Crescimento pode tornar relevante participação mais direta em trilhos, conforme licença.'},
    bandeiras:{title:'Bandeiras de cartão',type:'Rede global',desc:'Conectam emissor e credenciadora; regras de segurança, chargeback e tarifas de rede.',responsibilities:['Autorização em tempo real','Regras de disputa','Certificação de participantes'],tags:['Interchange','Visa · Mastercard · Elo'],example:'Cada comprada passa pela rede da bandeira em frações de segundo.',onni:'IP emissora precisa de acordo de marca; pode ser direto ou via sponsor.'},
    credenciadora:{title:'Credenciadora (adquirente)',type:'Lado do lojista',desc:'Credencia lojista, processa via bandeira, liquida valor líquido da MDR em D+n.',responsibilities:['POS e e-commerce','Antifraude e chargeback do lojista','Liquidação ao estabelecimento'],tags:['MDR','Stone · Cielo · Rede'],example:'Compra com cartão corporativo: adquirente do lojista + bandeira + emissor.',onni:'A IP exemplo está no lado emissor; entender MDR explica custo da aceitação.'}
  };
  function sfnMapShowDetail(key,btn){
    var d=SFN_MAP_DETAILS[key];
    if(!d)return;
    document.querySelectorAll('#panel-sfn-brasil .sfn-card').forEach(function(c){c.classList.remove('sfn-card--active');});
    if(btn)btn.classList.add('sfn-card--active');
    var hint=document.getElementById('sfn-map-hint');
    var box=document.getElementById('sfn-map-detail');
    if(hint)hint.style.display='none';
    if(!box)return;
    box.style.display='block';
    var tags=(d.tags||[]).map(function(t){return '<span class="sfn-tag">'+t+'</span>';}).join('');
    var resp=(d.responsibilities||[]).map(function(r){return '<li>'+r+'</li>';}).join('');
    var ex=d.example?'<div class="cred-minihead">Exemplo prático</div><div class="sfn-example">'+d.example+'</div>':'';
    var on=d.onni?'<div class="cred-minihead">Exemplo — IP de folha / benefícios</div><div class="sfn-onni">'+d.onni+'</div>':'';
    box.innerHTML='<div class="sfn-side-title">'+d.title+'</div><div class="sfn-side-type">'+d.type+'</div><p class="sfn-side-desc">'+d.desc+'</p><div class="sfn-tag-row">'+tags+'</div><div class="cred-minihead">Responsabilidades</div><ul class="sfn-side-list">'+resp+'</ul>'+ex+on;
  }
  function setTabCategoryFilter(cat){
    var tabsWrap=document.querySelector('.tabs');
    if(!tabsWrap)return;
    var showAll=cat==='all';
    tabsWrap.querySelectorAll('.tab').forEach(function(tab){
      var c=tab.getAttribute('data-cat');
      if(showAll||c===cat){tab.classList.remove('is-filtered-out');}
      else{tab.classList.add('is-filtered-out');}
    });
    tabsWrap.querySelectorAll('.tab-sep').forEach(function(sep){
      if(showAll){sep.classList.remove('is-filtered-out');}
      else{sep.classList.add('is-filtered-out');}
    });
    document.querySelectorAll('.menu-story [data-filter]').forEach(function(chip){
      chip.setAttribute('aria-pressed',chip.getAttribute('data-filter')===cat?'true':'false');
    });
    var active=document.querySelector('.tab.active');
    if(active&&active.classList.contains('is-filtered-out')){
      var first=tabsWrap.querySelector('.tab:not(.is-filtered-out)');
      if(first){
        var pid=first.getAttribute('data-panel');
        if(pid)showPanel(pid,first);
      }
    }
    var vis=document.querySelector('.tab.active');
    if(vis&&typeof vis.scrollIntoView==='function'){try{vis.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});}catch(e){vis.scrollIntoView(false);}}
  }
  (function(){
    document.querySelectorAll('.menu-story [data-filter]').forEach(function(chip){
      chip.addEventListener('click',function(){
        setTabCategoryFilter(chip.getAttribute('data-filter')||'all');
      });
    });
    var sel=document.getElementById('nav-select');
    if(sel) sel.addEventListener('change',function(){
      var next='#aba-'+sel.value;
      if(location.hash!==next) location.hash=next;
      else if(window.aplicarRota) window.aplicarRota();
    });
  })();

