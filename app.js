const CONFIG = {
  TC_USD: 3.80,
  PAYPAL_FEE: 0.054,
  PAYPAL_FIXED: 0.30,
  PAYPAL_USER: 'forthreestore', // <-- TU USUARIO PAYPAL.ME
  
  // CAMBIA ESTOS 7 DATOS 👇
  YAPE_NUMERO: '936994155', 
  YAPE_NOMBRE: 'For Three Store',
  BCP_CUENTA: '191-12345678-0-12', 
  BCP_CCI: '00219100123456780127',
  BCP_NOMBRE: 'For Three Store',
  PREX_CUENTA: '93551234567',
  PREX_NOMBRE: 'For Three Store'
};

const COUPONS = {
  'BOT10': 0.10,
  'LANZAMIENTO15': 0.15,
  'HOSTING5': 5
};

const productos = [
  {
    id: 1,
    nom: "Bot Para Grupos WhatsApp",
    precio: 5,
    imgs: ["https://via.placeholder.com/400x400/0a0a0a/25D366?text=BOT"],
    marca: "FOR THREE STORE",
    cat: "Bots",
    desc: [
      "Anti-fake y anti-link automático",
      "Comandos: /kick /ban /menu",
      "Auto-respuestas 24/7",
      "Instalación inmediata",
      "Soporte Permanente En El Grupo"
    ]
  },
  {
    id: 2,
    nom: "Bot Personalizado VIP",
    precio: 25,
    imgs: ["https://via.placeholder.com/400x400/0a0a0a/FFB400?text=VIP"],
    marca: "FOR THREE STORE",
    cat: "Bots",
    desc: [
      "100% a tu gusto",
      "Bot + Panel Hosting",
      "Menu Personalizable",
      "Soporte Permanente"
    ]
  },
  {
    id: 3,
    nom: "Hosting Bot 24/7",
    precio: 10.00,
    imgs: ["https://via.placeholder.com/400x400/0a0a0a/007600?text=HOST"],
    marca: "FOR THREE STORE",
    cat: "Hosting",
    desc: [
      "Bot encendido 24/7 sin PC",
      "Servidor en Perú",
      "1.5GB RAM + 5GB SSD",
      "Respaldo semanal",
      "S/ 10 mensual"
    ]
  }
];

let productoSeleccionado = null;
let metodoPago = 'yape';
let descuentoAplicado = {code: null, valor: 0, tipo: '%'};

const themeBtn = document.getElementById('themeBtn');
function aplicarTema(esDark) {
  document.body.classList.toggle('dark', esDark);
  themeBtn.textContent = esDark ? '☀️' : '🌙';
}
aplicarTema(window.matchMedia('(prefers-color-scheme: dark)').matches);
function toggleDark() {
  const esDark = !document.body.classList.contains('dark');
  aplicarTema(esDark);
  localStorage.setItem('dark', esDark);
}

const cats = ['Bots', 'Hosting'];
document.getElementById('subnav').innerHTML = cats
  .map(c => `<button onclick="setCat('${c}', event)">${c}</button>`)
  .join('');
setCat('Bots', null);

function setCat(c, e) {
  if(e) e.target.classList.add('active');
  document.querySelectorAll('.subnav button').forEach(b => {
    if(b.textContent !== c) b.classList.remove('active');
  });
  filtrar(c);
}

function filtrar(cat) {
  const list = productos.filter(p => p.cat === cat);
  document.getElementById('productos').innerHTML = list
    .map(p => `
    <div class="card" onclick="verProducto(${p.id})">
      <div class="tag">DIGITAL</div>
      <img src="${p.imgs[0]}">
      <div class="card-body">
        <div class="marca">${p.cat}</div>
        <b>${p.nom}</b>
        <div class="precio">S/ ${p.precio.toFixed(2)}</div>
        <button class="btn" onclick="abrirPago(${p.id}, event)">Contratar</button>
      </div>
    </div>
  `).join('');
}

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id === 'tiendaScreen') filtrar('Bots');
}

function verProducto(id) {
  const p = productos.find(x => x.id === id);
  document.getElementById('pNom').textContent = p.nom;
  document.getElementById('pMarca').textContent = p.cat;
  document.getElementById('pPrecio').innerHTML = `<div class="precio" style="font-size:24px">S/ ${p.precio.toFixed(2)}</div>`;
  document.getElementById('pDesc').innerHTML = p.desc.map(d => `<li>${d}</li>`).join('');
  document.getElementById('comprarBtn').onclick = () => abrirPago(id, null);
  show('productoScreen');
}

function solesADolares(soles) {
  const baseUSD = soles / CONFIG.TC_USD;
  const totalUSD = (baseUSD + CONFIG.PAYPAL_FIXED) / (1 - CONFIG.PAYPAL_FEE);
  return totalUSD.toFixed(2);
}

function getPrecioFinal() {
  if(!productoSeleccionado) return 0;
  let precio = productoSeleccionado.precio;
  if(descuentoAplicado.tipo === '%') {
    precio = precio * (1 - descuentoAplicado.valor);
  } else {
    precio = Math.max(0, precio - descuentoAplicado.valor);
  }
  return precio;
}

function abrirPago(id, e) {
  if(e) e.stopPropagation();
  productoSeleccionado = productos.find(x => x.id === id);
  descuentoAplicado = {code: null, valor: 0, tipo: '%'};
  document.getElementById('couponInput').style.display = 'flex';
  document.getElementById('couponApplied').style.display = 'none';
  document.getElementById('couponCode').value = '';
  
  // CARGAR DATOS YAPE/TARJETA/PREX
  document.getElementById('yapeNum').textContent = CONFIG.YAPE_NUMERO;
  document.getElementById('yapeName').textContent = CONFIG.YAPE_NOMBRE;
  document.getElementById('bcpCuenta').textContent = CONFIG.BCP_CUENTA;
  document.getElementById('bcpCci').textContent = CONFIG.BCP_CCI;
  document.getElementById('bcpNombre').textContent = CONFIG.BCP_NOMBRE;
  document.getElementById('prexNum').textContent = CONFIG.PREX_CUENTA;
  document.getElementById('prexName').textContent = CONFIG.PREX_NOMBRE;
  
  actualizarPrecios();
  document.getElementById('pagoModal').classList.add('active');