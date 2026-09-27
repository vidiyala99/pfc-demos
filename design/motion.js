// Turns on the scroll motion in pfc.css (html.pfc-motion) and tilts the Donate ticket toward the pointer.
// Loaded on the public site only, so editors (WordPress, Decap previews) stay still.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("pfc-motion");
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let active = null;
  const reset = (t) => {
    t.removeAttribute("data-tilt");
    t.style.removeProperty("--rx");
    t.style.removeProperty("--ry");
  };
  document.addEventListener("pointermove", (e) => {
    const t = e.target instanceof Element ? e.target.closest(".ticket") : null;
    if (active && active !== t) reset(active);
    active = t;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    t.setAttribute("data-tilt", "");
    t.style.setProperty("--ry", `${((x - 0.5) * 18).toFixed(2)}deg`);
    t.style.setProperty("--rx", `${((0.5 - y) * 22).toFixed(2)}deg`);
    t.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    t.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  }, { passive: true });
  document.addEventListener("pointerleave", () => active && (reset(active), active = null));
})();
