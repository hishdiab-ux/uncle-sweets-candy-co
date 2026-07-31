// ===== CANDY DATA =====
const IMAGES = ['assets/sweet-1.png','assets/sweet-2.png','assets/sweet-3.png','assets/sweet-4.png','assets/sweet-5.png'];

const CANDIES = [
  { id:'choco-flappy', name:'CHOCOLATE FLAPPY', flavor:'chocolate', flavorLabel:'🍫 Chocolate', desc:'The legendary CHOCOLATE FLAPPY. Forged in pure cocoa by Uncle Sweet himself. Only the worthy may purchase. Elite tier. No substitutes.', price:99.00, tags:['ELITE','Pure cocoa','Legendary','Limited'], featured:true, elite:true, img:'assets/chocolate-flappy.png' },
  { id:'choco-volcano', name:'Chocolate Volcano Truffle', flavor:'chocolate', flavorLabel:'🍫 Chocolate', desc:'Rich dark chocolate with a molten caramel core. Uncle Sweet\'s personal favorite.', price:7.50, tags:['Dark chocolate','Molten core','Chunky'], featured:true },
  { id:'caramel-salt', name:'Caramel Sea-Salt Chunk', flavor:'caramel', flavorLabel:'🧈 Caramel', desc:'Buttery caramel folded with flaky sea salt. Sweet, salty, and unreasonably thick.', price:6.50, tags:['Sea salt','Buttery','Thick'] },
  { id:'gummy-heads', name:"Sweet's Gummy Heads", flavor:'gummy', flavorLabel:'🐻 Gummy', desc:'Gummy candies shaped like Uncle Sweet\'s head. Bite-sized. Hauntingly delicious.', price:4.99, tags:['Gummy','Haunting','Bite-sized'] },
  { id:'strawberry-swirl', name:'Strawberry Swirl Lollipop', flavor:'fruit', flavorLabel:'🍓 Fruit', desc:'Real strawberry swirled into a lollipop so thick you could club someone with it.', price:3.25, tags:['Strawberry','Swirled','Chunky'] },
  { id:'sour-apple', name:'Sour Green Apple Drops', flavor:'sour', flavorLabel:'😝 Sour', desc:'Pucker up. These tart drops will make your face do things it\'s never done before.', price:5.50, tags:['Sour','Tart','Pucker'] },
  { id:'frosty-mint', name:'Frosty Sweet Mints', flavor:'mint', flavorLabel:'🌿 Mint', desc:'Hard mints with a cool blue center. Uncle Sweet calls them "mints for tough guys."', price:5.50, tags:['Mint','Cool','Refreshing'] },
  { id:'bubblegum-bombs', name:'Bubblegum Bombs', flavor:'bubblegum', flavorLabel:'👄 Bubblegum', desc:'Pink bubblegum with a popping candy center. Chew for three hours. Uncle Sweet tested personally.', price:2.75, tags:['Bubblegum','Popping','Pink'] },
  { id:'dark-choco-bar', name:'Dark Chocolate Midnight Bar', flavor:'chocolate', flavorLabel:'🍫 Chocolate', desc:'70% dark chocolate for people who take their cocoa seriously. Dense, intense, no nonsense.', price:8.00, tags:['70% dark','Intense','Dense'] },
  { id:'watermelon-wedge', name:'Watermelon Wedge Gummies', flavor:'fruit', flavorLabel:'🍓 Fruit', desc:'Fresh watermelon gummies shaped like tiny wedges. Summer in your mouth, all year round.', price:4.25, tags:['Watermelon','Fresh','Gummy'] },
  { id:'cotton-candy', name:'Cotton Candy Cloud', flavor:'caramel', flavorLabel:'☁️ Cotton Candy', desc:'Fluffy cotton candy spun by Uncle Sweet himself. Dissolves instantly. Regret takes longer.', price:3.99, tags:['Fluffy','Spun','Dissolves'] },
  { id:'sour-worms', name:'Sour Worms Inferno', flavor:'sour', flavorLabel:'😝 Sour', desc:'The sourest worms in existence. Coated in acid sugar. Not for the faint of heart.', price:4.75, tags:['Super sour','Worms','Extreme'] },
  { id:'deluxe-box', name:'The Chunky Deluxe Box', flavor:'caramel', flavorLabel:'🎁 Assorted', desc:'Everything. All of it. A box so full Uncle Sweet had to sit on it to close it. Feeds a family or one committed person.', price:42.00, tags:['Everything','Assorted','Best value'], featured:true },
];

// ===== Assign random images to each candy =====
const shuffled = [...IMAGES].sort(()=>Math.random()-0.5);
CANDIES.forEach((c,i)=>{
  if(c.img) return; // keep fixed images (e.g. elite products)
  c.img = shuffled[i % shuffled.length];
});

// ===== DOM refs =====
const menuGrid = document.getElementById('menu-grid');
const cartBadge = document.getElementById('cart-badge');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsEl = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartFoot = document.getElementById('cart-foot');
const cartSummaryCount = document.getElementById('cart-summary-count');
const cartSummaryTotal = document.getElementById('cart-summary-total');
const cartDelivery = document.getElementById('cart-delivery');
const cartDeliveryRow = document.getElementById('cart-delivery-row');
const cartGrandTotal = document.getElementById('cart-grand-total');
const toast = document.getElementById('toast');

