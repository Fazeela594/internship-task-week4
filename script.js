const CATS=["Web Development","Mobile Apps","Data & AI","Design","Writing","Marketing"];
const SEED=[
{id:1,title:"Build a React dashboard for a logistics startup",cat:"Web Development",min:400,max:700,skills:["React","JavaScript","CSS"],desc:"We need a clean admin dashboard showing shipments, delays and driver status.\nYou will turn our Figma file into a responsive React app with charts and filters.",days:2,props:7},
{id:2,title:"Flutter app for a local bakery's orders",cat:"Mobile Apps",min:300,max:500,skills:["Flutter","Dart","Firebase"],desc:"A simple ordering app: menu, cart, order history and push notifications.\nAndroid first, iOS later.",days:1,props:12},
{id:3,title:"Clean and analyse sales data in Python",cat:"Data & AI",min:150,max:300,skills:["Python","Pandas","SQL"],desc:"We have 3 years of messy CSV exports. Clean them, find monthly trends and deliver a short report with charts.",days:4,props:5},
{id:4,title:"Logo and brand kit for a coffee roastery",cat:"Design",min:200,max:350,skills:["Illustrator","Branding"],desc:"Looking for a logo, colour palette and two label designs for our new product line.",days:6,props:18},
{id:5,title:"Flask REST API for a student portal",cat:"Web Development",min:250,max:450,skills:["Python","Flask","PostgreSQL"],desc:"Create authentication, course enrolment and grade endpoints with documentation.\nTests are a bonus.",days:3,props:9},
{id:6,title:"Write 10 SEO blog posts about home solar",cat:"Writing",min:100,max:220,skills:["SEO","Copywriting"],desc:"800 words each, researched and original. We provide keywords and outlines.",days:8,props:21},
{id:7,title:"Social media plan for a fitness studio",cat:"Marketing",min:120,max:260,skills:["Instagram","Content Strategy"],desc:"A 30-day content calendar with post ideas, captions and posting times.",days:5,props:6},
{id:8,title:"ML model to predict customer churn",cat:"Data & AI",min:500,max:900,skills:["Python","scikit-learn","Machine Learning"],desc:"Build and evaluate a churn model on our subscription data and explain which features matter most.",days:2,props:4}
];
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
let jobs=load("fh_jobs",SEED), proposals=load("fh_props",[]);
let F={q:"",cat:"All",sort:"new",budget:"any",skill:""};
let simulateError=false;

