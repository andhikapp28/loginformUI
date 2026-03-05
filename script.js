(() => {
  const TARGET_USERNAME = "andhikap28";
  const TARGET_PASSWORD = "dipa28";

  const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-!$%^&*+=~";
  const ENEMY_SYMBOLS = ["💣", "☠", "🧨", "👾", "😈", "☣", "🕷", "👹"];
  const CHAR_COUNT = 58;

  const arena = document.getElementById("arena");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const passwordDisplay = document.getElementById("passwordDisplay");
  const usernameField = document.getElementById("usernameField");
  const passwordField = document.getElementById("passwordField");
  const backspaceBtn = document.getElementById("backspaceBtn");
  const clearBtn = document.getElementById("clearBtn");
  const loginBtn = document.getElementById("loginBtn");
  const statusText = document.getElementById("statusText");
  const resultModal = document.getElementById("resultModal");
  const modalMessage = document.getElementById("modalMessage");
  const closeModalBtn = document.getElementById("closeModalBtn");

  const state = {
    activeField: "username",
    username: "",
    password: "",
    chars: [],
    bounds: { w: window.innerWidth, h: window.innerHeight },
    flyingLogin: false,
    loginPos: { x: window.innerWidth * 0.6, y: window.innerHeight * 0.5 },
    loginVel: { x: 1.8, y: -1.35 },
    aimTimerId: null,
    aimWarned: false,
    panelControlsRow: loginBtn.parentElement
  };

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function chance(percent) {
    return Math.random() * 100 < percent;
  }

  function showModal(message) {
    modalMessage.textContent = message;
    resultModal.classList.add("show");
    resultModal.setAttribute("aria-hidden", "false");
  }

  function hideModal() {
    resultModal.classList.remove("show");
    resultModal.setAttribute("aria-hidden", "true");
  }

  function startAimTimer() {
    clearTimeout(state.aimTimerId);
    state.aimWarned = false;
    state.aimTimerId = setTimeout(() => {
      if (state.flyingLogin) {
        state.aimWarned = true;
        showModal("AIM lu ampas, tombol login aja nggak kena WAOKWAO");
        statusText.className = "status err";
        statusText.textContent = "klik tombol loginnya kocaaakkk";
      }
    }, 5000);
  }

  function stopAimTimer() {
    clearTimeout(state.aimTimerId);
    state.aimTimerId = null;
    state.aimWarned = false;
  }

  function makeCharSpec() {
    const isEnemy = chance(15);
    const value = isEnemy
      ? ENEMY_SYMBOLS[Math.floor(Math.random() * ENEMY_SYMBOLS.length)]
      : CHARSET[Math.floor(Math.random() * CHARSET.length)];

    const speed = random(0.35, 1.9) * (chance(16) ? 2.3 : 1);
    const angle = random(0, Math.PI * 2);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const side = Math.floor(random(0, 4));
    let x = 0;
    let y = 0;

    if (side === 0) {
      x = random(0, state.bounds.w);
      y = -20;
    } else if (side === 1) {
      x = state.bounds.w + 20;
      y = random(0, state.bounds.h);
    } else if (side === 2) {
      x = random(0, state.bounds.w);
      y = state.bounds.h + 20;
    } else {
      x = -20;
      y = random(0, state.bounds.h);
    }

    return {
      value,
      isEnemy,
      x,
      y,
      vx,
      vy,
      size: random(18, 46),
      hue: random(130, 360)
    };
  }

  function setLoginNormal() {
    if (!state.panelControlsRow.contains(loginBtn)) {
      state.panelControlsRow.appendChild(loginBtn);
    }
    loginBtn.classList.remove("is-flying");
    loginBtn.style.left = "";
    loginBtn.style.top = "";
    loginBtn.style.opacity = "1";
    loginBtn.textContent = "Login";
    state.flyingLogin = false;
    stopAimTimer();
  }

  function setLoginFlying() {
    if (state.flyingLogin) {
      return;
    }

    document.body.appendChild(loginBtn);
    loginBtn.classList.add("is-flying");
    loginBtn.textContent = "LOGIN!";
    state.flyingLogin = true;

    state.loginPos.x = random(120, Math.max(120, state.bounds.w - 120));
    state.loginPos.y = random(160, Math.max(160, state.bounds.h - 120));
    state.loginVel.x = random(-2.4, 2.4) || 1.8;
    state.loginVel.y = random(-2.1, 2.1) || -1.4;

    statusText.className = "status";
    statusText.textContent = "WHOOSSHH TOMBOL LOGINNYA TERBANG JUGA AWOKWOAK";
    startAimTimer();
  }

  function syncLoginMode() {
    if (state.password.length > 5) {
      setLoginFlying();
      return;
    }

    setLoginNormal();
    const ready = state.username.length >= 1 && state.password.length >= 1;
    loginBtn.disabled = !ready;
  }

  function updateDisplays() {
    usernameDisplay.textContent = state.username;
    passwordDisplay.textContent = "•".repeat(state.password.length);
    syncLoginMode();
  }

  function setActiveField(field) {
    state.activeField = field;
    usernameField.classList.toggle("is-active", field === "username");
    passwordField.classList.toggle("is-active", field === "password");
  }

  function addToActive(value) {
    if (state.activeField === "username") {
      state.username += value;
    } else {
      state.password += value;
    }
    updateDisplays();
  }

  function backspaceActive() {
    if (state.activeField === "username") {
      state.username = state.username.slice(0, -1);
    } else {
      state.password = state.password.slice(0, -1);
    }
    updateDisplays();
  }

  function clearAll() {
    state.username = "";
    state.password = "";
    statusText.className = "status";
    statusText.textContent = "RESET ULANG, CUPU!.";
    updateDisplays();
  }

  function shootFlash(x, y) {
    const dot = document.createElement("div");
    dot.className = "shot-flash";
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 230);
  }

  function onCharShot(charObj, ev) {
    ev.preventDefault();
    ev.stopPropagation();
    shootFlash(ev.clientX, ev.clientY);

    if (charObj.isEnemy) {
      backspaceActive();
      statusText.className = "status err";
      statusText.textContent = "Tembak karakter njirr, jangan yang lain";
      return;
    }

    addToActive(charObj.value);
    statusText.className = "status";
    statusText.textContent = `Tertembak: ${charObj.value} -> ${state.activeField}`;
  }

  function spawnChar() {
    const spec = makeCharSpec();
    const el = document.createElement("span");
    el.className = `char${spec.isEnemy ? " enemy" : ""}`;
    el.textContent = spec.value;
    el.style.fontSize = `${spec.size}px`;
    if (!spec.isEnemy) {
      el.style.color = `hsl(${spec.hue} 100% 78%)`;
    }

    arena.appendChild(el);

    const obj = {
      ...spec,
      el
    };

    el.addEventListener("click", (ev) => onCharShot(obj, ev));

    state.chars.push(obj);
  }

  function recycleIfOutside(charObj) {
    const margin = 40;
    if (
      charObj.x < -margin ||
      charObj.y < -margin ||
      charObj.x > state.bounds.w + margin ||
      charObj.y > state.bounds.h + margin
    ) {
      const fresh = makeCharSpec();
      charObj.value = fresh.value;
      charObj.isEnemy = fresh.isEnemy;
      charObj.x = fresh.x;
      charObj.y = fresh.y;
      charObj.vx = fresh.vx;
      charObj.vy = fresh.vy;
      charObj.size = fresh.size;
      charObj.hue = fresh.hue;
      charObj.el.textContent = fresh.value;
      charObj.el.className = `char${fresh.isEnemy ? " enemy" : ""}`;
      charObj.el.style.fontSize = `${fresh.size}px`;
      charObj.el.style.color = fresh.isEnemy ? "" : `hsl(${fresh.hue} 100% 78%)`;
    }
  }

  function animateFlyingLogin() {
    if (!state.flyingLogin) {
      return;
    }

    state.loginPos.x += state.loginVel.x;
    state.loginPos.y += state.loginVel.y;

    const minX = 60;
    const maxX = state.bounds.w - 60;
    const minY = 90;
    const maxY = state.bounds.h - 30;

    if (state.loginPos.x <= minX || state.loginPos.x >= maxX) {
      state.loginVel.x *= -1;
    }
    if (state.loginPos.y <= minY || state.loginPos.y >= maxY) {
      state.loginVel.y *= -1;
    }

    loginBtn.style.left = `${state.loginPos.x}px`;
    loginBtn.style.top = `${state.loginPos.y}px`;
  }

  function tryLogin() {
    const usernameMatch = state.username.toLowerCase() === TARGET_USERNAME.toLowerCase();
    const passwordMatch = state.password.toLowerCase() === TARGET_PASSWORD.toLowerCase();
    if (usernameMatch && passwordMatch) {
      statusText.className = "status ok";
      statusText.textContent = "LOGIN BERHASIL!";
      stopAimTimer();
      showModal("Login berhasil. Keren kayak TenZ...");
      return;
    }

    const errors = [
      "Salah! Coba lagi.",
      "SALAH WOI!?",
      "Padahal Ez gini lohhh"
    ];

    statusText.className = "status err";
    statusText.textContent = errors[Math.floor(Math.random() * errors.length)];
  }

  usernameField.addEventListener("click", () => setActiveField("username"));
  passwordField.addEventListener("click", () => setActiveField("password"));

  backspaceBtn.addEventListener("click", () => {
    backspaceActive();
    statusText.className = "status";
    statusText.textContent = "Hapus 1 karakter.";
  });

  clearBtn.addEventListener("click", clearAll);

  loginBtn.addEventListener("click", (ev) => {
    shootFlash(ev.clientX, ev.clientY);
    tryLogin();
  });

  loginBtn.addEventListener("mouseenter", () => {
    if (!state.flyingLogin) {
      return;
    }
    state.loginVel.x += random(-0.7, 0.7);
    state.loginVel.y += random(-0.7, 0.7);
  });

  closeModalBtn.addEventListener("click", hideModal);
  resultModal.addEventListener("click", (ev) => {
    if (ev.target === resultModal) {
      hideModal();
    }
  });

  document.body.addEventListener("click", (ev) => {
    if (ev.target.closest(".char") || ev.target.closest("button") || ev.target.closest(".modal-card")) {
      return;
    }
    shootFlash(ev.clientX, ev.clientY);
  });

  window.addEventListener("resize", () => {
    state.bounds.w = window.innerWidth;
    state.bounds.h = window.innerHeight;
  });

  for (let i = 0; i < CHAR_COUNT; i += 1) {
    spawnChar();
  }

  function animate() {
    for (const ch of state.chars) {
      ch.x += ch.vx;
      ch.y += ch.vy;
      ch.el.style.left = `${ch.x}px`;
      ch.el.style.top = `${ch.y}px`;
      recycleIfOutside(ch);
    }

    animateFlyingLogin();
    requestAnimationFrame(animate);
  }

  setActiveField("username");
  updateDisplays();
  animate();
})();
