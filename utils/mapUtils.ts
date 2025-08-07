// Utility functions for map overlays and labels

export function createLengthLabel(len: number): HTMLElement {
  const el = document.createElement('div');
  el.className = 'lot-length-label';
  el.style.background = 'transparent';
  el.style.color = '#fff';
  el.style.fontWeight = '900';
  el.style.fontSize = '15px';
  el.style.textShadow = '0 1px 6px rgba(60,60,90,0.25), 0 0px 2px #7c3aed';
  el.style.letterSpacing = '0.5px';
  el.style.display = 'inline-block';
  el.style.transform = 'translateY(-10px)';
  el.innerText = `${Math.round(len)}m`;
  return el;
}
