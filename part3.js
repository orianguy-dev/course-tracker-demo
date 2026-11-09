(function(){
'use strict';
var C=CT,h=C.h,s=C.s,$=C.$,r1=C.r1,r0=C.r0,fx=C.fx,clamp=C.clamp,mean=C.mean;
/* ---------- chart primitives ---------- */
function svgc(w,hh,label){return s('svg',{viewBox:'0 0 '+w+' '+hh,'class':'ch',role:'img','aria-label':label||''});}
function mkc(el,fn,label){if(!fn)return el;el.setAttribute('tabindex','0');el.setAttribute('role','button');if(label)el.setAttribute('aria-label',label);el.setAttribute('class',((el.getAttribute('class')||'')+' clk').trim());el.onclick=fn;el.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}};return el;}
function txt(x,y,t,o){o=o||{};return s('text',{x:x,y:y,'font-size':o.sz||11,'text-anchor':o.a||'middle','font-weight':o.w||400,fill:o.f||null,'dominant-baseline':o.b||null,text:t});}
function line(x1,y1,x2,y2,c,dash,w){return s('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:c||'var(--grid)','stroke-width':w||1,'stroke-dasharray':dash||null});}
function marker(shape,cx,cy,r,fill,stroke){var a={fill:fill,stroke:stroke||'var(--paper)','stroke-width':1.5};
 if(shape==='square'){a.x=cx-r;a.y=cy-r;a.width=2*r;a.height=2*r;a.rx=2;return s('rect',a);}
 if(shape==='diamond'){a.points=[cx,cy-r*1.25,cx+r*1.25,cy,cx,cy+r*1.25,cx-r*1.25,cy].join(',');return s('polygon',a);}
 if(shape==='triangle'){a.points=[cx,cy-r*1.2,cx+r*1.15,cy+r*.9,cx-r*1.15,cy+r*.9].join(',');return s('polygon',a);}
 a.cx=cx;a.cy=cy;a.r=r;return s('circle',a);}
function niceRange(vals,pad,lo,hi){var a=Math.min.apply(null,vals),b=Math.max.apply(null,vals);a=Math.floor((a-pad)/5)*5;b=Math.ceil((b+pad)/5)*5;if(lo!==undefined)a=Math.max(lo,a);if(hi!==undefined)b=Math.min(hi,b);if(b-a<10)b=a+10;return[a,b];}
/* vertical bars. items [{label,value,color,shape,fn,sub}] ; RTL order (first at right) */
function vbars(items,o){o=o||{};var W=340,H=o.h||200,pr=34,pl=8,pt=18,pb=o.pb||38,min=o.min===undefined?0:o.min,max=o.max||100;var v=svgc(W,H,o.label||'גרף עמודות');
 var ih=H-pt-pb,y=function(x){return pt+ih-(clamp(x,min,max)-min)/(max-min)*ih;};
 var ticks=o.ticks||[min,(min+max)/2,max];ticks.forEach(function(t){v.appendChild(line(pl,y(t),W-pr+4,y(t)));v.appendChild(txt(W-pr+8,y(t)+3,r0(t),{a:'start',sz:10,f:'var(--muted)'}));});
 var n=items.length,bw=(W-pr-pl)/n,w=Math.min(bw*.56,46);
 items.forEach(function(it,i){var cx=W-pr-(i+.5)*bw,g=s('g');
  if(it.value===null||it.value===undefined){g.appendChild(txt(cx,y(min)-6,'אין נתונים',{sz:10,f:'var(--muted)'}));}
  else{g.appendChild(s('rect',{x:cx-w/2,y:y(it.value),width:w,height:Math.max(1,y(min)-y(it.value)),rx:4,fill:it.color||'var(--ink)','class':'fo'}));
   g.appendChild(txt(cx,y(it.value)-5,fx(it.value,o.d===undefined?1:o.d),{sz:11,w:700,f:'var(--ink)'}));}
  g.appendChild(txt(cx,H-pb+15,it.label,{sz:11,f:'var(--ink)'}));if(it.sub)g.appendChild(txt(cx,H-pb+28,it.sub,{sz:9.5,f:'var(--muted)'}));
  v.appendChild(mkc(g,it.fn,it.label+': '+fx(it.value)));});
 if(o.ref!==null&&o.ref!==undefined){v.appendChild(line(pl,y(o.ref),W-pr+4,y(o.ref),'var(--red)','4 3',1.4));v.appendChild(txt(pl+2,9,'- - ממוצע '+fx(o.ref),{a:'start',sz:10,f:'var(--red)',w:500}));}
 return v;}
/* grouped bars: cats=[{label,fn}], series=[{name,color,vals[]}] */
function gbars(cats,series,o){o=o||{};var W=340,H=o.h||210,pr=34,pl=8,pt=14,pb=34,min=o.min===undefined?40:o.min,max=o.max||100;var v=svgc(W,H,o.label||'עמודות מקובצות');
 var ih=H-pt-pb,y=function(x){return pt+ih-(clamp(x,min,max)-min)/(max-min)*ih;};
 [min,(min+max)/2,max].forEach(function(t){v.appendChild(line(pl,y(t),W-pr+4,y(t)));v.appendChild(txt(W-pr+8,y(t)+3,r0(t),{a:'start',sz:10,f:'var(--muted)'}));});
 var n=cats.length,bw=(W-pr-pl)/n,k=series.length,w=Math.min((bw-8)/k,24);
 cats.forEach(function(c,i){var cx=W-pr-(i+.5)*bw,g=s('g');
  series.forEach(function(se,j){var val=se.vals[i],x=cx+(j-(k-1)/2)*-w;if(val===null||val===undefined)return;g.appendChild(s('rect',{x:x-w/2+1,y:y(val),width:w-2,height:Math.max(1,y(min)-y(val)),rx:3,fill:se.color,'class':'fo'}));if(o.vals!==false&&k<=3)g.appendChild(txt(x,y(val)-4,r0(val),{sz:9.5,f:'var(--ink)',w:600}));});
  g.appendChild(txt(cx,H-pb+15,c.label,{sz:11,f:'var(--ink)'}));v.appendChild(mkc(g,c.fn,c.label));});
 return v;}
/* horizontal bars: items [{label,value,color,fn,note}] */
function hbars(items,o){o=o||{};var W=340,rh=o.rh||30,H=items.length*rh+8,lw=o.lw||98,min=o.min===undefined?0:o.min,max=o.max||100;var v=svgc(W,H,o.label||'גרף אופקי');var bx=W-lw-4,bl=44;
 items.forEach(function(it,i){var y0=4+i*rh,g=s('g');g.appendChild(s('rect',{x:0,y:y0,width:W,height:rh-2,fill:'transparent'}));
  g.appendChild(txt(W-2,y0+rh/2+3,it.label,{a:'end',sz:11.5,f:'var(--ink)'}));
  g.appendChild(s('rect',{x:bl,y:y0+rh/2-5,width:bx-bl,height:10,rx:5,fill:'var(--line2)'}));
  if(it.value===null||it.value===undefined)g.appendChild(txt(bx-4,y0+rh/2+3,'אין נתונים',{a:'end',sz:10,f:'var(--muted)'}));
  else{var wv=(clamp(it.value,min,max)-min)/(max-min)*(bx-bl);g.appendChild(s('rect',{x:bx-wv,y:y0+rh/2-5,width:Math.max(2,wv),height:10,rx:5,fill:it.color||'var(--ink)','class':'fo'}));g.appendChild(txt(bl-4,y0+rh/2+4,(o.fmt?o.fmt(it.value):fx(it.value)),{a:'end',sz:11.5,w:700,f:'var(--ink)'}));}
  v.appendChild(mkc(g,it.fn,it.label));});return v;}
/* diverging bars (gap from reference) items [{label,value(delta),fn,color}] */
function diverge(items,o){o=o||{};var W=340,rh=30,H=items.length*rh+22,mid=(W+70)/2-30,half=110;var mx=Math.max.apply(null,items.filter(function(i){return i.value!==null&&i.value!==undefined;}).map(function(i){return Math.abs(i.value);}).concat([1]));var v=svgc(W,H,o.label||'פער מהממוצע');
 v.appendChild(line(mid,6,mid,H-14,'var(--ink2)'));
 items.forEach(function(it,i){var y0=6+i*rh,g=s('g');g.appendChild(s('rect',{x:0,y:y0,width:W,height:rh-2,fill:'transparent'}));
  g.appendChild(txt(W-2,y0+rh/2+3,it.label,{a:'end',sz:11.5,f:'var(--ink)'}));
  if(it.value===null||it.value===undefined){g.appendChild(txt(mid,y0+rh/2+4,'חסר מידע — לא נכלל',{sz:10.5,f:'var(--muted)'}));v.appendChild(mkc(g,it.fn,it.label+': חסר מידע'));return;}
  var d=it.value,w=Math.abs(d)/mx*half,pos=d>=0;
  g.appendChild(s('rect',{x:pos?mid:mid-w,y:y0+6,width:Math.max(1.5,w),height:rh-14,rx:3,fill:pos?'var(--good)':'var(--bad)','class':'fo'}));
  g.appendChild(txt(pos?mid+w+4:mid-w-4,y0+rh/2+4,(pos?'▲ ':d<0?'▼ ':'')+C.sgn(d),{a:pos?'start':'end',sz:11,w:700,f:pos?'var(--good)':'var(--bad)'}));
  v.appendChild(mkc(g,it.fn,it.label));});
 v.appendChild(txt(mid,H-2,'ממוצע '+(o.refLabel||''),{sz:10,f:'var(--muted)'}));return v;}
/* scatter: pts [{x,y,color,shape,r,label,fn,big}] */
function scatter(pts,o){var W=340,H=290,pl=34,pr=14,pt=14,pb=34,v=svgc(W,H,o.label||'גרף פיזור');
 var xs=pts.map(function(p){return p.x;}),ys=pts.map(function(p){return p.y;});var xr=niceRange(xs,2,0,100),yr=niceRange(ys,2,0,100);
 var X=function(x){return pl+(x-xr[0])/(xr[1]-xr[0])*(W-pl-pr);},Y=function(y){return pt+(1-(y-yr[0])/(yr[1]-yr[0]))*(H-pt-pb);};
 [0,.5,1].forEach(function(f){var xv=xr[0]+f*(xr[1]-xr[0]),yv=yr[0]+f*(yr[1]-yr[0]);v.appendChild(line(pl,Y(yv),W-pr,Y(yv)));v.appendChild(line(X(xv),pt,X(xv),H-pb));v.appendChild(txt(pl-4,Y(yv)+3,r0(yv),{a:'end',sz:10,f:'var(--muted)'}));v.appendChild(txt(X(xv),H-pb+13,r0(xv),{sz:10,f:'var(--muted)'}));});
 if(o.xm!==null&&o.xm!==undefined){v.appendChild(line(X(o.xm),pt,X(o.xm),H-pb,'var(--red)','4 3',1.2));}
 if(o.ym!==null&&o.ym!==undefined){v.appendChild(line(pl,Y(o.ym),W-pr,Y(o.ym),'var(--red)','4 3',1.2));}
 if(o.quad){v.appendChild(txt(W-pr-2,pt+10,'גבוה בשניהם',{a:'end',sz:10,f:'var(--good)',w:700}));v.appendChild(txt(pl+4,H-pb-6,'נמוך בשניהם',{a:'start',sz:10,f:'var(--bad)',w:700}));v.appendChild(txt(pl+4,pt+10,'פער: '+o.yl+' > '+o.xl,{a:'start',sz:9.5,f:'var(--muted)'}));v.appendChild(txt(W-pr-2,H-pb-6,'פער: '+o.xl+' > '+o.yl,{a:'end',sz:9.5,f:'var(--muted)'}));}
 v.appendChild(txt((W+pl)/2,H-2,o.xl+' →',{sz:11,f:'var(--ink)',w:500}));var yl=txt(0,0,'↑ '+o.yl,{sz:11,f:'var(--ink)',w:500});yl.setAttribute('transform','translate(9,'+(H/2)+') rotate(-90)');v.appendChild(yl);
 pts.filter(function(p){return !p.big;}).concat(pts.filter(function(p){return p.big;})).forEach(function(p){var g=s('g');if(p.big){g.appendChild(marker(p.shape,X(p.x),Y(p.y),p.r||9,p.color,'var(--paper)'));g.appendChild(txt(X(p.x),Y(p.y)-(p.r||9)-5,p.label,{sz:10.5,w:700,f:'var(--ink)'}));}else{var m=marker(p.shape,X(p.x),Y(p.y),p.r||4.5,p.color);m.setAttribute('opacity','.55');g.appendChild(m);}
  g.appendChild(s('circle',{cx:X(p.x),cy:Y(p.y),r:14,fill:'transparent'}));v.appendChild(mkc(g,p.fn,p.label));});
 return v;}
/* radar: series [{name,color,vals,dash,w}], axes [labels] */
function radar(series,axes,o){o=o||{};var W=340,H=o.h||270,cx=W/2,cy=H/2+4,R=o.R||88,rmin=o.min===undefined?40:o.min,n=axes.length;var v=svgc(W,H,o.label||'גרף מכ״ם');
 var P=function(i,val){var a=-Math.PI/2-i*2*Math.PI/n,rr=(clamp(val,rmin,100)-rmin)/(100-rmin)*R;return[cx+rr*Math.cos(a),cy+rr*Math.sin(a)];};
 [rmin,(rmin+100)/2,100].forEach(function(t,k){var pts=[];for(var i=0;i<n;i++)pts.push(P(i,t).join(','));v.appendChild(s('polygon',{points:pts.join(' '),fill:'none',stroke:'var(--grid)','stroke-width':1}));if(k)v.appendChild(txt(cx+3,P(0,t)[1]-2,r0(t),{a:'start',sz:9,f:'var(--muted)'}));});
 for(var i=0;i<n;i++){var e=P(i,100);v.appendChild(line(cx,cy,e[0],e[1]));var a=-Math.PI/2-i*2*Math.PI/n,lx=cx+(R+14)*Math.cos(a),ly=cy+(R+14)*Math.sin(a);v.appendChild(txt(lx,ly+3,axes[i],{a:Math.abs(Math.cos(a))<.2?'middle':(Math.cos(a)>0?'start':'end'),sz:11,f:'var(--ink)'}));}
 var miss=[];
 series.forEach(function(se){var pts=[],gap=false;for(var i=0;i<n;i++){var val=se.vals[i];if(val===null||val===undefined){gap=true;if(!se.dash)miss.push((se.name||'')+': '+axes[i]);continue;}pts.push(P(i,val).join(','));}
  if(pts.length>1)v.appendChild(s(gap?'polyline':'polygon',{points:pts.join(' '),fill:(se.dash||gap)?'none':se.color,'fill-opacity':(se.dash||gap)?0:.13,stroke:se.color,'stroke-width':se.w||2,'stroke-dasharray':se.dash||(gap?'2 3':null),'stroke-linejoin':'round'}));
  if(!se.dash)se.vals.forEach(function(val,i){if(val===null||val===undefined)return;var p=P(i,val);v.appendChild(marker(se.shape||'circle',p[0],p[1],3,se.color));});});
 if(miss.length)v.appendChild(txt(W/2,H-4,'חסר מידע (לא מצויר כאפס): '+miss.slice(0,3).join(' · ')+(miss.length>3?' …':''),{sz:9.5,f:'var(--muted)'}));
 return v;}
/* line chart: series [{name,color,shape,vals[],fn(i)}], xl labels (first = oldest, drawn at RIGHT) */
function lines(series,xl,o){o=o||{};var W=340,H=o.h||210,pl=14,pr=34,pt=16,pb=28;var v=svgc(W,H,o.label||'מגמה');var all=[];series.forEach(function(se){se.vals.forEach(function(x){if(x!==null&&x!==undefined)all.push(x);});});var yr=niceRange(all,3,0,100);
 var n=xl.length,X=function(i){return n===1?(W-pr+pl)/2:W-pr-i*(W-pr-pl-18)/(n-1)-0;},Y=function(y){return pt+(1-(y-yr[0])/(yr[1]-yr[0]))*(H-pt-pb);};
 [yr[0],(yr[0]+yr[1])/2,yr[1]].forEach(function(t){v.appendChild(line(pl,Y(t),W-pr+4,Y(t)));v.appendChild(txt(W-pr+8,Y(t)+3,r0(t),{a:'start',sz:10,f:'var(--muted)'}));});
 xl.forEach(function(l,i){v.appendChild(txt(X(i),H-10,l,{sz:10.5,f:'var(--ink)'}));});
 series.forEach(function(se){var pts=[];se.vals.forEach(function(val,i){if(val!==null&&val!==undefined)pts.push([X(i),Y(val),i,val]);});
  v.appendChild(s('polyline',{points:pts.map(function(p){return p[0]+','+p[1];}).join(' '),fill:'none',stroke:se.color,'stroke-width':se.w||2.4,'stroke-linejoin':'round','stroke-linecap':'round','stroke-dasharray':se.dash||null}));
  pts.forEach(function(p){var g=s('g');g.appendChild(marker(se.shape||'circle',p[0],p[1],4.5,se.color));g.appendChild(s('circle',{cx:p[0],cy:p[1],r:10,fill:'transparent'}));if(o.labels)g.appendChild(txt(p[0],p[1]-9,r0(p[3]),{sz:9.5,w:600,f:'var(--ink)'}));v.appendChild(mkc(g,se.fn?function(){se.fn(p[2]);}:null,se.name+' '+xl[p[2]]+': '+r1(p[3])));});});
 return v;}
function donut(parts,o){o=o||{};var W=150,r=52,c=2*Math.PI*r,tot=parts.reduce(function(a,p){return a+p.v;},0)||1,off=0;var v=svgc(W,W,o.label||'התפלגות');v.style.maxWidth='170px';
 v.appendChild(s('circle',{cx:75,cy:75,r:r,fill:'none',stroke:'var(--line2)','stroke-width':18}));
 parts.forEach(function(p){var len=p.v/tot*c;if(len<=0)return;var g=s('circle',{cx:75,cy:75,r:r,fill:'none',stroke:p.color,'stroke-width':18,'stroke-dasharray':len+' '+(c-len),'stroke-dashoffset':-off,transform:'rotate(-90 75 75)'});off+=len;v.appendChild(mkc(g,p.fn,p.label+' '+p.v));});
 v.appendChild(txt(75,74,String(o.center===undefined?tot:o.center),{sz:26,w:800,f:'var(--ink)'}));v.appendChild(txt(75,92,o.cl||'',{sz:10.5,f:'var(--muted)'}));return v;}
function spark(vals,color,w,hh){w=w||90;hh=hh||26;var v=s('svg',{viewBox:'0 0 '+w+' '+hh,width:w,height:hh,'aria-hidden':'true'});var a=vals.filter(function(x){return x!==null;});if(a.length<2)return v;var lo=Math.min.apply(null,a),hi=Math.max.apply(null,a);if(hi===lo){hi+=1;lo-=1;}var n=vals.length;v.appendChild(s('polyline',{points:vals.map(function(x,i){return x===null?null:(w-3-i*(w-6)/(n-1))+','+(hh-3-(x-lo)/(hi-lo)*(hh-6));}).filter(Boolean).join(' '),fill:'none',stroke:color,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'}));return v;}
C.ch={vbars:vbars,gbars:gbars,hbars:hbars,diverge:diverge,scatter:scatter,radar:radar,lines:lines,donut:donut,spark:spark};
})();
