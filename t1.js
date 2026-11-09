const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const [name,vp] of [['m',{width:390,height:844}],['d',{width:1280,height:900}]]){
 const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,locale:'he-IL'});const p=await ctx.newPage();
 p.on('pageerror',e=>errs.push(name+' PE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(name+' CE '+m.text())});
 await p.goto('file:///home/claude/demo2/index.html');await p.waitForTimeout(500);
 const routes=['dash','compare','soldiers','fitness','shooting','nav','exams','attendance','marches','quals','ready','notes','docs','reports','backup','about'];
 for(const r of routes){await p.evaluate(r=>CT.go(r),r);await p.waitForTimeout(60);
  const o=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,h:document.getElementById('view').children.length}));
  if(o.sw>o.cw+1)errs.push(name+' overflow '+r+' '+o.sw+'>'+o.cw);
  await p.screenshot({path:`/tmp/shots/${name}_${r}.png`,fullPage:true});}
 await p.evaluate(()=>CT.go('soldier','s3'));await p.screenshot({path:`/tmp/shots/${name}_soldier.png`,fullPage:true});
 const o=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));if(o.sw>o.cw+1)errs.push(name+' overflow soldier');
 await ctx.close();}
console.log(errs.length?errs.join('\n'):'NO ERRORS');await b.close();})();
