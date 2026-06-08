/* ===== Lucide Icon wrapper ===== */
function Icon({ name, size=22, stroke=2, className='', style={}, color }){
  const lib = (window.lucide && window.lucide.icons) || {};
  let node = lib[name];
  if(!node && name){ // fallback to kebab lookup
    const kebab = name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();
    node = lib[kebab];
  }
  // lucide node shape: ["svg", {attrs}, [ ["path",{...}], ... ] ]
  const children = node && Array.isArray(node) && Array.isArray(node[2]) ? node[2] : null;
  if(!children){
    return React.createElement('span',{className,style:{display:'inline-block',width:size,height:size,...style}});
  }
  return React.createElement('svg',{
    xmlns:'http://www.w3.org/2000/svg', width:size, height:size,
    viewBox:'0 0 24 24', fill:'none', stroke:color||'currentColor',
    strokeWidth:stroke, strokeLinecap:'round', strokeLinejoin:'round',
    className, style
  }, children.map((c,i)=>React.createElement(c[0],{key:i,...c[1]})));
}

/* Decorative sprig (leaf accent used through the app) */
function Sprig({ size=20, className='', style={} }){
  return React.createElement(Icon,{ name:'Sprout', size, className, style:{color:'var(--brand)',...style} });
}

window.Icon = Icon;
window.Sprig = Sprig;
