const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[],ok=[];const chk=(c,m)=>{(c?ok:errs).push(m)};
const EXP={dash:['soldier','fitness','mk','nav','exam','att','march','qual','ready','doc','event'],soldiers:['soldier'],fitness:['fitness'],shooting:['mk'],nav:['nav'],exams:['exam'],attendance:['att'],march:['march'],quals:['qual','qualdef'],ready:['ready'],docs:['doc'],notes:['assess','note','follow']};
const CARD=['fitness','mk','nav','exam','qual','ready','doc','event','assess','note','follow'];
for(const [vn,vp] of [['m',{width:390,height:844}],['d',{width:1280,height:900}]]){
const ctx=await b.newContext({viewport:vp,locale:'he-IL'});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(vn+' PE '+e.message));
await p.goto('file:///home/claude/demo2/index.html');await p.waitForTimeout(300);
const X=(f,a)=>p.evaluate(f,a);const T=s=>vn+' '+s;
const on=()=>X(()=>document.getElementById('sheet').classList.contains('on'));
const titleNow=()=>X(()=>document.querySelector('#sheet .sheet-h h3').textContent);
const fabBox=()=>X(()=>{const r=document.getElementById('fab').getBoundingClientRect();return{t:r.top,b:r.bottom,l:r.left,r:r.right,w:r.width,h:r.height,iw:innerWidth,ih:innerHeight};});
await X(()=>CT.go('dash'));
let fb=await fabBox();chk(fb.b<=fb.ih&&fb.l>=0&&fb.r<=fb.iw&&fb.w>=48&&fb.h>=48,T('fab visible fully, >=48px touch target'));
if(vn==='m'){const nb=await X(()=>document.getElementById('bnav').getBoundingClientRect().top);chk(fb.b<=nb,T('fab does not cover bottom nav'));}
// each screen: actions list = expected ids; each action opens correct form
for(const r of Object.keys(EXP)){
 await X(r=>CT.go(r),r);await p.click('#fab');chk(await on(),T(r+': fab opens sheet'));
 chk(await X(()=>document.getElementById('sheet').classList.contains('act')),T(r+': action sheet style'));
 const labels=await X(()=>[...document.querySelectorAll('#sheet .sheet-list button')].map(b=>b.textContent.replace('מ״פ בלבד','').trim()));
 const expL=await X(ids=>ids.map(i=>CT.forms.META[i][0]),EXP[r]);
 chk(JSON.stringify(labels)===JSON.stringify(expL),T(r+': actions = '+expL.join(',')));
 chk(await X(()=>[...document.querySelectorAll('#sheet .sheet-list button svg')].length)===EXP[r].length,T(r+': every action has icon'));
 for(let i=0;i<EXP[r].length;i++){
  if(i>0){await p.click('#fab');}
  await p.locator('#sheet .sheet-list button').nth(i).click();
  const want=await X(id=>CT.forms.defs[id]().title,EXP[r][i]);const got=await titleNow();
  chk(got===want,T(r+': action '+EXP[r][i]+' opens form "'+want+'" (got "'+got+'")'));
  chk(!(await X(()=>document.getElementById('sheet').classList.contains('act'))),T(r+': form sheet not action style'));
  await p.click('#sheet .sheet-h button');chk(!(await on()),T(r+': X closes'));
 }
}
// close behaviours
await X(()=>CT.go('quals'));await p.click('#fab');await p.mouse.click(vn==='m'?195:900,40);chk(!(await on()),T('click outside closes'));
await p.click('#fab');await p.keyboard.press('Escape');chk(!(await on()),T('Esc closes'));
await p.click('#fab');await p.click('#sheet .sheet-h button');chk(!(await on()),T('X closes action sheet'));
// sheet geometry
await p.click('#fab');await p.waitForTimeout(400);const g=await X(()=>{const r=document.getElementById('sheet').getBoundingClientRect();return{t:r.top,b:r.bottom,l:r.left,r:r.right,iw:innerWidth,ih:innerHeight,rad:getComputedStyle(document.getElementById('sheet')).borderTopLeftRadius,bg:getComputedStyle(document.getElementById('sheet')).backgroundColor};});
if(vn==='m'){chk(Math.abs(g.b-g.ih)<2&&g.l<=1&&g.r>=g.iw-1&&g.t>g.ih*0.3,T('mobile: bottom-anchored full width, top>30% (not covering screen) top='+Math.round(g.t)));}
else{chk(g.r-g.l<=400&&g.l<g.iw/2&&g.b<g.ih,T('desktop: compact popover by fab w='+Math.round(g.r-g.l)));}
chk(g.bg==='rgb(255, 255, 255)'&&parseFloat(g.rad)>=14,T('white bg & rounded corners ('+g.bg+','+g.rad+')'));
await p.click('#sheet .sheet-h button');
// soldier card passes correct sid
for(const sid of ['s5','s12']){
 await X(s=>CT.go('soldier',s),sid);const nm=await X(s=>CT.sol(s).name,sid);
 await p.click('#fab');chk((await titleNow()).includes(nm),T('card '+sid+': sheet title names soldier'));
 const labels=await X(()=>[...document.querySelectorAll('#sheet .sheet-list button')].length);chk(labels===CARD.length,T('card: '+CARD.length+' actions'));
 for(let i=0;i<CARD.length;i++){
  if(i>0)await p.click('#fab');await p.locator('#sheet .sheet-list button').nth(i).click();
  const want=await X(id=>CT.forms.defs[id]().title,CARD[i]);chk((await titleNow())===want,T('card '+sid+': '+CARD[i]+' opens right form'));
  const st=await X(()=>{const l=document.querySelector('#sheet .lockedsol');return l?l.textContent:null;});
  chk(st&&st.includes(nm),T('card '+sid+': '+CARD[i]+' soldier preselected+locked'));
  await p.click('#sheet .sheet-h button');}
}
// full flow from FAB on card: save and return to card
await X(()=>CT.go('soldier','s7'));await p.click('#fab');await p.locator('#sheet .sheet-list button').nth(1).click();
await X(()=>{const e=document.getElementById('f_ex');e.value='91';e.dispatchEvent(new Event('input',{bubbles:true}));});
await p.click('#sheet .seg button:has-text("כן")');await p.click('#sheet button[type=submit]');
chk(!(await on())&&await X(()=>CT.S.route==='soldier'&&CT.S.arg==='s7'&&CT.D().mk.some(m=>m.sid==='s7'&&m.ex===91)),T('fab→form→save: record has right sid, back on card'));
// from module: sid not preselected
await X(()=>CT.go('shooting'));await p.click('#fab');await p.locator('#sheet .sheet-list button').nth(0).click();chk(await X(()=>!document.querySelector('#sheet .lockedsol')&&!!document.getElementById('f_sid')),T('module: soldier picker (not locked)'));await p.click('#sheet .sheet-h button');
// screens without actions hide fab
for(const r of ['compare','reports','backup','about']){await X(r=>CT.go(r),r);chk(await X(()=>getComputedStyle(document.getElementById('fab')).display==='none'),T(r+': fab hidden'));}
// overflow
for(const r of ['dash','soldiers','shooting','quals']){await X(r=>CT.go(r),r);await p.click('#fab');const o=await X(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth,document.getElementById('sheet').scrollWidth,document.getElementById('sheet').clientWidth]);chk(o[0]<=o[1]+1&&o[2]<=o[3]+1,T('no overflow with sheet open '+r));await p.click('#sheet .sheet-h button');}
// commander lock
await X(()=>{CT.R.role='cmd';CT.R.scope={type:'dep',id:'dA'};CT.go('notes');});await p.click('#fab');chk((await p.textContent('#sheet')).includes('מ״פ בלבד'),T('commander: owner-only actions marked'));await p.click('#sheet .sheet-h button');
await ctx.close();}
console.log('OK',ok.length);console.log('ERR',errs.length,errs.join('\n'));await b.close();})();