// ===== Cart state =====
let cart = {}; // { id: { ...candy, qty } }

// ===== Render menu =====
function renderMenu(filter='all'){
  menuGrid.innerHTML = '';
  CANDIES.forEach(c=>{
    if(filter!=='all' && c.flavor!==filter) return;
    const card = document.createElement('article');
    card.className = 'candy' + (c.featured ? ' candy--featured' : '') + (c.elite ? ' candy--elite' : '');
    card.dataset.flavor = c.flavor;
    card.innerHTML = `
      ${c.featured ? '<div class="candy__ribbon">BEST SELLER</div>' : ''}
      ${c.elite ? '<div class="candy__elite-badge">ELITE</div>' : ''}
      <div class="candy__img">
        <span class="candy__flavor-tag ${c.elite ? 'candy__flavor-tag--elite' : ''}">${c.elite ? 'ELITE TIER' : c.flavorLabel}</span>
        <img src="${c.img}" alt="${c.name}">
      </div>
      <h3>${c.name}</h3>
      <p class="candy__desc">${c.desc}</p>
      <div class="candy__meta">${c.tags.map(t=>`<span class="candy__pill">${t}</span>`).join('')}</div>
      <div class="candy__buy">
        <span class="candy__price">$${c.price.toFixed(2)}</span>
        <button class="add" data-id="${c.id}">Add 🛒</button>
      </div>
    `;
    menuGrid.appendChild(card);
  });
  // wire up add buttons
  menuGrid.querySelectorAll('.add').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      addToCart(btn.dataset.id, e);
    });
  });
}

// ===== Flavor filter =====
document.getElementById('flavor-filter').addEventListener('click',e=>{
  const chip = e.target.closest('.flavor-chip');
  if(!chip) return;
  document.querySelectorAll('.flavor-chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  renderMenu(chip.dataset.flavor);
});

// ===== Cart logic =====
function addToCart(id, e){
  const candy = CANDIES.find(c=>c.id===id);
  if(!candy) return;
  if(cart[id]){
    cart[id].qty++;
  } else {
    cart[id] = { ...candy, qty:1 };
  }
  updateCart();
  showToast(`${candy.name} added! 🍬`);
  // burst
  if(e) burstCandy(e.clientX, e.clientY, 6);
  // jiggle the badge
  cartBadge.style.transform='scale(1.4)';
  setTimeout(()=>cartBadge.style.transform='scale(1)',200);
}

function removeFromCart(id){
  delete cart[id];
  updateCart();
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0){
    delete cart[id];
  }
  updateCart();
}

function updateCart(){
  const ids = Object.keys(cart);
  const count = ids.reduce((s,id)=>s+cart[id].qty, 0);
  const subtotal = ids.reduce((s,id)=>s+cart[id].price*cart[id].qty, 0);
  const delivery = subtotal >= 40 || subtotal === 0 ? 0 : 5;
  const grand = subtotal + delivery;

  // badge
  cartBadge.textContent = count;
  cartBadge.style.display = count > 0 ? 'inline-flex' : 'none';

  // empty vs items
  if(count === 0){
    cartEmpty.style.display = 'block';
    cartFoot.style.display = 'none';
    // remove all item rows
    cartItemsEl.querySelectorAll('.cart-item').forEach(el=>el.remove());
    return;
  }
  cartEmpty.style.display = 'none';
  cartFoot.style.display = 'block';

  // render items
  cartItemsEl.querySelectorAll('.cart-item').forEach(el=>el.remove());
  ids.forEach(id=>{
    const item = cart[id];
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img class="cart-item__img" src="${item.img}" alt="${item.name}">
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__flavor">${item.flavorLabel}</div>
        <div class="cart-item__price">$${item.price.toFixed(2)} each</div>
        <div class="cart-item__controls">
          <button class="qty-btn" data-act="dec" data-id="${id}">−</button>
          <span class="cart-item__qty">${item.qty}</span>
          <button class="qty-btn" data-act="inc" data-id="${id}">+</button>
          <button class="cart-item__remove" data-act="rm" data-id="${id}">Remove</button>
        </div>
      </div>
      <div class="cart-item__line-total">$${(item.price*item.qty).toFixed(2)}</div>
    `;
    cartItemsEl.appendChild(row);
  });

  // wire item controls
  cartItemsEl.querySelectorAll('[data-act]').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const id = btn.dataset.id;
      if(btn.dataset.act==='inc') changeQty(id, 1);
      else if(btn.dataset.act==='dec') changeQty(id, -1);
      else if(btn.dataset.act==='rm') removeFromCart(id);
    });
  });

  // summary
  cartSummaryCount.textContent = count + ' item' + (count===1?'':'s');
  cartSummaryTotal.textContent = '$' + subtotal.toFixed(2);
  if(delivery === 0 && subtotal > 0){
    cartDelivery.textContent = 'FREE';
    cartDeliveryRow.classList.add('cart-summary__row--free');
  } else {
    cartDelivery.textContent = '$' + delivery.toFixed(2);
    cartDeliveryRow.classList.remove('cart-summary__row--free');
  }
  cartGrandTotal.textContent = '$' + grand.toFixed(2);
}

// ===== Cart open/close =====
function openCart(){
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('cart-open').addEventListener('click',openCart);
document.getElementById('open-cart-cta').addEventListener('click',openCart);
document.getElementById('cart-close').addEventListener('click',closeCart);
cartOverlay.addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeCart(); });

// ===== Checkout =====
document.getElementById('checkout').addEventListener('click',e=>{
  e.stopPropagation();
  const count = Object.values(cart).reduce((s,i)=>s+i.qty,0);
  const total = Object.values(cart).reduce((s,i)=>s+i.price*i.qty,0);
  const delivery = total >= 40 ? 0 : 5;
  const grand = total + delivery;
  if(count===0) return;
  const deliveryMsg = delivery===0 ? 'with FREE delivery!' : 'plus $5 delivery.';
  alert(`Sweet! 🍭\n\nUncle Sweet is personally preparing your ${count} item${count===1?'':'s'}.\nSubtotal: $${total.toFixed(2)}\nDelivery: ${delivery===0?'FREE':'$'+delivery.toFixed(2)}\nTotal: $${grand.toFixed(2)}\n\nHe's already wearing the apron, ${deliveryMsg}\n\n(This is a demo — no real order, just vibes.)`);
});

// ===== Clear cart =====
document.getElementById('cart-clear').addEventListener('click',e=>{
  e.stopPropagation();
  cart = {};
  updateCart();
  showToast('Cart cleared! 🧹');
});

// ===== Toast =====
let toastTimer;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'), 2200);
}

