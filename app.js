/* ===================
   FOR THREE STORE - TIENDA CON BOT CONECTADO
   =================== */
const TU_NUMERO_WSP = '51936994155'; // <-- PON TU NUMERO SIN +51
const REDIR_WSP = `https://wa.me/${TU_NUMERO_WSP}`;

const state = {
  tab: 'todos',
  query: '',
  cart: [],
  theme: localStorage.getItem('f3_theme') || 'light',
  descuentoAplicado: { code: null, percent: 0 },
  metodoPago: 'Yape',
  productoSeleccionado: null
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const THEME = {
  light: { bg:'#f5f5f5', card:'#fff', text:'#1a1a1a', muted:'#666', border:'#e0e0e0', red:'#e60000', header:'#e60000' },
  dark:  { bg:'#0f0f0f', card:'#1a1a1a', text:'#f5f5f5', muted:'#b3b3b3', border:'#2a2a2a', red:'#ff2a2a', header:'#0a0a0a' }
};

const PRODUCTOS = [
  { id:1, cat:'bot', tag:'BOT', marca:'For Three', nom:'Bot VIP 30 días', precio:15, img:'https://i.ibb.co/3y0p0sP/bot-vip.jpg', desc:['Acceso VIP completo','Sin límites de uso','Soporte 24/7'] },
  { id:2, cat:'bot', tag:'BOT', marca:'For Three', nom:'Bot Premium 7 días', precio:5, img:'https://i.ibb.co/3y0p0sP/bot-vip.jpg', desc:['Acceso Premium','Uso ilimitado','Soporte rápido'] },
  { id:3, cat:'serv', tag:'SERV', marca:'For Three', nom:'Activación Yape', precio:3, img:'https://i.ibb.co/3y0p0sP/bot-vip.jpg', desc:['Activación inmediata','100% seguro'] }
];

const CUPONES = { 
  F3DIEZ: 10,
  F3CINCO: 5 
};

const CUENTAS = {
  yape: { nom:'Yape', num:'936994155', titular:'Benja Store' },
  bank: { nom:'BCP', cci:'00219100234567890123', titular:'Benja Store' },
  prex: { nom:'Prex', num:'948572136', titular:'Benja Store' },
  paypal: { nom:'PayPal', link:'https://paypal.me/BenjaStore' }
};

function init(){
  aplicarTheme();
  bind();
  render();
  mostrar('inicio');
}

function aplicarTheme(){
  document.body.classList.toggle('dark', state.theme==='dark');
  const root = document.documentElement;
  const t = THEME[state.theme];
  Object.entries(t).forEach(([k,v])=>root.style.setProperty(`--${k}`,v));
}

function bind(){
  $('#btnTheme').onclick = ()=>{ 
    state.theme = state.theme==='light'?'dark':'light'; 
    localStorage.setItem('f3_theme', state.theme); 
    aplicarTheme(); 
  };
  $('#btnIrTienda').onclick = ()=>mostrar('tienda');
  $('#logo').onclick = ()=>mostrar('tienda');
  $('#search').oninput = e=>{ state.query=e.target.value; render(); };
  $$('.subnav button').forEach(b=>b.onclick=()=>{ 
    $$('.subnav button').forEach(x=>x.classList.remove('active')); 
    b.classList.add('active'); 
    state.tab=b.dataset.tab; 
    render(); 
  });
  $('#aplicarCupon').onclick = aplicarCupon;
  $$('.payment-tab').forEach(b=>b.onclick=()=>cambiarTab(b.dataset.tab));
}

function mostrar(pantalla){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $(`#${pantalla}`).classList.add('active');
  window.scrollTo(0,0);
}

function render(){
  const grid = $('#grid');
  let lista = PRODUCTOS.filter(p=>{
    if(state.tab!=='todos' && p.cat!==state.tab) return false;
    if(state.query && !p.nom.toLowerCase().includes(state.query.toLowerCase())) return false;
    return true;
  });
  
  grid.innerHTML = lista.map(p=>`
    <div class="card" onclick="verProducto(${p.id})">
      <img src="${p.img}" loading="lazy" alt="${p.nom}">
      <div class="card-body">
        <div class="tag">${p.tag}</div>
        <div class="marca">${p.marca}</div>
        <b>${p.nom}</b>
        <div class="precio">S/ ${p.precio.toFixed(2)}</div>
        <button class="btn" onclick="event.stopPropagation(); comprar(${p.id})">Comprar</button>
      </div>
    </div>
  `).join('') || '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px">No hay productos</p>';
}

function verProducto(id){
  const p = PRODUCTOS.find(x=>x.id===id);
  if(!p) return;
  state.productoSeleccionado = p;
  $('#pImg').src = p.img;
  $('#pNom').textContent = p.nom;
  $('#pPrecio').textContent = `S/ ${p.precio.toFixed(2)}`;
  $('#pDesc').innerHTML = p.desc.map(d=>`<li>${d}</li>`).join('');
  mostrar('producto');
}

function comprar(id){
  const p = PRODUCTOS.find(x=>x.id===id);
  if(!p) return;
  state.productoSeleccionado = p;
  abrirPago();
}

function abrirPago(){
  const p = state.productoSeleccionado;
  if(!p) return;
  
  $('#payImg').src = p.img;
  $('#payNom').textContent = p.nom;
  $('#payPrecio').textContent = `S/ ${p.precio.toFixed(2)}`;
  $('#payTotal').textContent = `S/ ${p.precio.toFixed(2)}`;
  
  state.descuentoAplicado = { code: null, percent: 0 };
  $('#cuponInput').value = '';
  $('#cuponAplicado').style.display = 'none';
  $('#cuponBox').style.display = 'block';
  
  cambiarTab('yape');
  $('#modalPago').classList.add('active');
}

function cerrarPago(){
  $('#modalPago').classList.remove('active');
}

function aplicarCupon(){
  const code = $('#cuponInput').value.trim().toUpperCase();
  if(!CUPONES[code]) return showToast('Cupón inválido', true);
  
  const percent = CUPONES[code];
  state.descuentoAplicado = { code, percent };
  
  const precioFinal = getPrecioFinal();
  $('#payTotal').textContent = `S/ ${precioFinal.toFixed(2)}`;
  $('#cuponDesc').textContent = `${percent}% OFF`;
  $('#cuponBox').style.display = 'none';
  $('#cuponAplicado').style.display = 'flex';
  
  showToast(`Cupón ${code} aplicado -${percent}%`);
}

function quitarCupon(){
  state.descuentoAplicado = { code: null, percent: 0 };
  $('#payTotal').textContent = `S/ ${state.productoSeleccionado.precio.toFixed(2)}`;
  $('#cuponBox').style.display = 'block';
  $('#cuponAplicado').style.display = 'none';
}

function getPrecioFinal(){
  const p = state.productoSeleccionado.precio;
  const d = state.descuentoAplicado.percent;
  return d ? p * (1 - d/100) : p;
}

function cambiarTab(tab){
  state.metodoPago = tab;
  $$('.payment-tab').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  $$('.payment-content').forEach(c=>c.classList.toggle('active', c.dataset.tab===tab));
  
  const precio = getPrecioFinal();
  $('#yapeMonto').textContent = `S/ ${precio.toFixed(2)}`;
  $('#bankMonto').textContent = `S/ ${precio.toFixed(2)}`;
  $('#prexMonto').textContent = `S/ ${precio.toFixed(2)}`;
  $('#paypalMonto').textContent = `S/ ${precio.toFixed(2)}`;
}

function copiar(txt){
  navigator.clipboard.writeText(txt);
  showToast('Copiado ✅');
}

/* ===== CONEXIÓN CON BOT - ESTO MANDA EL JSON ===== */
async function guardarVenta(){
  if(!state.productoSeleccionado) return showToast('Error', true);

  const precioFinal = getPrecioFinal();
  const venta = {
    id: 'F3-' + Date.now(),
    producto: state.productoSeleccionado.nom,
    precio_soles: precioFinal,
    metodo: state.metodoPago,
    cupon: state.descuentoAplicado.code || 'Ninguno',
    fecha: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' }),
    estado: 'PENDIENTE'
  };

  const msgCliente = `Hola For Three Store! 👋\n\nYa pagué S/ ${precioFinal.toFixed(2)} por:\n*${venta.producto}*\nMetodo: ${venta.metodo}\nID: ${venta.id}\n\nAdjunto mi comprobante 📸`;

  const msgBot = `🚨 *NUEVA VENTA PENDIENTE* 🚨\n\n` +
                 `*ID:* ${venta.id}\n` +
                 `*Producto:* ${venta.producto}\n` +
                 `*Monto:* S/ ${venta.precio_soles.toFixed(2)}\n` +
                 `*Método:* ${venta.metodo}\n` +
                 `*Cupón:* ${venta.cupon}\n` +
                 `*Fecha:* ${venta.fecha}\n\n` +
                 `*COPIA ESTO Y ENVIALO AL BOT:*\n` +
                 '```json\n' + JSON.stringify(venta, null, 2) + '\n```';

  // 1. Te abre WSP con el JSON para ti
  window.open(`${REDIR_WSP}?text=${encodeURIComponent(msgBot)}`, '_blank');

  // 2. Espera 1 seg y abre con el cliente
  setTimeout(() => {
    window.open(`${REDIR_WSP}?text=${encodeURIComponent(msgCliente)}`, '_blank');
  }, 1000);

  cerrarPago();
  showToast('Pedido enviado al Bot ✅');
}

function showToast(msg, error=false){
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show' + (error?' error':'');
  setTimeout(()=>t.classList.remove('show'), 3000);
}

window.verProducto = verProducto;
window.comprar = comprar;
window.abrirPago = abrirPago;
window.cerrarPago = cerrarPago;
window.aplicarCupon = aplicarCupon;
window.quitarCupon = quitarCupon;
window.copiar = copiar;
window.guardarVenta = guardarVenta;

init();