const ago=d=>d===0?"Today":d===1?"1 day ago":d+" days ago";
const dayOf=j=>j.days;
function jobCard(j){
  const applied=proposals.some(p=>p.jobId===j.id&&p.status!=="withdrawn");
  return `<article class="card" tabindex="0" data-id="${j.id}" aria-label="${esc(j.title)}">
    <div class="meta"><span>${esc(j.cat)}</span><span>Posted ${ago(dayOf(j))}</span></div>
    <h3>${esc(j.title)}</h3>
    <div class="budget">$${j.min} – $${j.max}</div>
    <p class="desc">${esc(j.desc)}</p>
    <div class="skills">${j.skills.map(s=>`<span class="skill">${esc(s)}</span>`).join("")}</div>
    <div class="foot"><span class="meta">${j.props} proposals</span>
    ${applied?'<span class="tag t-pending">Applied</span>':`<button class="btn" data-apply="${j.id}">Apply</button>`}</div></article>`;
}
function filtered(){
  let r=jobs.filter(j=>{
    const t=(j.title+" "+j.desc+" "+j.skills.join(" ")).toLowerCase();
    if(F.q&&!t.includes(F.q.toLowerCase()))return false;
    if(F.cat!=="All"&&j.cat!==F.cat)return false;
    if(F.budget==="low"&&j.max>=300)return false;
    if(F.budget==="mid"&&(j.max<300||j.max>600))return false;
    if(F.budget==="high"&&j.max<=600)return false;
    return true;});
  const s={new:(a,b)=>a.days-b.days,high:(a,b)=>b.max-a.max,low:(a,b)=>a.min-b.min,few:(a,b)=>a.props-b.props}[F.sort];
  return r.sort(s);
}
function jobsView(){
  $("#app").innerHTML=`<h1>Find Jobs</h1><p class="sub">Browse open projects and send a proposal.</p>
  <div class="tools">
   <input id="q" type="search" placeholder="Search by title, skill or keyword" value="${esc(F.q)}" aria-label="Search jobs">
   <select id="budget" aria-label="Budget"><option value="any">Any budget</option><option value="low">Under $300</option><option value="mid">$300 – $600</option><option value="high">Over $600</option></select>
   <select id="sort" aria-label="Sort"><option value="new">Newest first</option><option value="high">Highest budget</option><option value="low">Lowest budget</option><option value="few">Fewest proposals</option></select>
   <button class="btn ghost" id="reset">Clear filters</button></div>
  <div class="chips" id="chips">${["All",...CATS].map(c=>`<button class="chip ${F.cat===c?"on":""}" data-c="${c}">${c}</button>`).join("")}</div>
  <div id="list"></div>`;
  $("#budget").value=F.budget;$("#sort").value=F.sort;
  $("#q").oninput=e=>{F.q=e.target.value;renderList()};
  $("#budget").onchange=e=>{F.budget=e.target.value;renderList()};
  $("#sort").onchange=e=>{F.sort=e.target.value;renderList()};
  $("#reset").onclick=()=>{F={q:"",cat:"All",sort:"new",budget:"any"};jobsView()};
  $("#chips").onclick=e=>{const c=e.target.dataset.c;if(!c)return;F.cat=c;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("on",x.dataset.c===c));renderList()};
  $("#list").onclick=e=>{
    const ap=e.target.closest("[data-apply]");
    if(ap){e.stopPropagation();location.hash="#/apply/"+ap.dataset.apply;return}
    const c=e.target.closest(".card");if(c)location.hash="#/job/"+c.dataset.id};
  $("#list").onkeydown=e=>{if(e.key==="Enter"){const c=e.target.closest(".card");if(c&&e.target===c)location.hash="#/job/"+c.dataset.id}};
  loadList();
}
function loadList(){
  $("#list").innerHTML=`<div class="grid">${'<div class="sk"></div>'.repeat(4)}</div>`;
  setTimeout(()=>{
    if(simulateError){simulateError=false;
      $("#list").innerHTML=`<div class="state"><h2>Jobs couldn't load</h2><p>Check your connection and try again.</p><button class="btn" id="retry">Try again</button></div>`;
      $("#retry").onclick=loadList;return}
    renderList();},600);
}
function renderList(){
  const r=filtered();
  $("#list").innerHTML=r.length?`<div class="count">${r.length} job${r.length>1?"s":""} found</div><div class="grid">${r.map(jobCard).join("")}</div>`
   :`<div class="state"><h2>No jobs match your search</h2><p>Try a different keyword or clear the filters.</p><button class="btn" id="clr">Clear filters</button></div>`;
  const c=$("#clr");if(c)c.onclick=()=>{F={q:"",cat:"All",sort:"new",budget:"any"};jobsView()};
}
function detailView(id){
  const j=jobs.find(x=>x.id==id);
  if(!j)return $("#app").innerHTML=`<div class="state"><h2>Job not found</h2><p>It may have been removed.</p><a class="btn" href="#/jobs" style="text-decoration:none;display:inline-block">Back to jobs</a></div>`;
  const mine=proposals.find(p=>p.jobId===j.id&&p.status!=="withdrawn");
  $("#app").innerHTML=`<button class="back" onclick="history.back()">&larr; Back to jobs</button>
  <div class="detail"><div class="panel"><div class="meta"><span>${esc(j.cat)}</span><span>Posted ${ago(j.days)}</span></div>
   <h1 style="margin-top:6px">${esc(j.title)}</h1><h2 style="margin-top:18px">Project description</h2><p>${esc(j.desc)}</p>
   <h2>Required skills</h2><div class="skills">${j.skills.map(s=>`<span class="skill">${esc(s)}</span>`).join("")}</div></div>
   <aside class="panel"><div class="budget" style="font-size:1.4rem">$${j.min} – $${j.max}</div><p class="meta">Fixed price budget</p>
   <p>${j.props} proposals so far</p>
   ${mine?`<span class="tag t-${mine.status}">Your proposal: ${mine.status}</span>`:`<button class="btn" style="width:100%" onclick="location.hash='#/apply/${j.id}'">Submit a proposal</button>`}</aside></div>`;
}
function applyView(id){
  const j=jobs.find(x=>x.id==id);if(!j)return detailView(id);
  $("#app").innerHTML=`<button class="back" onclick="history.back()">&larr; Back</button>
  <div class="panel"><h1>Submit a proposal</h1><p class="sub">For: ${esc(j.title)} ($${j.min} – $${j.max})</p>
  <form class="f" id="pf" novalidate>
   <label for="cl">Cover letter <span class="hint">(min. 50 characters)</span></label><textarea id="cl" rows="6" placeholder="Explain why you are a good fit and how you would approach this project."></textarea><div class="err" data-e="cl"></div>
   <div class="row"><div><label for="pr">Proposed price (USD)</label><input id="pr" type="number" min="1" placeholder="e.g. 450"><div class="err" data-e="pr"></div></div>
   <div><label for="dl">Delivery time (days)</label><input id="dl" type="number" min="1" placeholder="e.g. 14"><div class="err" data-e="dl"></div></div></div>
   <label for="ex">Relevant skills / experience</label><input id="ex" placeholder="e.g. 2 React projects, Flask API for a student portal"><div class="err" data-e="ex"></div>
   <div style="margin-top:18px;display:flex;gap:10px"><button class="btn" id="sb">Submit proposal</button><button type="button" class="btn ghost" onclick="history.back()">Cancel</button></div>
  </form></div>`;
  $("#pf").onsubmit=e=>{e.preventDefault();
    const v={cl:$("#cl").value.trim(),pr:+$("#pr").value,dl:+$("#dl").value,ex:$("#ex").value.trim()};
    const er={};
    if(v.cl.length<50)er.cl="Write at least 50 characters ("+v.cl.length+" so far).";
    if(!v.pr||v.pr<1)er.pr="Enter a price above $0.";
    if(!v.dl||v.dl<1)er.dl="Enter at least 1 day.";
    if(v.ex.length<5)er.ex="Add your relevant skills or experience.";
    showErrors(er);if(Object.keys(er).length)return;
    $("#sb").disabled=true;$("#sb").textContent="Submitting…";
    setTimeout(()=>{
      proposals.unshift({id:Date.now(),jobId:j.id,title:j.title,price:v.pr,days:v.dl,letter:v.cl,exp:v.ex,status:"pending",date:new Date().toLocaleDateString()});
      j.props++;save("fh_props",proposals);save("fh_jobs",jobs);toast("Proposal submitted");location.hash="#/proposals"},700);
  };
}
function showErrors(er){
  document.querySelectorAll("[data-e]").forEach(d=>{const k=d.dataset.e;d.textContent=er[k]||"";const i=document.getElementById(k);if(i)i.classList.toggle("bad",!!er[k])});
  const first=document.querySelector(".bad");if(first)first.focus();
}
function postView(){
  $("#app").innerHTML=`<h1>Post a Job</h1><p class="sub">Describe your project and freelancers will send proposals.</p>
  <div class="panel"><form class="f" id="jf" novalidate>
   <label for="t">Job title</label><input id="t" placeholder="e.g. Build a landing page for my shop"><div class="err" data-e="t"></div>
   <div class="row"><div><label for="c">Category</label><select id="c"><option value="">Choose a category</option>${CATS.map(c=>`<option>${c}</option>`).join("")}</select><div class="err" data-e="c"></div></div>
   <div><label for="s">Required skills <span class="hint">(comma separated)</span></label><input id="s" placeholder="React, CSS"><div class="err" data-e="s"></div></div></div>
   <div class="row"><div><label for="mn">Minimum budget (USD)</label><input id="mn" type="number" min="1"><div class="err" data-e="mn"></div></div>
   <div><label for="mx">Maximum budget (USD)</label><input id="mx" type="number" min="1"><div class="err" data-e="mx"></div></div></div>
   <label for="d">Project description</label><textarea id="d" rows="6" placeholder="What needs to be built, and what does a finished project look like?"></textarea><div class="err" data-e="d"></div>
   <div style="margin-top:18px"><button class="btn">Post job</button></div></form></div>`;
  $("#jf").onsubmit=e=>{e.preventDefault();
    const v={t:$("#t").value.trim(),c:$("#c").value,s:$("#s").value.split(",").map(x=>x.trim()).filter(Boolean),mn:+$("#mn").value,mx:+$("#mx").value,d:$("#d").value.trim()};
    const er={};
    if(v.t.length<8)er.t="Use at least 8 characters.";
    if(!v.c)er.c="Pick a category.";
    if(!v.s.length)er.s="Add at least one skill.";
    if(!v.mn)er.mn="Enter a minimum budget.";
    if(!v.mx||v.mx<v.mn)er.mx="Maximum must be at least the minimum.";
    if(v.d.length<30)er.d="Describe the project in at least 30 characters.";
    showErrors(er);if(Object.keys(er).length)return;
    jobs.unshift({id:Date.now(),title:v.t,cat:v.c,min:v.mn,max:v.mx,skills:v.s,desc:v.d,days:0,props:0});
    save("fh_jobs",jobs);toast("Job posted");F={q:"",cat:"All",sort:"new",budget:"any"};location.hash="#/jobs";
  };
}
let pFilter="all";
function proposalsView(){
  const list=proposals.filter(p=>pFilter==="all"||p.status===pFilter);
  $("#app").innerHTML=`<h1>My Proposals</h1><p class="sub">Track every proposal you have sent.</p>
  <div class="chips">${["all","pending","shortlisted","accepted","rejected","withdrawn"].map(s=>`<button class="chip ${pFilter===s?"on":""}" data-s="${s}">${s[0].toUpperCase()+s.slice(1)}</button>`).join("")}</div>
  <div id="pl">${list.length?list.map(p=>`<div class="panel prop"><div><h3>${esc(p.title)}</h3>
   <div class="meta"><span>$${p.price}</span><span>${p.days} days</span><span>Sent ${esc(p.date)}</span></div>
   <p class="desc" style="margin-top:6px">${esc(p.letter)}</p></div>
   <div style="text-align:right"><span class="tag t-${p.status}">${p.status}</span><div style="margin-top:10px;display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap">
   <button class="btn ghost" data-view="${p.jobId}">View job</button>
   ${p.status==="pending"?`<button class="btn danger" data-w="${p.id}">Withdraw</button>`:""}</div></div></div>`).join("")
   :`<div class="state"><h2>${proposals.length?"No proposals with this status":"You haven't sent any proposals yet"}</h2><p>${proposals.length?"Choose another status above.":"Find a job that fits your skills and send your first proposal."}</p><a class="btn" href="#/jobs" style="text-decoration:none;display:inline-block">Find jobs</a></div>`}</div>`;
  document.querySelector(".chips").onclick=e=>{const s=e.target.dataset.s;if(s){pFilter=s;proposalsView()}};
  $("#pl").onclick=e=>{
    const w=e.target.dataset.w,v=e.target.dataset.view;
    if(v)location.hash="#/job/"+v;
    if(w&&confirm("Withdraw this proposal?")){const p=proposals.find(x=>x.id==w);p.status="withdrawn";const j=jobs.find(x=>x.id===p.jobId);if(j&&j.props>0)j.props--;save("fh_props",proposals);save("fh_jobs",jobs);toast("Proposal withdrawn");proposalsView()}};
}
function toast(m){const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
function route(){
  const [,r,id]=(location.hash||"#/jobs").split("/");
  document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.dataset.r===(r==="job"||r==="apply"?"jobs":r)));
  ({jobs:jobsView,job:()=>detailView(id),apply:()=>applyView(id),post:postView,proposals:proposalsView}[r]||jobsView)();
  $("#pc").textContent=proposals.filter(p=>p.status!=="withdrawn").length;
  window.scrollTo(0,0);
}
addEventListener("hashchange",route);route();