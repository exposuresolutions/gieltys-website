/**
 * ES AI Chatbot Widget — Universal Drop-In
 * 
 * Add to ANY client site with just 1 line:
 *   <script src="/assets/es-chatbot-widget.js" data-client="gieltys"></script>
 * 
 * Clients: gieltys | flavors | fantasy-mini-golf | offshore | achill-market | coaches | cafe
 * 
 * White-label: data-client="gieltys" sets everything automatically.
 * Custom: data-client="custom" data-name="My Bar" data-color="#ff6600" data-greeting="Welcome!"
 * 
 * UX: Big friendly button, large text, simple interface.
 * Designed so elderly visitors and children can use it easily.
 */
(function() {
  'use strict';

  var CHAT_API = 'https://dodealswithlee.onrender.com/api/ai-chat';
  
  var script = document.currentScript;
  var CLIENT = (script && script.getAttribute('data-client')) || 'general';

  var CONFIG = {
    gieltys: {
      name: "Gielty's Helper",
      greeting: "Hello! I'm here to help with bookings, menus, events, or anything about Achill Island. What can I do for you?",
      color: '#1e3a5f',
      colorLight: '#2563eb',
      icon: '🍺'
    },
    flavors: {
      name: 'Flavors Helper',
      greeting: "Hey! Welcome to Flavors! I can help with events, drinks, jobs, or the exchange program. What's up?",
      color: '#7c1c7c',
      colorLight: '#a855f7',
      icon: '🍹'
    },
    'fantasy-mini-golf': {
      name: 'Golf Helper',
      greeting: "Welcome to Fantasy Mini Golf! I can help with bookings, courses, group events, or prices. Ask away!",
      color: '#065f46',
      colorLight: '#10b981',
      icon: '⛳'
    },
    offshore: {
      name: 'Jobs Helper',
      greeting: "Welcome to Achill Offshore! I can help you find jobs — local or international. What are you looking for?",
      color: '#0c2d48',
      colorLight: '#0ea5e9',
      icon: '💼'
    },
    'achill-market': {
      name: 'Market Guide',
      greeting: "Welcome to Achill Market! I know all the vendors and can help you find what you need. Ask me anything!",
      color: '#2d5016',
      colorLight: '#65a30d',
      icon: '🌿'
    },
    coaches: {
      name: 'Booking Helper',
      greeting: "Welcome to Achill Coaches! I can help with coach hire, routes, group bookings, and prices.",
      color: '#1e3a5f',
      colorLight: '#3b82f6',
      icon: '🚌'
    },
    cafe: {
      name: "Cafe Helper",
      greeting: "Welcome to Gielty's Cafe! I can help with our menu, opening times, and directions.",
      color: '#78350f',
      colorLight: '#d97706',
      icon: '☕'
    },
    general: {
      name: 'AI Helper',
      greeting: "Hello! How can I help you today?",
      color: '#1e3a5f',
      colorLight: '#2563eb',
      icon: '💬'
    }
  };

  // White-label: custom venue via data attributes
  if (CLIENT === 'custom' && script) {
    CONFIG.custom = {
      name: script.getAttribute('data-name') || 'AI Helper',
      greeting: script.getAttribute('data-greeting') || 'Hello! How can I help you today?',
      color: script.getAttribute('data-color') || '#1e3a5f',
      colorLight: script.getAttribute('data-color-light') || script.getAttribute('data-color') || '#2563eb',
      icon: script.getAttribute('data-icon') || '💬'
    };
  }

  var c = CONFIG[CLIENT] || CONFIG.general;
  var history = [];
  var isOpen = false;
  var isLoading = false;

  var css = document.createElement('style');
  css.textContent = [
    '#es-w-toggle{position:fixed;bottom:20px;right:20px;width:64px;height:64px;border-radius:50%;',
    'background:linear-gradient(135deg,' + c.color + ',' + c.colorLight + ');',
    'color:#fff;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.3);z-index:99999;',
    'display:flex;align-items:center;justify-content:center;font-size:28px;',
    'transition:transform .3s,box-shadow .3s}',
    '#es-w-toggle:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(0,0,0,.4)}',
    '#es-w-panel{position:fixed;bottom:94px;right:20px;width:360px;max-height:500px;',
    'background:#fff;border-radius:18px;box-shadow:0 10px 40px rgba(0,0,0,.18);z-index:99998;',
    'display:none;flex-direction:column;overflow:hidden;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif}',
    '#es-w-panel.open{display:flex}',
    '#es-w-head{background:linear-gradient(135deg,' + c.color + ',' + c.colorLight + ');',
    'color:#fff;padding:18px 20px;font-weight:700;font-size:17px;display:flex;align-items:center;gap:10px}',
    '#es-w-head .dot{width:9px;height:9px;background:#4ade80;border-radius:50%;animation:es-p 2s infinite}',
    '@keyframes es-p{0%,100%{opacity:1}50%{opacity:.3}}',
    '#es-w-msgs{flex:1;overflow-y:auto;padding:16px;max-height:320px;display:flex;flex-direction:column;gap:10px}',
    '.es-m{max-width:82%;padding:12px 16px;border-radius:16px;font-size:15px;line-height:1.6;word-wrap:break-word}',
    '.es-m.a{background:#f1f5f9;color:#1e293b;align-self:flex-start;border-bottom-left-radius:4px}',
    '.es-m.u{background:' + c.colorLight + ';color:#fff;align-self:flex-end;border-bottom-right-radius:4px}',
    '.es-td span{display:inline-block;width:7px;height:7px;background:#94a3b8;border-radius:50%;margin:0 2px;animation:es-b 1.4s infinite}',
    '.es-td span:nth-child(2){animation-delay:.2s}.es-td span:nth-child(3){animation-delay:.4s}',
    '@keyframes es-b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}',
    '#es-w-bar{display:flex;padding:12px;border-top:1px solid #e2e8f0;gap:8px}',
    '#es-w-inp{flex:1;border:2px solid #e2e8f0;border-radius:12px;padding:12px 16px;font-size:16px;',
    'outline:none;transition:border .2s;font-family:inherit}',
    '#es-w-inp:focus{border-color:' + c.colorLight + '}',
    '#es-w-btn{background:' + c.colorLight + ';color:#fff;border:none;border-radius:12px;',
    'padding:12px 20px;cursor:pointer;font-weight:700;font-size:15px;transition:opacity .2s;min-width:70px}',
    '#es-w-btn:disabled{opacity:.5;cursor:not-allowed}',
    '#es-w-pwr{text-align:center;padding:6px;font-size:11px;color:#94a3b8}',
    '#es-w-pwr a{color:#64748b;text-decoration:none}',
    '@media(max-width:440px){#es-w-panel{width:calc(100vw - 20px);right:10px;bottom:90px;max-height:65vh}',
    '#es-w-toggle{width:56px;height:56px;font-size:24px;bottom:16px;right:16px}}'
  ].join('');
  document.head.appendChild(css);

  var toggle = document.createElement('button');
  toggle.id = 'es-w-toggle';
  toggle.setAttribute('aria-label', 'Chat with us');
  toggle.textContent = c.icon;

  var panel = document.createElement('div');
  panel.id = 'es-w-panel';
  panel.innerHTML = [
    '<div id="es-w-head"><span class="dot"></span><span>' + c.name + '</span></div>',
    '<div id="es-w-msgs"></div>',
    '<div id="es-w-bar">',
    '<input id="es-w-inp" type="text" placeholder="Type your question..." autocomplete="off">',
    '<button id="es-w-btn">Send</button>',
    '</div>',
    '<div id="es-w-pwr">Powered by <a href="https://exposuresolutions.ie" target="_blank">Exposure Solutions</a></div>'
  ].join('');

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  var msgs = document.getElementById('es-w-msgs');
  var inp = document.getElementById('es-w-inp');
  var btn = document.getElementById('es-w-btn');

  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'es-m ' + who;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var d = document.createElement('div');
    d.className = 'es-m a';
    d.id = 'es-typing';
    d.innerHTML = '<div class="es-td"><span></span><span></span><span></span></div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('es-typing');
    if (t) t.remove();
  }

  function send() {
    var text = inp.value.trim();
    if (!text || isLoading) return;
    inp.value = '';
    btn.disabled = true;
    isLoading = true;
    addMsg(text, 'u');
    history.push({ role: 'user', content: text });
    showTyping();

    fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client: CLIENT, message: text, history: history.slice(-6) })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      hideTyping();
      var reply = (data && data.reply) ? data.reply : c.greeting;
      addMsg(reply, 'a');
      history.push({ role: 'assistant', content: reply });
    })
    .catch(function() {
      hideTyping();
      addMsg("Sorry, I'm having a wee connection issue. Try again in a moment!", 'a');
    })
    .finally(function() {
      btn.disabled = false;
      isLoading = false;
      inp.focus();
    });
  }

  toggle.addEventListener('click', function() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    toggle.textContent = isOpen ? '✕' : c.icon;
    toggle.style.fontSize = isOpen ? '22px' : '28px';
    if (isOpen && history.length === 0) addMsg(c.greeting, 'a');
    if (isOpen) inp.focus();
  });

  btn.addEventListener('click', send);
  inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); send(); }
  });
})();
