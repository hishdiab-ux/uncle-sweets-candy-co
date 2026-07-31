const IMG = 'assets/nathan.png';
const CANDIES = ['🍬','🍭','🍫','🧁','🍩','🍪','🥧','🍮','🍬','🍭'];

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Floating candy cursor
const float = document.createElement('div');
float.className = 'float-candy';
float.textContent = '🍬';
document.body.appendChild(float);
let mx=innerWidth/2,my=innerHeight/2,fx=mx,fy=my;
addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  float.style.opacity='.8';
  float.textContent = CANDIES[Math.floor(Math.random()*CANDIES.length)];
});
addEventListener('mouseleave',()=>float.style.opacity='0');
(function loop(){
  fx+=(mx-fx)*.18; fy+=(my-fy)*.18;
  float.style.left=fx+'px'; float.style.top=fy+'px';
  requestAnimationFrame(loop);
})();

// Hero bubbles
const bubbles = document.getElementById('bubbles');
const bubbleEmojis = ['🍬','🍭','🍫','🧁','🍩','🍪','🥧','⭐','💕'];
for(let i=0;i<18;i++){
  const b=document.createElement('div');
  b.className='bubble';
  b.textContent=bubbleEmojis[i%bubbleEmojis.length];
  b.style.left=Math.random()*100+'%';
  b.style.fontSize=(18+Math.random()*30)+'px';
  b.style.animationDuration=(8+Math.random()*10)+'s';
  b.style.animationDelay=(Math.random()*8)+'s';
  bubbles.appendChild(b);
}

// Cart
let cart=0, total=0;
const cartCount=document.getElementById('cart-count');
const cartTotal=document.getElementById('cart-total');
document.querySelectorAll('.add').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    const card=btn.closest('.candy');
    const price=parseFloat(card.querySelector('.candy__price').textContent.replace('$',''));
    cart++; total+=price;
    cartCount.textContent='🛒 '+cart+' item'+(cart===1?'':'s');
    cartTotal.textContent='Total: $'+total.toFixed(2);
    // burst of candy
    for(let i=0;i<6;i++){
      const c=document.createElement('div');
      c.className='spawn-candy';
      c.textContent=CANDIES[Math.floor(Math.random()*CANDIES.length)];
      const a=(Math.PI*2*i)/6, d=50+Math.random()*40;
      c.style.left=(e.clientX+Math.cos(a)*d)+'px';
      c.style.top=(e.clientY+Math.sin(a)*d)+'px';
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),700);
    }
    btn.textContent='Added! ✓';
    setTimeout(()=>btn.textContent='Add 🛒',900);
  });
});

// Checkout
document.getElementById('checkout').addEventListener('click',e=>{
  e.stopPropagation();
  if(cart===0){alert("Your cart's empty! Uncle Sweet is mildly offended. 🍬");return;}
  alert("Sweet! 🍭\n\nUncle Sweet is personally preparing your "+cart+" item"+(cart===1?'':'s')+" ($"+total.toFixed(2)+").\nHe's already wearing the apron.\n\n(This is a demo — no real order, just vibes.)");
});

// Click anywhere spawns candy
addEventListener('click',e=>{
  if(e.target.closest('button,a'))return;
  const c=document.createElement('div');
  c.className='spawn-candy';
  c.textContent=CANDIES[Math.floor(Math.random()*CANDIES.length)];
  c.style.left=(e.clientX)+'px';
  c.style.top=(e.clientY)+'px';
  document.body.appendChild(c);
  setTimeout(()=>c.remove(),700);
});

// Press S to rain candy
let rain=null;
addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='s'&&!rain){
    rain=setInterval(()=>{
      const c=document.createElement('div');
      c.className='spawn-candy';
      c.textContent=CANDIES[Math.floor(Math.random()*CANDIES.length)];
      c.style.left=(Math.random()*innerWidth)+'px';
      c.style.top='-40px';
      c.style.animation='fall 2.5s linear forwards';
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),2500);
    },100);
    setTimeout(()=>{clearInterval(rain);rain=null;},4000);
  }
});
const fs=document.createElement('style');
fs.textContent='@keyframes fall{from{transform:translateY(0) rotate(0);opacity:1}to{transform:translateY(110vh) rotate(540deg);opacity:.4}}';
document.head.appendChild(fs);
