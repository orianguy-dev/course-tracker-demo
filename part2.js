(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',TODAY='2026-11-09';
function h(t,a,k){var e=document.createElement(t);a=a||{};Object.keys(a).forEach(function(n){var v=a[n];if(v===null||v===undefined||v===false)return;if(n==='text')e.textContent=v;else if(n.slice(0,2)==='on')e[n]=v;else if(n==='class')e.className=v;else e.setAttribute(n,v);});(k||[]).forEach(function(c){if(c===null||c===undefined||c===false)return;e.appendChild(typeof c==='string'?document.createTextNode(c):c);});return e;}
function s(t,a,k){var e=document.createElementNS(NS,t);a=a||{};Object.keys(a).forEach(function(n){var v=a[n];if(v===null||v===undefined)return;if(n==='text')e.textContent=v;else if(n.slice(0,2)==='on')e[n]=v;else e.setAttribute(n,v);});(k||[]).forEach(function(c){if(c)e.appendChild(c);});return e;}
function $(i){return document.getElementById(i);}
function r1(x){return Math.round(x*10)/10;}function r0(x){return Math.round(x);}
function mean(a){a=a.filter(function(x){return x!==null&&x!==undefined&&!isNaN(x);});return a.length?a.reduce(function(p,c){return p+c;},0)/a.length:null;}
function fx(v,d){return v===null||v===undefined?'—':(d===0?String(r0(v)):String(r1(v)));}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function sgn(v){return (v>0?'+':v<0?'−':'')+Math.abs(r1(v));}
/* ---------- icons ---------- */
var IC={plus:'M12 5v14M5 12h14',home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',cmp:'M5 21V10M12 21V4M19 21v-8',ppl:'M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5',menu:'M4 6h16M4 12h16M4 18h16',fit:'M4 12h3l2-6 4 12 2-6h5',tgt:'M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1M12 2v4M12 18v4M2 12h4M18 12h4',nav:'M12 2l4 9-4 11-4-11zM12 8v4',book:'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',flag:'M5 21V4M5 4h11l-2 4 2 4H5',cert:'M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z',heart:'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',note:'M5 3h11l3 3v15H5zM8 9h8M8 13h8M8 17h5',doc:'M7 3h8l4 4v14H7zM15 3v4h4',rep:'M4 20V8M10 20V4M16 20v-9M22 20H2',db:'M4 6c0-2 16-2 16 0v12c0 2-16 2-16 0zM4 12c0 2 16 2 16 0M4 6c0 2 16 2 16 0',info:'M12 8h.01M11 12h1v5h1M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',bell:'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7zM10 20h4',lock:'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',x:'M6 6l12 12M18 6L6 18',back:'M9 6l6 6-6 6',users:'M3 20c0-3 3-5 6-5s6 2 6 5M9 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'};
function icon(n,sz){var v=s('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'});v.appendChild(s('path',{d:IC[n]||IC.info}));if(sz){v.style.width=sz+'px';v.style.height=sz+'px';}return v;}
/* ---------- demo data (synthetic, deterministic) ---------- */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var D,R;
var TEAMS=[{id:'t1',n:'צוות 1',d:'dA',c:'var(--t1)',m:'circle'},{id:'t2',n:'צוות 2',d:'dA',c:'var(--t2)',m:'square'},{id:'t3',n:'צוות 3',d:'dB',c:'var(--t3)',m:'diamond'},{id:'t4',n:'צוות 4',d:'dB',c:'var(--t4)',m:'triangle'}];
var DEPS=[{id:'dA',n:'מחלקה א׳'},{id:'dB',n:'מחלקה ב׳'}];
var DOM=[{k:'nav',l:'ניווט',unit:'ציון סופי (0–100)'},{k:'mk',l:'קליעה',unit:'ציון בוחן (0–100)'},{k:'exam',l:'מבחנים עיוניים',unit:'ציון (0–100)'},{k:'fit',l:'כש״ג',il:1,unit:'ציון משוקלל (המחשה)'},{k:'qual',l:'הכשרות',unit:'% הושלמו'}];
var NTYPES=[{id:'n1',n:'ניווט יום (דמה)'},{id:'n2',n:'ניווט לילה (דמה)'}];
var NDATES=['2026-09-14','2026-10-12','2026-11-02'],MDATES=['2026-09-02','2026-10-05','2026-11-04'];
var EXAMS=[{id:'e1',n:'מבחן עיוני — נהלי קשר (דמה)'},{id:'e2',n:'מבחן עיוני — עזרה ראשונה (דמה)'}];
var QDEFS=[{id:'q1',n:'הסמכת עזרה ראשונה (דמה)',t:'2026-12-01'},{id:'q2',n:'הסמכת קשר (דמה)',t:'2026-11-20'},{id:'q3',n:'הסמכת נהיגה בשטח (דמה)',t:'2027-01-15'}];
var ATYPES=[{id:'at1',n:'מסדר בוקר (דמה)'},{id:'at2',n:'הרצאה (דמה)'},{id:'at3',n:'אימון (דמה)'}];
var STATUS={fit:'כשיר',fit_with_restrictions:'כשיר עם מגבלות',unfit:'לא כשיר'},QL={pending:'טרם החל',in_progress:'בתהליך',completed:'הושלם'};
function seed(){
 var r=rng(20261109),g=function(){return (r()+r()+r()-1.5)/1.5;};
 var base={nav:[78,66,82,56],mk:[70,84,80,62],exam:[74,80,86,66],fit:[82,72,88,64]},dl=[1,-3,3,9],qp=[.62,.45,.78,.3];
 D={sol:[],nav:[],mk:[],att:[],fit:[],qa:[],readyAll:[],ready:[],events:[],att2:[],marches:[],notes:[],docs:[],assess:[],follow:[],reports:[{at:'2026-11-03 09:12',fmt:'xlsx',rows:96},{at:'2026-10-27 08:40',fmt:'pdf',rows:48}],backups:[{id:'bk3',at:'2026-11-09 02:00',kind:'daily'},{id:'bk2',at:'2026-11-08 02:00',kind:'daily'},{id:'bk1',at:'2026-11-05 14:31',kind:'manual'}],audit:[{at:'2026-11-09 02:00',actor:'system',action:'BACKUP_CREATE'},{at:'2026-11-05 14:31',actor:'מנהל (מ״פ)',action:'BACKUP_CREATE'},{at:'2026-11-03 09:12',actor:'מנהל (מ״פ)',action:'REPORT_GENERATE'}],next:5000};
 var gend=['M','M','F','M','M','M'];
 for(var i=0;i<24;i++){var t=Math.floor(i/6),k=i%6,id='s'+(i+1);var a=g()*9;
  D.sol.push({id:id,pn:'00123'+(i<9?'0':'')+(i+1),name:'חייל דמה '+(i<9?'0':'')+(i+1),team:TEAMS[t].id,ti:t,g:gend[k],pakal:'0'+(100+i),enl:'2026-0'+(1+i%3)+'-1'+(i%9),active:i!==19,cancelled:i===23,soc:['עליון','אמצעי','תחתון'][i%3],note:i===4?'מתאים לתפקיד מפקד כיתה בהמשך':'',a:a});
  var S=D.sol[i];if(S.cancelled)continue;
  for(var j=0;j<3;j++){if(j===0&&r()<.1)continue;var tg=clamp(base.nav[t]+dl[t]*j+a+g()*7,38,97),plan=clamp(Math.round((2.4+tg/40+g()*.6)*2)/2,1,5),deb=clamp(Math.round((2.4+tg/40+g()*.6)*2)/2,1,5),pts=clamp(Math.round((tg-plan-deb)/9),2,10);
   D.nav.push({id:'nr'+(D.next++),sid:id,date:NDATES[j],type:j===1?'n2':'n1',km:j===1?10:8,plan:plan,deb:deb,done:pts,total:10,notes:'',by:'מנהל (מ״פ)',j:j});}
  for(j=0;j<3;j++){var ex=clamp(Math.round(base.mk[t]+(j-1)*(t===3?4:1)+a+g()*6),40,98);D.mk.push({id:'m'+(D.next++),sid:id,date:MDATES[j],weapon:'M16 (דמה)',dist:100,ex:ex,ylm:r()<.75?clamp(ex-9+Math.round(g()*7),30,95):null,zero:ex>55,j:j,kind:'regular'});}
  EXAMS.forEach(function(E,ei){var A=clamp(Math.round(base.exam[t]+a+g()*9+ei*2),40,99);D.att.push({id:'a'+(D.next++),sid:id,exam:E.id,att:'A',date:ei?'2026-10-02':'2026-09-10',score:A});
   if(A<80){var B=clamp(A+Math.round(5+r()*15),A+1,98);D.att.push({id:'a'+(D.next++),sid:id,exam:E.id,att:'B',date:ei?'2026-10-16':'2026-09-24',score:B});if(B<80){var C=clamp(B+Math.round(4+r()*14),B+1,98);D.att.push({id:'a'+(D.next++),sid:id,exam:E.id,att:'C',date:ei?'2026-10-30':'2026-10-08',score:C});}}});
  var fit=clamp(Math.round(base.fit[t]+a+g()*6),40,98);D.fit.push({id:'f'+(D.next++),sid:id,date:'2026-08-2'+(1+i%3),type:'regular',variant:'',pull:r0(3+fit*.13+g()*2),par:r0(6+fit*.2+g()*3),trap:r0(8+fit*.17+g()*3),r150:r0(150-fit*.5+g()*5),r3:r0(930-fit*2+g()*18),il:fit});
  QDEFS.forEach(function(q,qi){if(qi===2&&i%4!==0)return;var x=r(),st=x<qp[t]?'completed':(x<qp[t]+.28?'in_progress':'pending');D.qa.push({id:'qa'+(D.next++),sid:id,q:q.id,status:st,done:st==='completed'?'2026-10-'+(10+i%18):''});});
 }
 function rr(sid,st,restr,start,next,by){D.readyAll.push({id:'r'+(D.next++),sid:sid,status:st,restr:restr,start:start,next:next,by:by||'מ״פ (מנהל)',at:start});}
 [['s5','fit_with_restrictions','ללא ריצה מעל 3 ק״מ','2026-10-20','2026-11-20'],['s9','unfit','פטור זמני מפעילות גופנית','2026-11-01','2026-11-15'],['s14','fit_with_restrictions','ללא נשיאת אלונקה','2026-10-10','2026-11-12'],['s21','fit_with_restrictions','ללא קפיצות','2026-10-25','2026-11-18']].forEach(function(x){rr(x[0],'fit','','2026-09-01','');rr(x[0],x[1],x[2],x[3],x[4]);});
 rr('s2','fit','','2026-09-01','');rr('s2','fit_with_restrictions','ללא נשיאת משקל','2026-10-05','2026-10-28');rr('s2','fit','','2026-10-30','');
 D.sol.forEach(function(S){if(!S.cancelled&&!D.readyAll.some(function(x){return x.sid===S.id;}))if(S.id!=='s7'&&S.id!=='s16')rr(S.id,'fit','','2026-09-01','');});
 D.readyAll.forEach(function(r,i){r.n=i+1;});D.ready=curReady(D.readyAll);
 D.mk.forEach(function(m){m.kind=m.ylm!==null&&m.ex!==null?'both':'regular';});
 ['2026-10-26','2026-10-27','2026-10-28','2026-11-02','2026-11-03','2026-11-05'].forEach(function(d,i){var ab=[];D.sol.forEach(function(S){if(!S.cancelled&&r()<[.05,.12,.04,.18][S.ti])ab.push(S.id);});D.att2.push({id:'ev'+(D.next++),date:d,type:ATYPES[i%3].id,absent:ab,early:i===1?['s2']:[]});});
 [['2026-09-28','מסלול דמה צפון',10,2],['2026-10-19','מסלול דמה מזרח',12,3],['2026-11-05','מסלול דמה דרום',15,4]].forEach(function(m,i){D.marches.push({id:'ma'+i,date:m[0],loc:m[1],km0:m[2],km1:m[3],absent:i===1?['s9']:[]});});
 D.events=[{id:'x1',sid:'s3',date:'2026-10-30',type:'הישג',desc:'מצטיין שבוע ניווט'},{id:'x2',sid:'s8',date:'2026-10-14',type:'הישג',desc:'ציון ניווט לילה גבוה'},{id:'x3',sid:'s9',date:'2026-10-21',type:'אירוע',desc:'איחור למסדר בוקר'},{id:'x4',sid:'s15',date:'2026-11-03',type:'הישג',desc:'שיפור משמעותי בקליעה'}];
 D.notes=[{id:'pn1',sid:'s5',kind:'הערה פרטית',date:'2026-10-22',text:'שיחה אישית — נראה מתאמץ; לעקוב בשבועות הקרובים (טקסט דמה).'},{id:'pn2',sid:'s12',kind:'מעקב אישי',date:'2026-11-01',text:'לבדוק התקדמות בניווט לילה (טקסט דמה).'},{id:'pn3',sid:'s18',kind:'הערכת מפקד',date:'2026-10-29',text:'מוביל בצוות, תקשורת טובה (טקסט דמה).'}];
 D.docs=[{id:'dc1',sid:'s5',name:'אישור-רפואי-דמה.pdf',type:'אישור',date:'2026-10-20',by:'מנהל (מ״פ)'},{id:'dc2',sid:'s9',name:'פטור-זמני-דמה.pdf',type:'כשירות',date:'2026-11-01',by:'מנהל (מ״פ)'},{id:'dc3',sid:'s3',name:'תעודת-הצטיינות-דמה.pdf',type:'הישג',date:'2026-10-30',by:'מנהל (מ״פ)'}];
}
seed();
/* ---------- lookups / aggregations ---------- */
function sol(id){return D.sol.filter(function(x){return x.id===id;})[0];}
function team(id){return TEAMS.filter(function(x){return x.id===id;})[0];}
function dep(id){return DEPS.filter(function(x){return x.id===id;})[0];}
function liveSol(){return D.sol.filter(function(x){return !x.cancelled&&inRole(x);});}
function activeSol(){return D.sol.filter(function(x){return !x.cancelled&&x.active&&inRole(x);});}
var COURSE={start:'2026-09-01'};
function curReady(all){var cur={};all.slice().sort(function(a,b){return a.start===b.start?a.n-b.n:(a.start<b.start?-1:1);}).forEach(function(r){cur[r.sid]=r;});return Object.keys(cur).map(function(k){return cur[k];});}
function readyHist(sid){return D.readyAll.filter(function(r){return r.sid===sid;}).sort(function(a,b){return a.start===b.start?b.n-a.n:(a.start<b.start?1:-1);});}
function readyAdd(rec){rec.n=D.readyAll.length+1+Math.floor(D.next);D.next++;D.readyAll.push(rec);D.ready=curReady(D.readyAll);}
var F={dep:'',team:''};
var R={role:'owner',scope:{type:'dep',id:'dA'}};
function inRole(x){if(R.role==='owner')return true;var sc=R.scope;return sc.type==='team'?x.team===sc.id:team(x.team).d===sc.id;}
function allSol(){return D.sol.filter(inRole);}
function visibleDeps(){return DEPS.filter(function(d){return R.role==='owner'||(R.scope.type==='dep'?R.scope.id===d.id:team(R.scope.id).d===d.id);});}
function roleTeams(){return TEAMS.filter(function(t){return R.role==='owner'||(R.scope.type==='team'?t.id===R.scope.id:t.d===R.scope.id);});}
function scopeLabel(){return R.role==='owner'?'כל הקורס':(R.scope.type==='team'?team(R.scope.id).n:dep(R.scope.id).n);}
function scopeSol(){return activeSol().filter(function(x){return (!F.dep||team(x.team).d===F.dep)&&(!F.team||x.team===F.team);});}
function navFinal(r){var p=90*r.done/r.total;return r.plan+r.deb+p;}
function navParts(r){return{plan:r.plan,deb:r.deb,pts:90*r.done/r.total};}
function mine(arr,id){return arr.filter(function(x){return x.sid===id;});}
function latestExam(id){var by={};mine(D.att,id).forEach(function(a){var c=by[a.exam];if(!c||a.att>c.att)by[a.exam]=a;});return Object.keys(by).map(function(k){return by[k].score;});}
function metric(S,k){
 if(k==='nav')return mean(mine(D.nav,S.id).map(navFinal));
 if(k==='mk')return mean(mine(D.mk,S.id).map(function(x){return x.ex;}));
 if(k==='exam')return mean(latestExam(S.id));
 if(k==='fit'){return mean(mine(D.fit,S.id).map(function(f){return f.il;}));}
 if(k==='qual'){var q=mine(D.qa,S.id);return q.length?100*q.filter(function(x){return x.status==='completed';}).length/q.length:null;}
 return null;}
function stat(list,k){var v=list.map(function(S){return metric(S,k);}).filter(function(x){return x!==null;});return{m:mean(v),n:v.length,total:list.length,v:v};}
function teamStat(tid,k){return stat(activeSol().filter(function(x){return x.team===tid;}),k);}
function visibleTeams(){return roleTeams().filter(function(t){return (!F.dep||t.d===F.dep)&&(!F.team||t.id===F.team);});}
function courseMean(k){return stat(scopeSol(),k).m;}
function isLast(arr,x){return arr[arr.length-1]===x;}
function dates(recs,key){var u={};recs.forEach(function(r){u[r[key||'date']]=1;});return Object.keys(u).sort();}
window.CT={COURSE:COURSE,curReady:curReady,readyHist:readyHist,readyAdd:readyAdd,R:R,inRole:inRole,allSol:allSol,visibleDeps:visibleDeps,roleTeams:roleTeams,scopeLabel:scopeLabel,dates:dates,h:h,s:s,$:$,r1:r1,r0:r0,mean:mean,fx:fx,clamp:clamp,sgn:sgn,icon:icon,IC:IC,D:function(){return D;},reseed:seed,setD:function(x){D=x;},TEAMS:TEAMS,DEPS:DEPS,DOM:DOM,NTYPES:NTYPES,NDATES:NDATES,MDATES:MDATES,EXAMS:EXAMS,QDEFS:QDEFS,ATYPES:ATYPES,STATUS:STATUS,QL:QL,sol:sol,team:team,dep:dep,liveSol:liveSol,activeSol:activeSol,F:F,scopeSol:scopeSol,navFinal:navFinal,navParts:navParts,mine:mine,metric:metric,stat:stat,teamStat:teamStat,visibleTeams:visibleTeams,courseMean:courseMean,TODAY:TODAY,latestExam:latestExam};
})();
