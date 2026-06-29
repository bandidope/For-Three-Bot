// === CONFIG ===
const music=document.getElementById('bgMusic');
const btn=document.getElementById('musicBtn');
const musicStart=document.getElementById('musicStart');
const themeBtn=document.getElementById('themeBtn');
let currentProduct=null;
let activeCoupon=null;

// Config audio
music.loop=true;
music.volume=0.8;

// === DATOS DE EJEMPLO ===
const productos=[
  {id:1,nom:"Bot VIP WhatsApp",marca:"For Three",precio:25,img:"https://i.ibb.co/3y0p0sP/bot-vip.jpg",desc:["Respuesta automática 24/7","Menú interactivo","Soporte incluido"]},
  {id:2,nom:"Activación Netflix",marca:"Streaming",precio:18,img:"https://i.ibb.co/3y0p0sP/bot-vip.jpg",desc:["1 mes full","4 pantallas","Garantía 30 días"]},
];
const cupones={"F3DIEZ":0.1}; // 10% dcto
const pagos={
  yape:{num:"999888777",name:"For Three Store"},
  bcp:{cci:"002123456789012345",cuenta:"123-4567890-1-23",nombre:"For Three EIRL"},
  prex:{num:"912345678",name:"For Three"},
  paypal:"https://paypal.me/tuusuario"
};

// === AUDIO ===
function startMusic(){
  musicStart.classList.remove('active');
  music.play().catch(()=>{});
}
btn.onclick=()=>{music.paused?(music.play(),btn.textContent='🔊'):(music.pause(),btn.textContent='🔇')};

// === TEMA OSCURO/CLARO ===
themeBtn.onclick=()=>{
  document.body.classList.toggle('light');
  themeBtn.textContent=document.body.classList.contains('light')?'☀️':'🌙';
  localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark');
};

// === NAVEGACION ===
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='tiendaScreen') renderProductos();
}

// === PRODUCTOS ===
function renderProductos(){
  const grid=document.getElementById('productos');
  grid.innerHTML=productos.map(p=>`
    <div class="card" onclick="verProducto(${p.id})">
      <img src="${p.img}" alt="${p.nom}">
      <h3>${p.nom}</h3>
      <div class="precio">S/ ${p.precio}.00</div>
    </div>
  `).join('');
}
function verProducto(id){
  currentProduct=productos.find(p=>p.id===id);
  document.getElementById('pImg').src=currentProduct.img;
  document.getElementById('pMarca').textContent=currentProduct.marca;
  document.getElementById('pNom').textContent=currentProduct.nom;
  document.getElementById('pPrecio').textContent=`S/ ${currentProduct.precio}.00`;
  document.getElementById('pDesc').innerHTML=currentProduct.desc.map(d=>`<li>✓ ${d}</li>`).join('');
  document.getElementById('comprarBtn').onclick=abrirPago;
  show('productoScreen');
}

// === PAGO ===
function abrirPago(){
  document.getElementById('pagoModal').classList.add('active');
  updateMontos();
}
function cerrarPago(){document.getElementById('pagoModal').classList.remove('active')}
function selectPayment(t,ev){
  document.querySelectorAll('.payment-tab,.payment-content').forEach(e=>e.classList.remove('active'));
  ev.target.classList.add('active');
  document.getElementById(t+'Content').classList.add('active');
  updateMontos();
}
function applyCoupon(){
  const code=document.getElementById('couponCode').value.toUpperCase();
  if(cupones[code]){
    activeCoupon=cupones[code];
    document.getElementById('couponText').textContent=`${code} -10% aplicado`;
    document.getElementById('couponInput').style.display='none';
    document.getElementById('couponApplied').style.display='flex';
    updateMontos();
    toast('Cupón aplicado!');
  }else toast('Cupón inválido');
}
function removeCoupon(){
  activeCoupon=null;
  document.getElementById('couponInput').style.display='flex';
  document.getElementById('couponApplied').style.display='none';
  document.getElementById('couponCode').value='';
  updateMontos();
}
function updateMontos(){
  if(!currentProduct) return;
  let precio=currentProduct.precio;
  if(activeCoupon) precio=precio*(1-activeCoupon);
  const usd=(precio/3.7).toFixed(2);
  ['montoYape','montoTarjeta','montoPrex'].forEach(id=>document.getElementById(id).textContent=`S/ ${precio.toFixed(2)}`);
  document.getElementById('montoPaypal').textContent=`$${usd} USD`;
  document.getElementById('paypalLink').href=`${pagos.paypal}/${usd}`;
  document.getElementById('yapeNum').textContent=pagos.yape.num;
  document.getElementById('yapeName').textContent=pagos.yape.name;
  document.getElementById('bcpCci').textContent=pagos.bcp.cci;
  document.getElementById('bcpCuenta').textContent=pagos.bcp.cuenta;
  document.getElementById('bcpNombre').textContent=pagos.bcp.nombre;
  document.getElementById('prexNum').textContent=pagos.prex.num;
  document.getElementById('prexName').textContent=pagos.prex.name;
}
document.getElementById('wspBtn').onclick=()=>{
  const precio=activeCoupon?currentProduct.precio*(1-activeCoupon):currentProduct.precio;
  const msg=`Hola! Quiero comprar: ${currentProduct.nom} - S/ ${precio.toFixed(2)}`;
  window.open(`https://wa.me/51999888777?text=${encodeURIComponent(msg)}`,'_blank');
};
function copyText(txt){navigator.clipboard.writeText(txt);toast('Copiado!')}

// === TOAST ===
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2000);
}

// === INIT ===
window.addEventListener('load',()=>{
  if(localStorage.getItem('theme')==='light')document.body.classList.add('light'),themeBtn.textContent='☀️';
  show('inicioScreen');
});