import "./style.scss";

const COMMON_CSS = `
.fab-wrap {
  margin: 25px;
  position: fixed;
  z-index: 999999;
  right: 0;
  bottom: 0; }
  .fab-wrap > button {
    margin-bottom: 0 !important; }
  .fab-wrap button {
    height: 52px;
    width: 52px;
    display: inline-block;
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.28);
    cursor: pointer;
    position: relative;
    line-height: 52px;
    text-align: center;
    transition: all ease 0.2s;
    margin-bottom: -10px; }
    .fab-wrap .fab-btn > svg {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: inline-block; }
    .fab-wrap .fab-btn .fab-children {
      visibility: hidden;
      position: absolute;
      bottom: 100%;
      animation: 0.5s out;
      padding-bottom: 20px;
      margin-bottom: -20px; }
    .fab-wrap .fab-btn:after {
      content: attr(data-fab-label);
      box-sizing: border-box;
      font-size: 14px;
      position: absolute;
      pointer-events: none;
      z-index: -1;
      transition: all ease 0.2s;
      opacity: 0;
      border-radius: 9px;
      padding: 0 50px 0 1em;
      text-align: left;
      right: 50%;
      line-height: 52px; }
    .fab-wrap .fab-btn:hover .fab-children {
      visibility: visible;
      animation: 0.5s in; }
    .fab-wrap .fab-btn:hover:after {
      opacity: 1; }

@keyframes in {
  0% {
    opacity: 0;
    transform: translate(0px, -25px); }
  100% {
    opacity: 1;
    transform: translate(0px, 0px); } }

@keyframes out {
  0% {
    opacity: 1;
    transform: translate(0px, 0px); }
  100% {
    opacity: 0;
    transform: translate(0px, -25px); } }
`;

const THEME = {
  bgColor: "#0083ca",
  hoverBgColor: "#4acc08",
  color: "white",
  labelBgColor: "rgba(239, 239, 239, 0.71)",
  labelColor: "#3a3a3a"
};

const getTheme = theme => {
  return `
#${theme.id} button {
  background: ${theme.bgColor};
  color: ${theme.color};
}
#${theme.id} buttonn:hover {
  background: ${theme.hoverBgColor};
}    
#${theme.id} svg {
  fill: ${theme.color};
} 
#${theme.id} button:after {
  background: ${theme.labelBgColor};
  color: ${theme.labelColor};
}
`;
};

const render = opts => {
  return `
    <div class="fab-wrap ${opts.className || ""}">
      ${renderBtn(opts)}
    </div>
  `;
};

const renderBtn = btn => {
  btn.id = btn.id || uid();
  const label = btn.label ? ` data-fab-label=${btn.label}` : "";
  return `
    <button id=${btn.id} ${label}>
      ${btn.html}
      ${btn.btns
        ? `
          <div class="fab-btns">
            ${btn.btns
              .reverse()
              .map(renderBtn)
              .join("")}
          </div>  
        `
        : ""}
    </button>  
  `;
};

const attachStyle = styles => {
  const s = document.createElement("style");
  s.innerHTML = styles;
  document.head.appendChild(s);
};

let _attached = false;
let _uid = 0;
const uid = () => "fab_" + _uid++;

const attachCallback = btn => {
  btn.fn &&
    document.getElementById(btn.id).addEventListener("click", e => {
      btn.fn();
      e.stopPropagation();
    });
  btn.btns && btn.btns.forEach(attachCallback);
};

export const init = (btn, theme) => {
  if (!_attached) {
    attachStyle(COMMON_CSS);
    _attached = true;
  }
  btn.id = uid();
  theme = Object.assign({}, THEME, theme);
  attachStyle(getTheme(btn.id, theme));
  const html = render(btn);
  document.body.insertAdjacentHTML("afterend", html);
  attachCallback(btn);

  const el = document.getElementById(btn.id).parentNode;
  return {
    hide: () => {
      el.style.display = "none";
    },
    show: () => {
      el.style.display = "block";
    }
  };
};