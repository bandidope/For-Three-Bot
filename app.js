const music=document.getElementById('bgMusic');
const btn=document.getElementById('musicBtn');
const musicStart=document.getElementById('musicStart');
const themeBtn=document.getElementById('themeBtn');

music.loop=true; music.volume=0.8;

function startMusic(){
  musicStart.classList.remove('active');
  music.play().catch(()=>{});
}
btn.onclick=()=>{music.paused?(music.play(),btn.textContent='🔊'):(music.pause(),btn.textContent='🔇')};

if(themeBtn){themeBtn.onclick=()=>{document.body.classList.toggle('light');themeBtn.textContent=document.body.classList.contains('light')?'☀️':'🌙';}}

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='tiendaScreen')renderProductos();
}

const productos=[{id:1,nom:"Bot VIP WhatsApp",marca:"For Three",precio:25,img:"https://i.ibb.co/3y0p0sP/bot-vip.jpg",desc:["Respuesta automática 24/7","Menú interactivo","Soporte incluido"]},{id:2,nom:"Activación Netflix",marca:"Streaming",precio:18,img:"https://i.ibb.co/3y0p0sP/bot-vip.jpg",desc:["1 mes full","4 pantallas","Garantía 30 días"]}];

function renderProductos(){
  const grid=document.getElementById('productos');
  if(!grid)return;
  grid.innerHTML=productos.map(p=>`<div class="card" onclick="verProducto(${p.id})"><img src="${p.img}" alt="${p.nom}"><h3>${p.nom}</h3><div class="precio">S/ ${p.precio}.00</div></div>`).join('');
}
let currentProduct=null;
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
function abrirPago(){document.getElementById('pagoModal').classList.add('active');}
function cerrarPago(){document.getElementById('pagoModal').classList.remove('active');}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);}
function copyText(txt){navigator.clipboard.writeText(txt);toast('Copiado!');}
window.addEventListener('load',()=>{show('inicioScreen');});