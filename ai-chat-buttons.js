(function () {
  function buildPrompt() {
    return "Read from " + window.location.href + " so I can ask questions about it.";
  }

  function buildChatGPTUrl() {
    return "https://chatgpt.com/?q=" + encodeURIComponent(buildPrompt());
  }

  function buildClaudeUrl() {
    return "https://claude.ai/new?q=" + encodeURIComponent(buildPrompt());
  }

  var CHATGPT_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.846 19.9a4.5 4.5 0 0 1-6.246-1.596zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.01 13.484a4.5 4.5 0 0 1-1.67-5.588zm16.597 3.855l-5.843-3.368 2.02-1.164a.076.076 0 0 1 .071 0l4.808 2.774a4.5 4.5 0 0 1-.676 8.115V12.47a.767.767 0 0 0-.38-.72zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.807-2.774a4.5 4.5 0 0 1 6.675 4.665zm-12.65 4.148l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>';

  var CLAUDE_ICON = '<svg width="18" height="18" viewBox="0 0 248 248" fill="currentColor"><path d="M52.4285 162.873L98.7844 136.879L99.5485 134.602L98.7844 133.334H96.4921L88.7237 132.862L62.2346 132.153L39.3113 131.207L17.0249 130.026L11.4214 128.844L6.2 121.873L6.7094 118.447L11.4214 115.257L18.171 115.847L33.0711 116.911L55.485 118.447L71.6586 119.392L95.728 121.873H99.5485L100.058 120.337L98.7844 119.392L97.7656 118.447L74.5877 102.732L49.4995 86.1905L36.3823 76.62L29.3779 71.7757L25.8121 67.2858L24.2839 57.3608L30.6515 50.2716L39.3113 50.8623L41.4763 51.4531L50.2636 58.1879L68.9842 72.7209L93.4357 90.6804L97.0015 93.6343L98.4374 92.6652L98.6571 91.9801L97.0015 89.2625L83.757 65.2772L69.621 40.8192L63.2534 30.6579L61.5978 24.632C60.9565 22.1032 60.579 20.0111 60.579 17.4246L67.8381 7.49965L71.9133 6.19995L81.7193 7.49965L85.7946 11.0443L91.9074 24.9865L101.714 46.8451L116.996 76.62L121.453 85.4816L123.873 93.6343L124.764 96.1155H126.292V94.6976L127.566 77.9197L129.858 57.3608L132.15 30.8942L132.915 23.4505L136.608 14.4708L143.994 9.62643L149.725 12.344L154.437 19.0788L153.8 23.4505L150.998 41.6463L145.522 70.1215L141.957 89.2625H143.994L146.414 86.7813L156.093 74.0206L172.266 53.698L179.398 45.6635L187.803 36.802L193.152 32.5484H203.34L210.726 43.6549L207.415 55.1159L196.972 68.3492L188.312 79.5739L175.896 96.2095L168.191 109.585L168.882 110.689L170.738 110.53L198.755 104.504L213.91 101.787L231.994 98.7149L240.144 102.496L241.036 106.395L237.852 114.311L218.495 119.037L195.826 123.645L162.07 131.592L161.696 131.893L162.137 132.547L177.36 133.925L183.855 134.279H199.774L229.447 136.524L237.215 141.605L241.8 147.867L241.036 152.711L229.065 158.737L213.019 154.956L175.45 145.977L162.587 142.787H160.805V143.85L171.502 154.366L191.242 172.089L215.82 195.011L217.094 200.682L213.91 205.172L210.599 204.699L188.949 188.394L180.544 181.069L161.696 165.118H160.422V166.772L164.752 173.152L187.803 207.771L188.949 218.405L187.294 221.832L181.308 223.959L174.813 222.777L161.187 203.754L147.305 182.486L136.098 163.345L134.745 164.2L128.075 235.42L125.019 239.082L117.887 241.8L111.902 237.31L108.718 229.984L111.902 215.452L115.722 196.547L118.779 181.541L121.58 162.873L123.291 156.636L123.14 156.219L121.773 156.449L107.699 175.752L86.304 204.699L69.3663 222.777L65.291 224.431L58.2867 220.768L58.9235 214.27L62.8713 208.48L86.304 178.705L100.44 160.155L109.551 149.507L109.462 147.967L108.959 147.924L46.6977 188.512L35.6182 189.93L30.7788 185.44L31.4156 178.115L33.7079 175.752L52.4285 162.873Z"/></svg>';

  var CHEVRON_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  var SPARKLE_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>';

  function injectStyles() {
    if (document.getElementById("ai-chat-styles")) return;
    var style = document.createElement("style");
    style.id = "ai-chat-styles";
    style.textContent = [
      "#ai-chat-dropdown-wrapper {",
      "  position: relative;",
      "  display: inline-flex;",
      "  align-items: center;",
      "  z-index: 1000;",
      "  margin-right: 10px;",
      "}",

      "#ai-chat-trigger {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  gap: 7px;",
      "  padding: 8px 16px;",
      "  border-radius: 8px;",
      "  font-size: 14px;",
      "  font-weight: 600;",
      "  color: #fff;",
      "  background: linear-gradient(135deg, #6366f1, #8b5cf6);",
      "  border: none;",
      "  cursor: pointer;",
      "  white-space: nowrap;",
      "  box-shadow: 0 2px 8px rgba(99,102,241,0.4);",
      "  transition: box-shadow 0.2s, transform 0.15s;",
      "  letter-spacing: 0.01em;",
      "}",

      "#ai-chat-trigger:hover {",
      "  box-shadow: 0 4px 14px rgba(99,102,241,0.55);",
      "  transform: translateY(-1px);",
      "}",

      "#ai-chat-trigger .chevron {",
      "  transition: transform 0.2s;",
      "  opacity: 0.85;",
      "}",

      "#ai-chat-trigger.open .chevron {",
      "  transform: rotate(180deg);",
      "}",

      "#ai-chat-menu {",
      "  display: none;",
      "  position: absolute;",
      "  top: calc(100% + 8px);",
      "  right: 0;",
      "  min-width: 200px;",
      "  background: #fff;",
      "  border: 1px solid #e5e7eb;",
      "  border-radius: 10px;",
      "  box-shadow: 0 8px 30px rgba(0,0,0,0.12);",
      "  overflow: hidden;",
      "  animation: ai-menu-in 0.15s ease;",
      "}",

      "@keyframes ai-menu-in {",
      "  from { opacity: 0; transform: translateY(-6px); }",
      "  to   { opacity: 1; transform: translateY(0); }",
      "}",

      "#ai-chat-menu.open { display: block; }",

      ".ai-menu-header {",
      "  padding: 10px 14px 8px;",
      "  font-size: 11px;",
      "  font-weight: 600;",
      "  text-transform: uppercase;",
      "  letter-spacing: 0.08em;",
      "  color: #9ca3af;",
      "  border-bottom: 1px solid #f3f4f6;",
      "}",

      ".ai-menu-item {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 12px;",
      "  padding: 12px 14px;",
      "  font-size: 14px;",
      "  font-weight: 500;",
      "  color: #111827;",
      "  text-decoration: none;",
      "  cursor: pointer;",
      "  transition: background 0.15s;",
      "}",

      ".ai-menu-item:hover { background: #f9fafb; }",

      ".ai-menu-item + .ai-menu-item { border-top: 1px solid #f3f4f6; }",

      ".ai-menu-icon {",
      "  width: 34px;",
      "  height: 34px;",
      "  border-radius: 8px;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  flex-shrink: 0;",
      "}",

      ".ai-menu-icon.gpt { background: #10a37f; color: #fff; }",
      ".ai-menu-icon.claude { background: #d97757; color: #fff; }",

      ".ai-menu-item-text { display: flex; flex-direction: column; gap: 2px; }",
      ".ai-menu-item-label { font-size: 14px; font-weight: 600; color: #111827; }",
      ".ai-menu-item-sub { font-size: 12px; color: #9ca3af; font-weight: 400; }",

      "#ai-chat-fab {",
      "  display: none;",
      "  position: fixed;",
      "  bottom: 20px;",
      "  right: 20px;",
      "  z-index: 9999;",
      "  width: 48px;",
      "  height: 48px;",
      "  border-radius: 50%;",
      "  background: linear-gradient(135deg, #6366f1, #8b5cf6);",
      "  color: #fff;",
      "  border: none;",
      "  cursor: pointer;",
      "  box-shadow: 0 4px 14px rgba(99,102,241,0.5);",
      "  align-items: center;",
      "  justify-content: center;",
      "  transition: transform 0.15s, box-shadow 0.2s;",
      "}",
      "#ai-chat-fab:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(99,102,241,0.6); }",
      "#ai-chat-fab.open { transform: rotate(45deg); }",

      "#ai-chat-fab-menu {",
      "  display: none;",
      "  position: fixed;",
      "  bottom: 78px;",
      "  right: 20px;",
      "  z-index: 9998;",
      "  min-width: 200px;",
      "  background: #fff;",
      "  border: 1px solid #e5e7eb;",
      "  border-radius: 10px;",
      "  box-shadow: 0 8px 30px rgba(0,0,0,0.15);",
      "  overflow: hidden;",
      "  animation: ai-menu-in 0.15s ease;",
      "}",
      "#ai-chat-fab-menu.open { display: block; }",

      "@media (max-width: 1023px) {",
      "  #ai-chat-dropdown-wrapper { display: none !important; }",
      "  #ai-chat-fab { display: flex; }",
      "}",
    ].join("\n");
    document.head.appendChild(style);
  }

  function injectDropdown() {
    if (document.getElementById("ai-chat-dropdown-wrapper")) return;

    var wrapper = document.createElement("div");
    wrapper.id = "ai-chat-dropdown-wrapper";

    var trigger = document.createElement("button");
    trigger.id = "ai-chat-trigger";
    trigger.innerHTML =
      SPARKLE_ICON +
      '<span>Ask AI</span>' +
      '<span class="chevron">' + CHEVRON_ICON + '</span>';

    var menu = document.createElement("div");
    menu.id = "ai-chat-menu";
    menu.innerHTML =
      '<div class="ai-menu-header">Ask about this page</div>' +
      '<a class="ai-menu-item" id="ai-gpt-item" target="_blank" rel="noopener noreferrer">' +
        '<div class="ai-menu-icon gpt">' + CHATGPT_ICON + '</div>' +
        '<div class="ai-menu-item-text">' +
          '<span class="ai-menu-item-label">ChatGPT</span>' +
          '<span class="ai-menu-item-sub">Open in ChatGPT</span>' +
        '</div>' +
      '</a>' +
      '<a class="ai-menu-item" id="ai-claude-item" target="_blank" rel="noopener noreferrer">' +
        '<div class="ai-menu-icon claude">' + CLAUDE_ICON + '</div>' +
        '<div class="ai-menu-item-text">' +
          '<span class="ai-menu-item-label">Claude</span>' +
          '<span class="ai-menu-item-sub">Open in Claude</span>' +
        '</div>' +
      '</a>';

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle("open");
      trigger.classList.toggle("open", isOpen);
    });

    menu.querySelector("#ai-gpt-item").addEventListener("click", function (e) {
      e.preventDefault();
      window.open(buildChatGPTUrl(), "_blank");
      menu.classList.remove("open");
      trigger.classList.remove("open");
    });

    menu.querySelector("#ai-claude-item").addEventListener("click", function (e) {
      e.preventDefault();
      window.open(buildClaudeUrl(), "_blank");
      menu.classList.remove("open");
      trigger.classList.remove("open");
    });

    document.addEventListener("click", function () {
      menu.classList.remove("open");
      trigger.classList.remove("open");
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);

    var selectors = [
      "nav .flex.items-center",
      "header nav",
      '[class*="navbar"]',
      "nav",
    ];

    var target = null;
    for (var i = 0; i < selectors.length; i++) {
      target = document.querySelector(selectors[i]);
      if (target) break;
    }

    if (target) {
      target.insertBefore(wrapper, target.firstChild);
    } else {
      wrapper.style.position = "fixed";
      wrapper.style.top = "12px";
      wrapper.style.right = "12px";
      wrapper.style.zIndex = "9999";
      document.body.appendChild(wrapper);
    }
  }

  function injectFab() {
    if (document.getElementById("ai-chat-fab")) return;

    var fab = document.createElement("button");
    fab.id = "ai-chat-fab";
    fab.innerHTML = SPARKLE_ICON;
    fab.setAttribute("aria-label", "Ask AI");

    var menu = document.createElement("div");
    menu.id = "ai-chat-fab-menu";
    menu.innerHTML =
      '<div class="ai-menu-header">Ask about this page</div>' +
      '<a class="ai-menu-item" id="ai-fab-gpt-item">' +
        '<div class="ai-menu-icon gpt">' + CHATGPT_ICON + '</div>' +
        '<div class="ai-menu-item-text">' +
          '<span class="ai-menu-item-label">ChatGPT</span>' +
          '<span class="ai-menu-item-sub">Open in ChatGPT</span>' +
        '</div>' +
      '</a>' +
      '<a class="ai-menu-item" id="ai-fab-claude-item">' +
        '<div class="ai-menu-icon claude">' + CLAUDE_ICON + '</div>' +
        '<div class="ai-menu-item-text">' +
          '<span class="ai-menu-item-label">Claude</span>' +
          '<span class="ai-menu-item-sub">Open in Claude</span>' +
        '</div>' +
      '</a>';

    fab.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle("open");
      fab.classList.toggle("open", isOpen);
    });

    menu.querySelector("#ai-fab-gpt-item").addEventListener("click", function (e) {
      e.preventDefault();
      window.open(buildChatGPTUrl(), "_blank");
      menu.classList.remove("open");
      fab.classList.remove("open");
    });

    menu.querySelector("#ai-fab-claude-item").addEventListener("click", function (e) {
      e.preventDefault();
      window.open(buildClaudeUrl(), "_blank");
      menu.classList.remove("open");
      fab.classList.remove("open");
    });

    document.addEventListener("click", function () {
      menu.classList.remove("open");
      fab.classList.remove("open");
    });

    document.body.appendChild(fab);
    document.body.appendChild(menu);
  }

  function init() {
    injectStyles();
    injectDropdown();
    injectFab();

    var lastUrl = location.href;
    new MutationObserver(function () {
      var currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        var existing = document.getElementById("ai-chat-dropdown-wrapper");
        if (existing) existing.remove();
        setTimeout(function () {
          injectStyles();
          injectDropdown();
        }, 300);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
