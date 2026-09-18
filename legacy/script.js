const spb=document.getElementById('spb');
window.addEventListener('scroll',()=>{const s=document.documentElement;spb.style.width=(s.scrollTop/(s.scrollHeight-s.clientHeight)*100)+'%';},{passive:true});

const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});
(function loop(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;cur.style.left=mx+'px';cur.style.top=my+'px';ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
document.querySelectorAll('a,button,.wc,.plan,.tst,.svc-card,.faq-q').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('hover');ring.classList.add('hover')});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('hover');ring.classList.remove('hover')});
});

const nav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>20),{passive:true});
const navAs=document.querySelectorAll('.n-links a');
const secObs=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting){navAs.forEach(a=>a.classList.remove('act'));const a=document.querySelector(`.n-links a[href="#${en.target.id}"]`);if(a)a.classList.add('act');}});},{threshold:.3});
['work','about','services','proceso','precios','testimonios','faq','contacto'].forEach(id=>{const el=document.getElementById(id);if(el)secObs.observe(el);});

const rObs=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting)en.target.classList.add('on');});},{threshold:.1});
document.querySelectorAll('.rev').forEach(el=>rObs.observe(el));

const cObs=new IntersectionObserver(entries=>{entries.forEach(en=>{if(!en.isIntersecting)return;const el=en.target,target=+el.dataset.count,suffix=el.dataset.suffix||'',t0=performance.now(),dur=1800;(function tick(now){const p=Math.min((now-t0)/dur,1);el.textContent=Math.round(p*target)+suffix;if(p<1)requestAnimationFrame(tick);})(t0);cObs.unobserve(el);});},{threshold:.6});
document.querySelectorAll('.cnt').forEach(el=>cObs.observe(el));

const skObs=new IntersectionObserver(entries=>{entries.forEach(en=>{if(!en.isIntersecting)return;document.querySelectorAll('.sk-fill').forEach(r=>{const pct=+r.dataset.pct,circ=2*Math.PI*35;r.style.strokeDashoffset=circ*(1-pct/100);});skObs.disconnect();});},{threshold:.3});
const skWrap=document.querySelector('.skills-wrap');if(skWrap)skObs.observe(skWrap);

document.querySelectorAll('.btn-fill,.btn-ghost,.n-cta,.f-submit,.plan-btn').forEach(btn=>{btn.addEventListener('click',e=>{const r=document.createElement('span'),rect=btn.getBoundingClientRect(),d=Math.max(rect.width,rect.height);r.className='rip';r.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px`;btn.appendChild(r);setTimeout(()=>r.remove(),600);});});

function toggleFaq(item){const was=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));if(!was)item.classList.add('open');}
function checkFill(inp){inp.parentElement.classList.toggle('filled',inp.value.length>0)}
function submitForm(e){e.preventDefault();const inputs=e.target.querySelectorAll('.f-input');const n=inputs[0].value.trim(),c=inputs[1].value.trim(),b=inputs[2].value.trim(),m=inputs[3].value.trim();window.open(`https://wa.me/525571831083?text=${encodeURIComponent(`Hola Brandon! Soy ${n}.\nContacto: ${c}\nNegocio: ${b}\n\n${m}`)}`,'_blank','noopener');}
</script>
