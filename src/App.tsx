import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, set, get, onValue, off } from "firebase/database";

const FIXTURES = [
  { id: 1, home: "México", away: "Polonia", group: "A", date: "11 Jun" },
  { id: 2, home: "Arabia Saudí", away: "Argentina", group: "A", date: "11 Jun" },
  { id: 3, home: "México", away: "Argentina", group: "A", date: "15 Jun" },
  { id: 4, home: "Polonia", away: "Arabia Saudí", group: "A", date: "15 Jun" },
  { id: 5, home: "EEUU", away: "Gales", group: "B", date: "12 Jun" },
  { id: 6, home: "Inglaterra", away: "Irán", group: "B", date: "12 Jun" },
  { id: 7, home: "EEUU", away: "Inglaterra", group: "B", date: "16 Jun" },
  { id: 8, home: "Gales", away: "Irán", group: "B", date: "16 Jun" },
  { id: 9, home: "Francia", away: "Australia", group: "C", date: "13 Jun" },
  { id: 10, home: "Túnez", away: "Dinamarca", group: "C", date: "13 Jun" },
  { id: 11, home: "Francia", away: "Dinamarca", group: "C", date: "17 Jun" },
  { id: 12, home: "Australia", away: "Túnez", group: "C", date: "17 Jun" },
  { id: 13, home: "España", away: "Costa Rica", group: "D", date: "14 Jun" },
  { id: 14, home: "Alemania", away: "Japón", group: "D", date: "14 Jun" },
  { id: 15, home: "España", away: "Alemania", group: "D", date: "18 Jun" },
  { id: 16, home: "Japón", away: "Costa Rica", group: "D", date: "18 Jun" },
  { id: 17, home: "Brasil", away: "Serbia", group: "E", date: "15 Jun" },
  { id: 18, home: "Suiza", away: "Camerún", group: "E", date: "15 Jun" },
  { id: 19, home: "Brasil", away: "Suiza", group: "E", date: "19 Jun" },
  { id: 20, home: "Serbia", away: "Camerún", group: "E", date: "19 Jun" },
  { id: 21, home: "Bélgica", away: "Canadá", group: "F", date: "16 Jun" },
  { id: 22, home: "Marruecos", away: "Croacia", group: "F", date: "16 Jun" },
  { id: 23, home: "Bélgica", away: "Marruecos", group: "F", date: "20 Jun" },
  { id: 24, home: "Croacia", away: "Canadá", group: "F", date: "20 Jun" },
  { id: 25, home: "Portugal", away: "Ghana", group: "G", date: "17 Jun" },
  { id: 26, home: "Uruguay", away: "Corea del Sur", group: "G", date: "17 Jun" },
  { id: 27, home: "Portugal", away: "Uruguay", group: "G", date: "21 Jun" },
  { id: 28, home: "Ghana", away: "Corea del Sur", group: "G", date: "21 Jun" },
  { id: 29, home: "Países Bajos", away: "Ecuador", group: "H", date: "18 Jun" },
  { id: 30, home: "Senegal", away: "Qatar", group: "H", date: "18 Jun" },
  { id: 31, home: "Países Bajos", away: "Qatar", group: "H", date: "22 Jun" },
  { id: 32, home: "Ecuador", away: "Senegal", group: "H", date: "22 Jun" },
];
const FLAG: Record<string,string> = {
  "México":"🇲🇽","Polonia":"🇵🇱","Arabia Saudí":"🇸🇦","Argentina":"🇦🇷",
  "EEUU":"🇺🇸","Gales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Irán":"🇮🇷",
  "Francia":"🇫🇷","Australia":"🇦🇺","Túnez":"🇹🇳","Dinamarca":"🇩🇰",
  "España":"🇪🇸","Costa Rica":"🇨🇷","Alemania":"🇩🇪","Japón":"🇯🇵",
  "Brasil":"🇧🇷","Serbia":"🇷🇸","Suiza":"🇨🇭","Camerún":"🇨🇲",
  "Bélgica":"🇧🇪","Canadá":"🇨🇦","Marruecos":"🇲🇦","Croacia":"🇭🇷",
  "Portugal":"🇵🇹","Ghana":"🇬🇭","Uruguay":"🇺🇾","Corea del Sur":"🇰🇷",
  "Países Bajos":"🇳🇱","Ecuador":"🇪🇨","Senegal":"🇸🇳","Qatar":"🇶🇦",
};
function genCode(){return Math.random().toString(36).substring(2,7).toUpperCase();}
async function fbLoad(code:string){const s=await get(ref(db,`groups/${code}`));return s.exists()?s.val():null;}
async function fbSave(g:any){await set(ref(db,`groups/${g.code}`),g);}
const G="#f5c518",GR="#1db954",RE="#e74c3c",BG="#080d18",CA="rgba(255,255,255,0.05)",TX="#f0f0f0",MU="#7a8499";
const S:any={
  page:{minHeight:"100vh",background:`linear-gradient(160deg,${BG} 0%,#0a1628 100%)`,fontFamily:"Arial Narrow,Arial,sans-serif",color:TX,display:"flex",flexDirection:"column"},
  hero:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center"},
  trophy:{fontSize:80,marginBottom:8},title:{fontSize:"clamp(60px,18vw,130px)",fontWeight:900,lineHeight:.85,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:-3},
  yr:{fontStyle:"normal",color:G,display:"block"},tag:{fontSize:16,letterSpacing:3,textTransform:"uppercase",color:MU,marginBottom:36},
  hb:{display:"flex",flexDirection:"column",gap:14,width:"100%",maxWidth:300},
  badge:{marginTop:20,fontSize:13,color:MU,padding:"8px 14px",background:"rgba(255,255,255,0.05)",borderRadius:8},
  fw:{margin:"auto",padding:"36px 24px",maxWidth:400,width:"100%",display:"flex",flexDirection:"column",gap:14},
  ft:{fontSize:40,fontWeight:900,margin:"4px 0 0",textTransform:"uppercase"},fs:{color:MU,fontSize:15,margin:"0 0 8px",lineHeight:1.5},
  back:{background:"none",border:"none",color:MU,fontSize:17,cursor:"pointer",padding:"0",alignSelf:"flex-start"},
  inp:{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.13)",borderRadius:9,color:TX,fontSize:17,padding:"14px 16px",outline:"none",width:"100%",boxSizing:"border-box"},
  bg:{background:G,color:"#000",border:"none",borderRadius:9,padding:"15px 24px",fontSize:17,fontWeight:800,cursor:"pointer",textTransform:"uppercase",width:"100%"},
  bo:{background:"transparent",color:TX,border:"1.5px solid rgba(255,255,255,0.18)",borderRadius:9,padding:"13px 24px",fontSize:16,fontWeight:700,cursor:"pointer",textTransform:"uppercase",width:"100%"},
  hd:{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"rgba(0,0,0,0.4)",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,zIndex:1},
  hc:{flex:1},hcode:{fontSize:14,display:"flex",alignItems:"center",gap:6},hname:{fontSize:16,fontWeight:700},
  cb:{background:"rgba(255,255,255,0.08)",border:"none",color:TX,borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:13},
  tabs:{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"rgba(0,0,0,0.2)"},
  tab:{flex:1,background:"none",border:"none",color:MU,padding:"13px 4px",fontSize:13,cursor:"pointer",fontWeight:700,borderBottom:"2px solid transparent",whiteSpace:"nowrap"},
  ton:{color:G,borderBottomColor:G},
  sc:{flex:1,overflowY:"auto" as const,padding:"16px 14px 100px",maxWidth:580,width:"100%",margin:"0 auto"},
  sr:{display:"flex",gap:10,marginBottom:20},
  sb:{flex:1,background:CA,borderRadius:10,padding:"12px 8px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"},
  sv:{fontSize:30,fontWeight:900,color:G},sl:{fontSize:11,color:MU,letterSpacing:.5,textTransform:"uppercase",marginTop:2},
  gl:{fontSize:12,fontWeight:800,letterSpacing:3,textTransform:"uppercase",color:G,margin:"18px 0 8px 2px"},
  card:{background:CA,borderRadius:12,padding:"14px",marginBottom:10,border:"1px solid rgba(255,255,255,0.06)",borderLeft:"3px solid transparent"},
  cok:{borderLeftColor:GR,background:"rgba(29,185,84,0.07)"},cbad:{borderLeftColor:RE,background:"rgba(231,76,60,0.05)"},
  cd:{fontSize:11,color:MU,marginBottom:7},mr:{display:"flex",alignItems:"center",gap:6,marginBottom:12},
  tl:{flex:1,fontSize:14,fontWeight:700},tr:{flex:1,fontSize:14,fontWeight:700,textAlign:"right"},vs:{fontSize:11,color:MU,flexShrink:0,padding:"0 4px"},
  or:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" as const},
  opt:{flex:1,minWidth:60,background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:8,color:TX,padding:"9px 4px",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:2},
  oon:{background:G,color:"#000",borderColor:G},olk:{opacity:.55,cursor:"default"},
  ok:{fontSize:18,fontWeight:900,lineHeight:1},ol:{fontSize:10,letterSpacing:.5,textTransform:"uppercase"},
  rb:{marginTop:10,fontSize:12,color:MU},
  bh:{fontSize:12,letterSpacing:1,textTransform:"uppercase",color:MU,marginBottom:16},
  br:{display:"flex",alignItems:"center",gap:12,background:CA,borderRadius:11,padding:"13px 14px",marginBottom:9,border:"1px solid rgba(255,255,255,0.05)"},
  bme:{borderLeft:`3px solid ${G}`,background:"rgba(245,197,24,0.06)"},
  bp:{fontSize:22,width:34,textAlign:"center",flexShrink:0},bi:{flex:1},bn:{fontSize:17,fontWeight:700},bsub:{fontSize:12,color:MU},
  bpts:{fontSize:32,fontWeight:900,color:G,flexShrink:0,display:"flex",alignItems:"flex-end",gap:3},ptsl:{fontSize:12,color:MU,marginBottom:4},
  an:{background:"rgba(245,197,24,0.07)",border:"1px solid rgba(245,197,24,0.2)",borderRadius:9,padding:14,fontSize:14,color:MU,marginBottom:18,lineHeight:1.6},
  ac:{background:CA,borderRadius:11,padding:"12px 14px",marginBottom:10,border:"1px solid rgba(255,255,255,0.06)"},
  am:{fontSize:14,fontWeight:700,marginBottom:10},
  clr:{background:"rgba(231,76,60,0.12)",border:"1px solid rgba(231,76,60,0.3)",color:RE,borderRadius:7,padding:"9px 12px",cursor:"pointer",fontSize:14},
  toast:{position:"fixed" as const,top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,color:"#fff",padding:"12px 22px",borderRadius:9,fontWeight:700,fontSize:15,boxShadow:"0 4px 24px rgba(0,0,0,0.5)",whiteSpace:"nowrap"},
  sav:{position:"fixed" as const,bottom:16,right:16,background:"rgba(0,0,0,0.7)",color:MU,padding:"7px 14px",borderRadius:7,fontSize:12,zIndex:50},
};
export default function App(){
  const [screen,setScreen]=useState("home");
  const [group,setGroup]=useState<any>(null);
  const [groupCode,setGroupCode]=useState("");
  const [playerName,setPlayerName]=useState("");
  const [inputCode,setInputCode]=useState("");
  const [nameInput,setNameInput]=useState("");
  const [tab,setTab]=useState("predict");
  const [notif,setNotif]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const notify=(msg:string,type="ok")=>{setNotif({msg,type});setTimeout(()=>setNotif(null),3500);};
  useEffect(()=>{
    if(screen!=="lobby"||!groupCode)return;
    const r=ref(db,`groups/${groupCode}`);
    const u=onValue(r,(s)=>{if(s.exists())setGroup(s.val());});
    return()=>off(r,"value",u);
  },[screen,groupCode]);
  async function createGroup(){
    const n=nameInput.trim();if(!n)return notify("Escribe tu nombre","err");
    setLoading(true);
    try{const code=genCode();const ng={code,createdBy:n,players:{[n]:{name:n,predictions:{},isAdmin:true}},results:{}};
    await fbSave(ng);setGroup(ng);setGroupCode(code);setPlayerName(n);setNameInput("");setScreen("lobby");notify(`✅ Grupo creado: ${code}`);}
    catch{notify("Error al crear","err");}finally{setLoading(false);}
  }
  async function joinGroup(){
    const code=inputCode.trim().toUpperCase();const n=nameInput.trim();
    if(!code||!n)return notify("Rellena todos los campos","err");
    setLoading(true);
    try{const g=await fbLoad(code);if(!g){notify("Código incorrecto ❌","err");return;}
    if(!g.players[n]){const u={...g,players:{...g.players,[n]:{name:n,predictions:{},isAdmin:false}}};await fbSave(u);setGroup(u);}else setGroup(g);
    setGroupCode(code);setPlayerName(n);setInputCode("");setNameInput("");setScreen("lobby");
    notify(g.players[n]?"¡Bienvenido de nuevo! 🙌":`👋 Unido al grupo ${code}`);}
    catch{notify("Error de conexión","err");}finally{setLoading(false);}
  }
  async function setPred(fid:number,pick:string){
    if(!group)return;setSaving(true);
    try{await set(ref(db,`groups/${groupCode}/players/${playerName}/predictions/${fid}`),pick);}
    catch{notify("Error","err");}setSaving(false);
  }
  async function setRes(fid:number,result:string|undefined){
    if(!group)return;setSaving(true);
    try{await set(ref(db,`groups/${groupCode}/results/${fid}`),result??null);}
    catch{notify("Error","err");}setSaving(false);
  }
  function calcPts(p:any){if(!group?.results)return 0;return Object.entries(group.results).reduce((s:number,[fid,res])=>s+(p?.predictions?.[fid]===res?3:0),0);}
  function board(){if(!group?.players)return[];return Object.values(group.players).map((p:any)=>({...p,points:calcPts(p)})).sort((a:any,b:any)=>b.points-a.points);}
  const cp=group?.players?.[playerName];
  const myPicks=cp?.predictions||{};
  const totalRes=Object.keys(group?.results||{}).filter((k:string)=>group.results[k]).length;
  if(screen==="home")return(<div style={S.page}><div style={S.hero}><div style={S.trophy}>🏆</div><h1 style={S.title}>MUNDIAL<br/><em style={S.yr}>2026</em></h1><p style={S.tag}>Quiniela con amigos · 1 X 2</p><div style={S.hb}><button style={S.bg} onClick={()=>setScreen("create")}>Crear grupo</button><button style={S.bo} onClick={()=>setScreen("join")}>Unirme a un grupo</button></div><div style={S.badge}>⚡ Multijugador en tiempo real</div></div></div>);
  if(screen==="create")return(<div style={S.page}><div style={S.fw}><button style={S.back} onClick={()=>setScreen("home")}>← Volver</button><h2 style={S.ft}>Crear grupo</h2><p style={S.fs}>Elige tu nombre. Obtendrás un código para compartir.</p><input style={S.inp} placeholder="Tu nombre" value={nameInput} onChange={e=>setNameInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&createGroup()}/><button style={{...S.bg,opacity:loading?.6:1}} onClick={createGroup} disabled={loading}>{loading?"⏳ Creando…":"Crear grupo →"}</button></div></div>);
  if(screen==="join")return(<div style={S.page}><div style={S.fw}><button style={S.back} onClick={()=>setScreen("home")}>← Volver</button><h2 style={S.ft}>Unirse</h2><p style={S.fs}>Introduce el código y tu nombre.</p><input style={S.inp} placeholder="Código (ej: AB12C)" value={inputCode} onChange={e=>setInputCode(e.target.value.toUpperCase())} maxLength={5}/><input style={S.inp} placeholder="Tu nombre" value={nameInput} onChange={e=>setNameInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&joinGroup()}/><button style={{...S.bg,opacity:loading?.6:1}} onClick={joinGroup} disabled={loading}>{loading?"⏳ Buscando…":"Unirme →"}</button></div></div>);
  if(screen==="lobby"&&group){
    const lb=board();const myPred=Object.keys(myPicks).length;const myPts=calcPts(cp||{predictions:{}});
    return(<div style={S.page}>
      {notif&&<div style={{...S.toast,background:notif.type==="err"?"#c0392b":"#1a7a40"}}>{notif.msg}</div>}
      {saving&&<div style={S.sav}>💾 Guardando…</div>}
      <div style={S.hd}><button style={S.back} onClick={()=>{setScreen("home");setGroupCode("");setPlayerName("");setGroup(null);}}>←</button>
        <div style={S.hc}><div style={S.hcode}>Grupo <strong style={{color:G,letterSpacing:2}}>{groupCode}</strong><button style={S.cb} onClick={()=>{navigator.clipboard?.writeText(groupCode);notify("📋 Código copiado");}}>📋</button></div><div style={S.hname}>{playerName}{cp?.isAdmin?" 👑":""}</div></div>
      </div>
      <div style={S.tabs}>{["predict","board",...(cp?.isAdmin?["admin"]:[])].map(t=>(<button key={t} style={{...S.tab,...(tab===t?S.ton:{})}} onClick={()=>setTab(t)}>{t==="predict"?"🗳️ Pronósticos":t==="board"?"🏆 Tabla":"⚙️ Resultados"}</button>))}</div>
      {tab==="predict"&&<div style={S.sc}><div style={S.sr}><div style={S.sb}><div style={S.sv}>{myPred}/{FIXTURES.length}</div><div style={S.sl}>Pronósticos</div></div><div style={S.sb}><div style={S.sv}>{totalRes>0?myPts/3:"-"}</div><div style={S.sl}>Aciertos</div></div><div style={S.sb}><div style={S.sv}>{myPts}</div><div style={S.sl}>Puntos</div></div></div>
        {["A","B","C","D","E","F","G","H"].map(grp=>(<div key={grp}><div style={S.gl}>Grupo {grp}</div>{FIXTURES.filter(f=>f.group===grp).map(f=>{const pick=myPicks[f.id];const res=group.results?.[f.id];const locked=!!res;const correct=pick&&res&&pick===res;const wrong=pick&&res&&pick!==res;return(<div key={f.id} style={{...S.card,...(correct?S.cok:wrong?S.cbad:{})}}><div style={S.cd}>{f.date}</div><div style={S.mr}><span style={S.tl}>{FLAG[f.home]} {f.home}</span><span style={S.vs}>vs</span><span style={S.tr}>{f.away} {FLAG[f.away]}</span></div><div style={S.or}>{[["1",f.home],["X","Empate"],["2",f.away]].map(([opt,label])=>(<button key={opt} style={{...S.opt,...(pick===opt?S.oon:{}),...(locked?S.olk:{})}} onClick={()=>!locked&&setPred(f.id,opt)} disabled={locked}><span style={S.ok}>{opt}</span><span style={S.ol}>{(label as string).split(" ")[0]}</span></button>))}</div>{res&&<div style={S.rb}>{correct?"✅":"❌"} {res==="1"?f.home:res==="2"?f.away:"Empate"}{correct?" · +3 pts":""}</div>}</div>);})}</div>))}</div>}
      {tab==="board"&&<div style={S.sc}><div style={S.bh}>🔴 En vivo · {totalRes} resultados · {Object.keys(group.players).length} participantes</div>{lb.map((p:any,i:number)=>(<div key={p.name} style={{...S.br,...(p.name===playerName?S.bme:{})}}><div style={S.bp}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`}</div><div style={S.bi}><div style={S.bn}>{p.name}{p.isAdmin?" 👑":""}</div><div style={S.bsub}>{Object.keys(p.predictions||{}).length} pronósticos</div></div><div style={S.bpts}>{p.points}<span style={S.ptsl}>pts</span></div></div>))}</div>}
      {tab==="admin"&&cp?.isAdmin&&<div style={S.sc}><div style={S.an}>Introduce los resultados oficiales. 3 puntos por acierto.</div>{FIXTURES.map(f=>{const res=group.results?.[f.id];return(<div key={f.id} style={S.ac}><div style={S.am}>{FLAG[f.home]} {f.home} vs {f.away} {FLAG[f.away]}</div><div style={S.or}>{[["1","Local"],["X","Empate"],["2","Visitante"]].map(([opt,label])=>(<button key={opt} style={{...S.opt,...(res===opt?S.oon:{})}} onClick={()=>setRes(f.id,opt)}><span style={S.ok}>{opt}</span><span style={S.ol}>{label}</span></button>))}{res&&<button style={S.clr} onClick={()=>setRes(f.id,undefined)}>✕</button>}</div></div>);})}</div>}
    </div>);}
  return <div style={{color:"#fff",padding:40,textAlign:"center"}}>Cargando…</div>;
}
