const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[],ok=[];const chk=(c,m)=>{(c?ok:errs).push(m)};
const ctx=await b.newContext({viewport:{width:390,height:844},locale:'he-IL'});const p=await ctx.newPage();
p.on('pageerror',e=>errs.push('PE '+e.message));
await p.goto('file:///home/claude/demo2/index.html');await p.waitForTimeout(300);
// data correctness
const dd=await p.evaluate(()=>{const D=CT.D();const act=D.sol.filter(s=>!s.cancelled&&s.active);const nav=act.map(s=>{const r=D.nav.filter(x=>x.sid===s.id);return r.length?r.reduce((a,x)=>a+x.plan+x.deb+90*x.done/x.total,0)/r.length:null}).filter(x=>x!==null);const m=nav.reduce((a,x)=>a+x,0)/nav.length;
 const kp=[...document.querySelectorAll('.kpi')].map(k=>[k.querySelector('.l').textContent,k.querySelector('.n').textContent]);
 const t1=D.sol.filter(s=>s.team==='t1'&&!s.cancelled&&s.active);const tn=t1.map(s=>{const r=D.nav.filter(x=>x.sid===s.id);return r.length?r.reduce((a,x)=>a+x.plan+x.deb+90*x.done/x.total,0)/r.length:null}).filter(x=>x!==null);const t1m=tn.reduce((a,x)=>a+x,0)/tn.length;
 const bar=[...document.querySelectorAll('svg.ch text')].map(t=>t.textContent);
 return {m:Math.round(m),kp,t1m:Math.round(t1m*10)/10,bar,act:act.length}});
chk(dd.kp.some(k=>k[0].startsWith('ניווטים')&&k[1]===String(dd.m)),'KPI nav '+dd.m);
chk(dd.bar.includes(String(dd.t1m)),'team1 nav bar '+dd.t1m);
chk(dd.kp.some(k=>k[0].startsWith('חיילים פעילים')&&k[1]===String(dd.act)),'active '+dd.act);
// click bar -> sheet
await p.click('svg.ch g.clk >> nth=0');chk(await p.isVisible('#sheet.on'),'team sheet opens');await p.click('#sheet .sheet-h button');chk(!(await p.isVisible('#sheet.on')),'sheet closes');
// seg switch
await p.click('.seg button:has-text("קליעה")');chk((await p.textContent('#view')).includes('קליעה — ממוצע לפי צוות'),'domain switch');
// filter dep
await p.selectOption('.filters select >> nth=1','dA');chk((await p.textContent('.filters .grow')).startsWith('12'),'dep filter 12 active '+await p.textContent('.filters .grow'));
await p.click('.filters .link');
// bottom nav
await p.click('#bnav button:has-text("חיילים")');await p.fill('input[type=search]','05');const n=await p.locator('#view button.card').count();chk(n>=1,'search '+n);
await p.locator('#view button.card').first().click();chk((await p.textContent('#view')).includes('תמונת מצב'),'soldier card');
// qual change
// menu & domain sheet
await p.click('#bnav button:has-text("תחומים")');await p.click('.sheet-list button:has-text("כשירות")');chk((await p.textContent('#view')).includes('תמונת מצב'),'ready screen');
await p.click('#role');await p.click('#sheet .sheet-list button:has-text("מפקד מחלקה א׳")');chk((await p.textContent('#role')).includes('מפקד'),'role chip commander');await p.evaluate(()=>CT.go('notes'));chk((await p.textContent('#view')).includes('תצוגת מפקד'),'commander hides notes');
await p.click('#role');await p.click('#sheet .sheet-list button:has-text("מ״פ — כל הקורס")');await p.evaluate(()=>CT.go('notes'));chk((await p.textContent('#view')).includes('הערות פרטיות'),'owner notes');
await p.evaluate(()=>CT.go('backup'));await p.click('button:has-text("צור גיבוי ידני")');chk((await p.locator('#view tbody tr').count())>0,'backup created');
await p.evaluate(()=>CT.go('reports'));await p.click('.pill-a >> nth=0');chk(await p.isVisible('#sheet.on'),'report preview');await p.keyboard.press('Escape');
await p.evaluate(()=>CT.go('compare'));for(const t of ['מחלקות','תחומים','לאורך זמן'])await p.click('.seg button:has-text("'+t+'")');chk(true,'compare tabs');
await p.click('svg.ch g.clk >> nth=0',{force:true});chk(await p.isVisible('#sheet.on'),'time point -> sheet');
await p.keyboard.press('Escape');
const o=await p.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);chk(o[0]<=o[1],'no h-scroll');
console.log('OK',ok.length,ok.join(' | '));console.log('ERR',errs.length,errs.join('\n'));await b.close();})();
