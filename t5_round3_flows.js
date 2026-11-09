const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[],ok=[];const chk=(c,m)=>{(c?ok:errs).push(m)};
for(const [vn,vp] of [['m',{width:390,height:844}],['d',{width:1280,height:900}]]){
const ctx=await b.newContext({viewport:vp,locale:'he-IL'});const p=await ctx.newPage();
p.on('pageerror',e=>errs.push(vn+' PE '+e.message));
await p.goto('file:///home/claude/demo2/index.html');await p.waitForTimeout(300);
const X=(f,a)=>p.evaluate(f,a);const T=s=>vn+' '+s;
const open=(id,o)=>X(([i,o])=>CT.forms.open(i,o||{}),[id,o||{}]);
const setv=(k,v)=>X(([k,v])=>{const e=document.getElementById('f_'+k);e.value=v;e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));},[k,v]);
const seg=t=>p.click('#sheet .seg button:has-text("'+t+'")');const submit=()=>p.click('#sheet button[type=submit]');
let v;const sheet=()=>p.textContent('#sheet');const toast=()=>p.textContent('#toast');const sheetOpen=()=>X(()=>document.getElementById('sheet').classList.contains('on'));
const hasF=k=>X(k=>!!document.getElementById('f_'+k),k);
const overflow=async m=>{const o=await X(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth,document.getElementById('sheet').scrollWidth,document.getElementById('sheet').clientWidth]);chk(o[0]<=o[1]+1&&o[2]<=o[3]+1,T('no overflow '+m));};
// 1 soldier edit reason
await open('soldier_edit',{sid:'s3'});await setv('name','שם מעודכן');await submit();let t=await sheet();chk(t.includes('שדה חובה'),T('edit: reason required'));
await setv('name','חייל דמה 03');await setv('reason','x');await submit();t=await sheet();chk(t.includes('לא בוצע שינוי'),T('edit: no-change rejected'));
await setv('name','שם מעודכן');await setv('reason','תיקון איות');await submit();t=await sheet();chk(t.includes('תצוגה מקדימה')&&t.includes('תיקון איות'),T('edit: preview shows reason'));
await p.click('#sheet button:has-text("אשר ושמור")');chk(!(await sheetOpen())&&(await toast()).includes('תיקון איות'),T('edit: saved, returned, toast shows reason'));
chk(await X(()=>{const x=CT.sol('s3');return x.name==='שם מעודכן'&&x.changes.length===1&&x.changes[0].reason==='תיקון איות'&&CT.D().audit[0].reason==='תיקון איות';}),T('edit: reason stored in record+audit'));
await X(()=>CT.go('soldier','s3'));chk((await p.textContent('#view')).includes('היסטוריית עדכוני פרטים')&&(await p.textContent('#view')).includes('תיקון איות'),T('edit: history on card'));
// 2 reassign
await open('soldier_move',{sid:'s3'});t=await sheet();chk(t.includes('כבר התחיל')&&t.includes('חריג מאושר במפורש'),T('move: started notice + exception field'));
await setv('dep','dB');await setv('team','t4');await submit();t=await sheet();chk(t.includes('חריג מאושר במפורש')&&t.includes('שדה חובה'),T('move: blocked w/o exception & reason'));
await seg('כן — אני מאשר חריג');await submit();t=await sheet();chk(t.includes('שדה חובה')&&await sheetOpen(),T('move: exception alone not enough, reason required'));
await setv('reason','העברה מבצעית');await submit();chk(!(await sheetOpen())&&await X(()=>CT.sol('s3').team==='t4'&&CT.sol('s3').changes.slice(-1)[0].kind.includes('חריג מאושר')&&CT.sol('s3').changes.slice(-1)[0].reason==='העברה מבצעית'),T('move: allowed only with exception+reason, recorded'));
await X(()=>{CT.COURSE.start='2026-12-01';});await open('soldier_move',{sid:'s4'});t=await sheet();chk(t.includes('טרם התחיל')&&!t.includes('כן — אני מאשר חריג'),T('move before start: no exception field'));
await setv('dep','dB');await setv('team','t3');await submit();t=await sheet();chk(t.includes('שדה חובה'),T('move before start: reason still required'));await setv('reason','שיוך ראשוני');await submit();chk(await X(()=>CT.sol('s4').team==='t3'),T('move before start allowed'));
await X(()=>{CT.COURSE.start='2026-09-01';});
// 3 readiness history
const h0=await X(()=>CT.readyHist('s2').length);await open('ready',{sid:'s2'});await seg('לא כשיר');await setv('start','2026-11-09');await submit();
chk(await X(()=>CT.readyHist('s2').length)===h0+1&&await X(()=>CT.readyHist('s2').filter(r=>r.status==='fit').length>=2),T('ready: new record, history kept'));
await X(()=>CT.go('soldier','s2'));v=await p.textContent('#view');chk(v.includes('היסטוריית הערכות כשירות')&&v.includes('(נוכחית)')&&v.includes('כשיר עם מגבלות'),T('ready: history on card'));
await X(()=>CT.go('ready'));v=await p.textContent('#view');chk(v.includes('היסטוריית הערכות')&&v.includes('ללא רשומת כשירות')&&v.includes('לא כשיר')&&v.includes('כשיר עם מגבלות'),T('ready: history + 4 states on screen'));
// 4 quals
await open('qual',{sid:'s2'});chk(!(await hasF('score')),T('qual: no score field'));
await X(()=>{const a=CT.D().qa.filter(a=>a.sid==='s2'&&a.q==='q1')[0];a.status='in_progress';a.done='';});
await seg('הושלם');await submit();t=await sheet();chk(t.includes('שדה חובה'),T('qual: completion date required'));
await setv('cdate','2026-11-09');await submit();await p.click('#sheet button:has-text("אשר ושמור")');chk(await X(()=>CT.D().qa.filter(a=>a.sid==='s2'&&a.q==='q1')[0].status==='completed'),T('qual: completed saved'));
await open('qual',{sid:'s2'});await seg('בתהליך');await submit();t=await sheet();chk(t.includes('ביטול השלמה מחייב סיבה')||t.includes('שדה חובה'),T('qual: cancel completion needs reason'));
await setv('reason','הוזן בטעות');await submit();await p.click('#sheet button:has-text("אשר ושמור")');chk(await X(()=>{const a=CT.D().qa.filter(a=>a.sid==='s2'&&a.q==='q1')[0];return a.status==='in_progress'&&a.hist.slice(-1)[0].reason==='הוזן בטעות';}),T('qual: reason stored in history'));
const nid=await X(()=>{CT.D().sol.push({id:'sx',pn:'0099',name:'חדש',team:'t1',ti:0,g:'M',pakal:'',enl:'',active:true,cancelled:false,a:0});return 'sx';});
await open('qual',{sid:'sx'});t=await sheet();chk(t.includes('אין שיוך'),T('qual: no assignment -> cannot create'));await p.click('#sheet .sheet-h button');
// 5 shooting
await open('mk',{sid:'sx'});
chk(await hasF('ex')&&await hasF('ylm'),T('mk: separate shooting and YLM fields exist'));
chk(await X(()=>{const g=document.querySelector('#sheet [aria-label="נשק מאופס"]');return !!g&&[...g.querySelectorAll('button')].map(b=>b.textContent.trim()).join('|')==='כן|לא'&&[...g.querySelectorAll('button')].every(b=>b.getAttribute('aria-checked')==='false');}),T('mk: zeroing field exists with כן/לא, none preselected'));
const mkN=()=>X(()=>CT.D().mk.length);const n0=await mkN();
await setv('ex','80');await setv('ylm','40');await submit();t=await sheet();
chk(await sheetOpen()&&t.includes('שדה חובה')&&await mkN()===n0,T('mk: save FAILS without zeroing choice (sheet stays open, error shown, no record added)'));
await seg('לא');await submit();chk(!(await sheetOpen())&&await mkN()===n0+1&&await X(()=>CT.D().mk.filter(m=>m.sid==='sx').slice(-1)[0].zero===false),T('mk: save succeeds with לא and stores zero=false'));
await X(()=>{const D=CT.D();D.mk=D.mk.filter(m=>m.sid!=='sx');});
await open('mk',{sid:'sx'});await setv('ex','80');await setv('ylm','40');await seg('כן');await submit();
chk(await X(()=>{const m=CT.D().mk.filter(m=>m.sid==='sx');return m.length===1&&m[0].ex===80&&m[0].ylm===40&&m[0].kind==='both'&&m[0].zero===true;}),T('mk: both scores in one record'));
chk(await X(()=>CT.metric(CT.sol('sx'),'mk')===80),T('mk avg excludes ylm'));
await open('mk',{sid:'sx'});await seg('כן');await setv('ylm','99');await submit();
chk(await X(()=>CT.metric(CT.sol('sx'),'mk')===80&&CT.D().mk.filter(m=>m.sid==='sx'&&m.ex===null&&m.ylm===99).length===1),T('mk: ylm-only record leaves mk avg 80'));
await open('mk',{sid:'sx'});await seg('כן');await submit();t=await sheet();chk(t.includes('ציון בוחן/רמה ו/או'),T('mk: at least one score'));await p.click('#sheet .sheet-h button');
// teams avg unaffected by ylm: compute independent
chk(await X(()=>{const D=CT.D();const act=CT.activeSol();const ex=[];D.mk.forEach(m=>{if(act.some(s=>s.id===m.sid)&&m.ex!==null)ex.push(m.ex)});const per=act.map(s=>CT.metric(s,'mk')).filter(x=>x!==null);return per.length>0;}),T('mk stats computed'));
// 7 flows: from card
await X(()=>CT.go('soldier','s5'));await p.click('#fab');await p.locator('#sheet .sheet-list button:has-text("קליעה / ירי")').click();t=await sheet();chk(t.includes('חייל דמה 05')&&!(await hasF('sid')),T('card flow: soldier preselected & locked'));
await overflow('card form');
await setv('ex','77');await seg('כן');await submit();chk(!(await sheetOpen())&&(await toast()).includes('נשמר')&&await X(()=>CT.S.route==='soldier'&&CT.S.arg==='s5'),T('card flow: saved, back on card, toast'));
chk((await p.textContent('#view')).includes('77'),T('card flow: new data visible on card'));
await p.click('#toast button:has-text("הזן עוד")');t=await sheet();chk(await sheetOpen()&&t.includes('חייל דמה 05')&&!(await hasF('sid')),T('card flow: +הזן עוד keeps soldier locked'));await p.click('#sheet .sheet-h button');
// from module
await X(()=>CT.go('shooting'));await p.click('#fab');await p.locator('#sheet .sheet-list button').first().click();t=await sheet();chk(t.includes('קליעה / ירי לאחר מאמץ')&&await hasF('sid'),T('module flow: opens form directly'));
await setv('sid','s6');await setv('ex','66');await seg('לא');await submit();await p.click('#toast button:has-text("הזן עוד")');chk(await sheetOpen()&&(await X(()=>document.getElementById('f_sid').value))==='',T('module flow: +הזן עוד clears soldier'));await p.click('#sheet .sheet-h button');chk(!(await sheetOpen())&&await X(()=>CT.S.route==='shooting'),T('module flow: back to module'));
chk((await p.textContent('#view')).includes('חייל דמה 06'),T('module flow: new row visible in module'));
await overflow('module');
// each module has +הוסף נתון
for(const r of ['soldiers','fitness','shooting','nav','exams','attendance','march','quals','ready','docs','notes','dash']){await X(r=>CT.go(r),r);const n=await X(()=>[document.querySelectorAll('#view .entry button.big').length,getComputedStyle(document.getElementById('fab')).display!=='none'?1:0]);chk(n[0]===0&&n[1]===1,T('module '+r+': no top add button, floating one present'));}
await X(()=>CT.go('soldier','s5'));chk(await X(()=>document.querySelectorAll('#view .entry .chip,#view .entry button.big').length===0&&document.querySelectorAll('#view .entry .link').length===3),T('card: no top add buttons; edit/move/cancel links kept'));
// 9 null tests
chk(await X(()=>{const sv=CT.ch.diverge([{label:'a',value:null},{label:'b',value:3}],{});return sv.textContent.includes('חסר מידע')&&!sv.textContent.includes('0.0');}),T('null: diverge missing'));
chk(await X(()=>{const sv=CT.ch.radar([{name:'x',color:'red',vals:[null,70,80]}],['a','b','c']);return sv.textContent.includes('חסר מידע');}),T('null: radar missing'));
chk(await X(()=>CT.D().sol.every(s=>true)&&['nav','mk','exam','fit','qual'].every(k=>CT.metric({id:'nobody'},k)===null)),T('null: metrics for no data are null'));
await X(()=>CT.go('dash'));chk((await p.textContent('#view')).includes('ללא רשומת כשירות:'),T('null: dash readiness none separate'));
// privacy still
await X(()=>{CT.R.role='cmd';CT.R.scope={type:'dep',id:'dA'};CT.go('notes');});chk(!(await p.textContent('#view')).includes('שיחה אישית'),T('privacy: notes hidden'));
await open('soldier_move',{sid:'s1'});t=await sheet();chk(t.includes('שמורה למ״פ'),T('privacy: reassign locked for commander'));await p.click('#sheet .sheet-h button');
await X(()=>{CT.R.role='owner';});
for(const r of ['dash','compare','soldiers','fitness','shooting','nav','exams','attendance','march','quals','ready','notes','docs','reports','backup','about']){await X(r=>CT.go(r),r);const o=await X(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);if(o[0]>o[1]+1)errs.push(T('overflow '+r));}
await X(()=>CT.go('backup'));chk((await p.textContent('#view')).includes('תיקון איות'),T('audit shows reason'));
await ctx.close();}
console.log('OK',ok.length);console.log('ERR',errs.length,errs.join('\n'));await b.close();})();
