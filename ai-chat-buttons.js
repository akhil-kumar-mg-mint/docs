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

  var CLAUDE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.304 1.273C14.902.513 12.31.048 9.657 0c-.43 0-.858.016-1.284.05C5.172.274 2.65 1.564 1.14 3.673c-1.51 2.11-1.888 4.86-1.03 7.356l.004.013 3.255 9.803a4.08 4.08 0 0 0 3.898 2.882h.018a4.09 4.09 0 0 0 3.882-2.77l.5-1.473 3.174 1.052a4.08 4.08 0 0 0 5.195-2.584l2.826-8.504a4.094 4.094 0 0 0-5.558-5.175zm-5.532 17.694a2.39 2.39 0 0 1-2.27 1.621h-.011a2.385 2.385 0 0 1-2.28-1.686L4.54 12.28l6.255 2.073-.523 1.542-.5 1.472v.6zm8.47-6.608-2.826 8.504a2.38 2.38 0 0 1-3.034 1.51l-3.173-1.052.86-2.538L14.94 12l-7.866-2.607-.744-2.24a2.383 2.383 0 0 1 .226-1.892 2.37 2.37 0 0 1 1.573-1.106 7.89 7.89 0 0 1 1.528-.15c2.406.04 4.777.464 7.043 1.26a2.394 2.394 0 0 1 1.542 3.094z"/></svg>';

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

  function init() {
    injectStyles();
    injectDropdown();

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
