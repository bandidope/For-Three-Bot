/* ===================
   FOR THREE BOT - STORE V3 CON BOT CONECTADO
   =================== */
const TU_NUMERO_WSP = '51936994155'; // <-- CAMBIA TU NUMERO SIN + AQUI
const REDIR_WSP = `https://wa.me/${TU_NUMERO_WSP}`;

const state = {
  tab: 'todos',
  query: '',
  theme: localStorage.getItem('f3_theme') || 'dark',
  descuentoAplicado: { code: null, percent: 0 },
  metodoPago: 'yape', // <- yape, bank, prex, paypal
  productoSeleccionado: null
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const THEME = {
  light: { bg:'#f5f5f5', card:'#fff', text:'#1a1a1a', muted:'#666', border:'#e0e0e0', red:'#e60000', header:'#e60000' },
  dark: { bg:'#0a0a0a', card:'#1a1a1a', text:'#f5f5f5', muted:'#b3b3b3', border:'#2a2a2a', red:'#e60000', header:'#000' }
};

const PRODUCTOS = [
  { id:1, cat:'bot', tag:'BOT', marca:'For Three', nom:'Bot VIP 30 días', precio:15, img:'https://i.ibb.co/3y0p0sP/bot-vip.jpg', desc:['Acceso VIP completo','Sin límites de uso','Soporte 24/7'] },
  { id:2, cat:'bot', tag:'BOT', marca:'For Three', nom:'Bot Premium 7 días', precio:5, img:'https://i.ibb.co/3y0p0sP/bot-vip.jpg', desc:['Acceso Premium','Uso ilimitado','Soporte rápido'] },
  { id:3, cat:'serv', tag:'SERV', marca:'For Three', nom:'Activación Yape', precio:3, img:'https://i.ibb.co/3y0p0sP/bot-vip.jpg', desc:['Activación inmediata','100% seguro'] },
  { id:4, cat:'serv', tag:'SERV', marca:'For Three', nom:'Recarga BCP', precio:2, img:'https://i.ibb.co/3y0p0sP/bot-vip.jpg', desc:['Recarga inmediata','Sin comisión'] }
];

const CUPONES = { F3DIEZ: 10, F3CINCO: 5 };

const CUENTAS = {
  yape: { nom:'Yape', num:'936994155', titular:'For Three' },
  bank: { nom:'BCP', cci:'00219100234567890123', cuenta:'191-23456789-0-12', titular:'For Three' },
  prex: { nom:'Prex', num:'948572136', titular:'For Three' },
  paypal: { nom:'PayPal', link:'https://paypal.me/ForThree', usd: 0.28 }
};

function init(){ aplicarTheme(); bind(); renderSubnav(); resetFiltro(); mostrar('inicioScreen'); }

function aplicarTheme(){
  document.body.classList.toggle('dark', state.theme==='dark');
  const root = document.documentElement;
  const t = THEME[state.theme];
  Object.entries(t).forEach(([k,v])=>root.style.setProperty(`--${k}`,v));
  $('#themeBtn').textContent = state.theme==='dark'? '☀️' : '🌙';
}

function bind(){ $('#themeBtn').onclick = toggleDark; }

function toggleDark(){
  state.theme = state.theme==='light'?'dark':'light';
  localStorage.setItem('f3_theme', state.theme);
  aplicarTheme();
}

function renderSubnav(){
  $('#subnav').innerHTML = `
    <button data-tab="todos" class="active">TODOS</button>
    <button data-tab="bot">BOT</button>
    <button data-tab="serv">SERVICIOS</button>
  `;
  $$('.subnav button').forEach(b=>b.onclick=()=>{
    $$('.subnav button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    state.tab=b.dataset.tab;
    render();
  });
}

function resetFiltro(){
  state.tab = 'todos';
  $$('.subnav button').forEach(x=>x.classList.remove('active'));
  $('.subnav button[data-tab="todos"]').classList.add('active');
  render();
}

function show(pantalla){ mostrar(pantalla); }
function mostrar(pantalla){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  $(`#${pantalla}`).classList.add('active');
  window.scrollTo(0,0);
}

function render(){
  const grid = $('#productos');
  if(!grid) return;
  let lista = PRODUCTOS.filter(p=>{
    if(state.tab!=='todos' && p.cat!==state.tab) return false;
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
        <button class="btn" onclick="event.stopPropagation(); comprar(${p.id})">Contratar</button>
      </div>
    </div>
  `).join('') || '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px">No hay productos</p>';
}

function verProducto(id){
  const p = PRODUCTOS.find(x=>x.id===id);
  if(!p) return;
  state.productoSeleccionado = p;
  $('#pImg').src = p.img;
  $('#pMarca').textContent = p.marca;
  $('#pNom').textContent = p.nom;
  $('#pPrecio').textContent = `S/ ${p.precio.toFixed(2)}`;
  $('#pDesc').innerHTML = p.desc.map(d=>`<li>${d}</li>`).join('');
  $('#comprarBtn').onclick = ()=>abrirPago();
  mostrar('productoScreen');
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

  $('#serviceCard').innerHTML = `
    <img src="${p.img}">
    <div><b>${p.nom}</b><div class="precio">S/ ${p.precio.toFixed(2)}</div></div>
  `;

  $('#yapeNum').textContent = CUENTAS.yape.num;
  $('#yapeName').textContent = CUENTAS.yape.titular;
  $('#bcpCci').textContent = CUENTAS.bank.cci;
  $('#bcpCuenta').textContent = CUENTAS.bank.cuenta;
  $('#bcpNombre').textContent = CUENTAS.bank.titular;
  $('#prexNum').textContent = CUENTAS.prex.num;
  $('#prexName').textContent = CUENTAS.prex.titular;
  $('#paypalLink').href = CUENTAS.paypal.link;

  state.descuentoAplicado = { code: null, percent: 0 };
  $('#couponCode').value = '';
  $('#couponApplied').style.display = 'none';
  $('#couponInput').style.display = 'flex';

  selectPayment('yape');
  $('#pagoModal').classList.add('active');
  actualizarMontos();
}

function cerrarPago(){ $('#pagoModal').classList.remove('active'); }

function applyCoupon(){
  const code = $('#couponCode').value.trim().toUpperCase();
  if(!CUPONES[code]) return showToast('Cupón inválido', true);
  state.descuentoAplicado = { code, percent: CUPONES[code] };
  $('#couponText').textContent = `${code} -${CUPONES[code]}%`;
  $('#couponInput').style.display = 'none';
  $('#couponApplied').style.display = 'flex';
  actualizarMontos();
  showToast(`Cupón ${code} aplicado`);
}

function removeCoupon(){
  state.descuentoAplicado = { code: null, percent: 0 };
  $('#couponInput').style.display = 'flex';
  $('#couponApplied').style.display = 'none';
  actualizarMontos();
}

function getPrecioFinal(){
  const p = state.productoSeleccionado.precio;
  const d = state.descuentoAplicado.percent;
  return d? p * (1 - d/100) : p;
}

function actualizarMontos(){
  const precio = getPrecioFinal();
  const usd = (precio * CUENTAS.paypal.usd).toFixed(2);
  $('#montoYape').textContent = `S/ ${precio.toFixed(2)}`;
  $('#montoTarjeta').textContent = `S/ ${precio.toFixed(2)}`;
  $('#montoPrex').textContent = `S/ ${precio.toFixed(2)}`;
  $('#montoPaypal').textContent = `$${usd} USD`;
}

function selectPayment(tab, e){
  state.metodoPago = tab; // <- GUARDA SI ES YAPE, BANK, PREX, PAYPAL
  $$('.payment-tab').forEach(b=>b.classList.remove('active'));
  if(e) e.target.classList.add('active');
  $$('.payment-content').forEach(c=>c.classList.remove('active'));
  $(`#${tab}Content`).classList.add('active');
  actualizarMontos();
}

function copyText(txt){
  navigator.clipboard.writeText(txt);
  showToast('Copiado ✅');
}

/* ===== BOT CONECTADO - ESTO ES LO IMPORTANTE ===== */
async function guardarVenta(){
  if(!state.productoSeleccionado) return showToast('Error', true);

  const precioFinal = getPrecioFinal();
  const venta = {
    id: 'F3-' + Date.now(),
    producto: state.productoSeleccionado.nom,
    precio_soles: precioFinal,
    metodo: state.metodoPago, // <- AQUI GUARDA: yape, bank, prex, paypal
    cupon: state.descuentoAplicado.code || 'Ninguno',
    fecha: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' }),
    estado: 'PENDIENTE'
  };

  // 1. MENSAJE CON JSON PARA TU BOT
  const msgBot = `🚨 *NUEVA VENTA PENDIENTE* 🚨\n\n` +
                 `*ID:* ${venta.id}\n*Producto:* ${venta.producto}\n*Monto:* S/ ${venta.precio_soles.toFixed(2)}\n*Método:* ${venta.metodo}\n` +
                 `*COPIA ESTO Y ENVIALO AL BOT:*\n` +
                 '```json\n' + JSON.stringify(venta, null, 2) + '\n```';

  // 2. MENSAJE PARA EL CLIENTE
  const msgCliente = `Hola For Three! 👋\n\nYa pagué S/ ${precioFinal.toFixed(2)} por:\n*${venta.producto}*\nMetodo: ${venta.metodo}\nID: ${venta.id}\n\nAdjunto mi comprobante 📸`;

  window.open(`${REDIR_WSP}?text=${encodeURIComponent(msgBot)}`, '_blank'); // <- Se abre 1ro para ti
  setTimeout(() => { window.open(`${REDIR_WSP}?text=${encodeURIComponent(msgCliente)}`, '_blank'); }, 1000); // <- Se abre 2do para el cliente

  cerrarPago();
  showToast('Pedido enviado al Bot ✅');
}

$('#wspBtn').onclick = guardarVenta; // <- CONECTA TU BOTON CON EL BOT

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
window.applyCoupon = applyCoupon;
window.removeCoupon = removeCoupon;
window.selectPayment = selectPayment;
window.copyText = copyText;
window.show = show;
window.toggleDark = toggleDark;

init();