// ===== Candy burst =====
const CANDY_EMOJIS = ['🍬','🍭','🍫','🧁','🍩','🍪','🥧','🍮','⭐','💕'];
function burstCandy(x, y, n){
  for(let i=0;i<n;i++){
    const c=document.createElement('div');
    c.className='spawn-candy';
    c.textContent=CANDY_EMOJIS[Math.floor(Math.random()*CANDY_EMOJIS.length)];
    const a=(Math.PI*2*i)/n, d=50+Math.random()*40;
    c.style.left=(x+Math.cos(a)*d)+'px';
    c.style.top=(y+Math.sin(a)*d)+'px';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),700);
  }
}

// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Floating candy cursor =====
const float = document.createElement('div');
float.className = 'float-candy';
float.textContent = '🍬';
document.body.appendChild(float);
let mx=innerWidth/2,my=innerHeight/2,fx=mx,fy=my;
addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  float.style.opacity='.8';
  float.textContent = CANDY_EMOJIS[Math.floor(Math.random()*CANDY_EMOJIS.length)];
});
addEventListener('mouseleave',()=>float.style.opacity='0');
(function loop(){
  fx+=(mx-fx)*.18; fy+=(my-fy)*.18;
  float.style.left=fx+'px'; float.style.top=fy+'px';
  requestAnimationFrame(loop);
})();

// ===== Hero bubbles =====
const bubbles = document.getElementById('bubbles');
for(let i=0;i<18;i++){
  const b=document.createElement('div');
  b.className='bubble';
  b.textContent=CANDY_EMOJIS[i%CANDY_EMOJIS.length];
  b.style.left=Math.random()*100+'%';
  b.style.fontSize=(18+Math.random()*30)+'px';
  b.style.animationDuration=(8+Math.random()*10)+'s';
  b.style.animationDelay=(Math.random()*8)+'s';
  bubbles.appendChild(b);
}

// ===== Click anywhere spawns candy =====
addEventListener('click',e=>{
  if(e.target.closest('button,a,.cart-item,.cart-drawer,.flavor-chip'))return;
  const c=document.createElement('div');
  c.className='spawn-candy';
  c.textContent=CANDY_EMOJIS[Math.floor(Math.random()*CANDY_EMOJIS.length)];
  c.style.left=e.clientX+'px';
  c.style.top=e.clientY+'px';
  document.body.appendChild(c);
  setTimeout(()=>c.remove(),700);
});

// ===== Press S to rain candy =====
let rain=null;
addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='s'&&!rain){
    rain=setInterval(()=>{
      const c=document.createElement('div');
      c.className='spawn-candy';
      c.textContent=CANDY_EMOJIS[Math.floor(Math.random()*CANDY_EMOJIS.length)];
      c.style.left=(Math.random()*innerWidth)+'px';
      c.style.top='-40px';
      c.style.animation='fall 2.5s linear forwards';
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),2500);
    },100);
    setTimeout(()=>{clearInterval(rain);rain=null;},4000);
  }
});
const fallStyle=document.createElement('style');
fallStyle.textContent='@keyframes fall{from{transform:translateY(0) rotate(0);opacity:1}to{transform:translateY(110vh) rotate(540deg);opacity:.4}}';
document.head.appendChild(fallStyle);

// ===== INIT =====
renderMenu();
updateCart();
cartBadge.style.display = 'none';
