import { useState, useEffect, useRef } from "react";

const SEED_GAMES = [
  {
    id:"g1",court:"Givens Recreation Center",address:"3811 E 12th St",neighborhood:"East Austin",
    date:"Sat May 17",time:"9:00 AM",skillLevel:"Intermediate",spotsTotal:10,
    players:[{name:"Marcus T.",avatar:"MT"},{name:"DeShawn R.",avatar:"DR"},{name:"Kenji W.",avatar:"KW"}],
    description:"Casual run, all welcome at the intermediate level. Full court runs until we run out of players. Bring water — courts get hot in the morning sun.",
    postedBy:"Marcus T.",postedById:"seed_marcus"
  },
  {
    id:"g2",court:"Westenfield Park Courts",address:"1314 Flat Creek Dr",neighborhood:"Northwest Austin",
    date:"Sun May 18",time:"6:00 PM",skillLevel:"Beginner",spotsTotal:8,
    players:[{name:"Aaliyah M.",avatar:"AM"}],
    description:"Beginner friendly! Just learning the game myself and want to meet others starting out. Super chill vibes, absolutely no judgment zone.",
    postedBy:"Aaliyah M.",postedById:"seed_aaliyah"
  },
  {
    id:"g3",court:"Northwest Recreation Center",address:"2913 Northland Dr",neighborhood:"North Austin",
    date:"Sat May 17",time:"7:00 PM",skillLevel:"Advanced",spotsTotal:10,
    players:[{name:"Jordan B.",avatar:"JB"},{name:"Tre C.",avatar:"TC"},{name:"Isaiah F.",avatar:"IF"},{name:"Malik D.",avatar:"MD"}],
    description:"Serious runs only. Full court 5v5, we go hard every game. Come ready to compete — if you're not in shape this isn't the run for you.",
    postedBy:"Jordan B.",postedById:"seed_jordan"
  },
  {
    id:"g4",court:"Pan Am Neighborhood Park",address:"2100 E 3rd St",neighborhood:"East Austin",
    date:"Mon May 19",time:"5:30 PM",skillLevel:"Intermediate",spotsTotal:12,
    players:[{name:"Sofia R.",avatar:"SR"},{name:"Carlos V.",avatar:"CV"},{name:"Priya N.",avatar:"PN"}],
    description:"After-work outdoor run on the east side. Good vibes only, mix of skill levels welcome as long as you can hold your own.",
    postedBy:"Sofia R.",postedById:"seed_sofia"
  },
  {
    id:"g5",court:"Balcones District Park",address:"12017 Amherst Dr",neighborhood:"North Austin",
    date:"Sun May 18",time:"10:00 AM",skillLevel:"Intermediate",spotsTotal:10,
    players:[{name:"Tyler H.",avatar:"TH"},{name:"Nadia K.",avatar:"NK"}],
    description:"Sunday morning run on great outdoor courts in North Austin. Usually goes 2-3 hours. Bring your own water.",
    postedBy:"Tyler H.",postedById:"seed_tyler"
  }
];

const AUSTIN_COURTS = [
  {name:"Givens Recreation Center",address:"3811 E 12th St",neighborhood:"East Austin"},
  {name:"Northwest Recreation Center",address:"2913 Northland Dr",neighborhood:"North Austin"},
  {name:"Westenfield Park Courts",address:"1314 Flat Creek Dr",neighborhood:"Northwest Austin"},
  {name:"Pan Am Neighborhood Park",address:"2100 E 3rd St",neighborhood:"East Austin"},
  {name:"Balcones District Park",address:"12017 Amherst Dr",neighborhood:"North Austin"},
  {name:"Ramsey Park Courts",address:"1600 Tosca Ln",neighborhood:"South Austin"},
  {name:"Dove Springs Recreation Center",address:"5801 Ainez Dr",neighborhood:"Southeast Austin"},
  {name:"Metz Recreation Center",address:"2407 Canterbury St",neighborhood:"East Austin"},
  {name:"South Austin Recreation Center",address:"1100 Cumberland Rd",neighborhood:"South Austin"},
  {name:"Bartholomew District Park",address:"5201 Berkman Dr",neighborhood:"Northeast Austin"},
];

const SKILL_LEVELS = ["Beginner","Intermediate","Advanced"];
const POSITIONS = ["Point Guard","Shooting Guard","Small Forward","Power Forward","Center","Flex / Any"];
const NEIGHBORHOODS = ["East Austin","South Austin","North Austin","Northwest Austin","Southeast Austin","Northeast Austin","Central Austin","West Austin","Downtown"];

const LEVEL_COLORS = {
  Beginner:   {text:"#22c55e", bg:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.35)"},
  Intermediate:{text:"#f59e0b", bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.35)"},
  Advanced:   {text:"#ef4444", bg:"rgba(239,68,68,0.12)",   border:"rgba(239,68,68,0.35)"},
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07090C;--surface:#0D1117;--card:#131920;--card2:#192028;
  --border:#1C242D;--border2:#253040;
  --orange:#FF6B1A;--orange-d:rgba(255,107,26,0.14);--orange-g:rgba(255,107,26,0.35);
  --yellow:#FFD23F;--yellow-d:rgba(255,210,63,0.11);
  --green:#22C55E;--red:#EF4444;
  --text:#EDE8E0;--dim:#8A95A0;--muted:#3E4C58;
  --f-disp:'Bebas Neue',sans-serif;
  --f-body:'Outfit',sans-serif;
  --f-mono:'DM Mono',monospace;
  --r:12px;--rs:8px;
}
html,body{background:var(--bg);color:var(--text);font-family:var(--f-body);height:100%;overflow:hidden}
#root{height:100vh;display:flex;flex-direction:column}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
.app{display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--bg)}
.app::after{content:'';position:fixed;inset:0;background:
  repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,107,26,0.025) 80px),
  repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,107,26,0.018) 80px);
  pointer-events:none;z-index:0}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;
  border-bottom:1px solid var(--border);background:var(--bg);flex-shrink:0;position:relative;z-index:10}
.logo{font-family:var(--f-disp);font-size:26px;letter-spacing:3px;line-height:1;color:var(--text)}
.logo span{color:var(--orange)}
.hdr-right{display:flex;align-items:center;gap:10px}
.hdr-count{font-size:11px;color:var(--muted);font-family:var(--f-mono)}
.av-sm{width:30px;height:30px;border-radius:50%;background:var(--orange-d);border:1.5px solid var(--orange);
  display:flex;align-items:center;justify-content:center;font-family:var(--f-mono);font-size:10px;
  color:var(--orange);cursor:pointer;transition:all .2s}
.av-sm:hover{background:var(--orange);color:#fff}
.content{flex:1;overflow-y:auto;overflow-x:hidden;position:relative;z-index:1}
.tabs{display:flex;background:var(--surface);border-top:1px solid var(--border);flex-shrink:0;position:relative;z-index:10}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:9px 4px 11px;cursor:pointer;transition:all .2s;gap:3px;border:none;background:none;
  color:var(--muted);font-family:var(--f-body);font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase}
.tab.on{color:var(--orange)}.tab:hover:not(.on){color:var(--dim)}
.tab-ico{font-size:19px;line-height:1}
.feed-hdr{padding:18px 20px 12px;background:var(--bg)}
.feed-ttl{font-family:var(--f-disp);font-size:34px;letter-spacing:2px;line-height:1;margin-bottom:2px}
.feed-sub{font-size:13px;color:var(--dim)}
.filters{display:flex;gap:7px;padding:0 20px 14px;overflow-x:auto;scrollbar-width:none}
.filters::-webkit-scrollbar{display:none}
.chip{padding:5px 15px;border-radius:20px;border:1px solid var(--border2);background:var(--card);
  color:var(--dim);font-family:var(--f-body);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap}
.chip:hover{border-color:var(--orange);color:var(--text)}.chip.on{background:var(--orange);border-color:var(--orange);color:#fff}
.glist{padding:0 20px 24px;display:flex;flex-direction:column;gap:11px}
.gcard{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:15px;
  cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.gcard::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:var(--lc,var(--orange));border-radius:3px 0 0 3px}
.gcard:hover{background:var(--card2);border-color:var(--border2);transform:translateY(-1px)}
.gcard-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:9px;gap:10px}
.g-court{font-weight:700;font-size:14px;color:var(--text);margin-bottom:2px;line-height:1.2}
.g-addr{font-size:11px;color:var(--dim);font-family:var(--f-mono)}
.sbadge{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;font-family:var(--f-mono);
  background:var(--lb,transparent);color:var(--lc,var(--orange));border:1px solid var(--lbc,var(--orange));flex-shrink:0}
.gmeta{display:flex;gap:14px;margin-bottom:11px}
.mi{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--dim)}
.mi-ico{font-size:13px}
.gfoot{display:flex;justify-content:space-between;align-items:center}
.pavs{display:flex}
.pav{width:24px;height:24px;border-radius:50%;background:var(--surface);border:2px solid var(--card);
  display:flex;align-items:center;justify-content:center;font-size:7px;font-family:var(--f-mono);
  color:var(--dim);margin-left:-5px}
.pav:first-child{margin-left:0}
.spots{font-size:11px;color:var(--muted);font-family:var(--f-mono)}.spots.urg{color:var(--orange)}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:100;display:flex;
  align-items:flex-end;backdrop-filter:blur(6px);animation:fadein .2s ease}
@keyframes fadein{from{opacity:0}to{opacity:1}}
@keyframes slideup{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal{background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-height:90vh;
  overflow-y:auto;animation:slideup .28s cubic-bezier(.34,1.56,.64,1);border:1px solid var(--border);border-bottom:none}
.modal-handle{width:34px;height:4px;background:var(--border2);border-radius:2px;margin:12px auto 0}
.modal-hdr{padding:14px 20px 0;display:flex;justify-content:space-between;align-items:flex-start}
.modal-close{width:30px;height:30px;border-radius:50%;background:var(--card);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dim);
  font-size:17px;transition:all .15s;flex-shrink:0}
.modal-close:hover{background:var(--card2);color:var(--text)}
.modal-body{padding:14px 20px 32px}
.m-court{font-family:var(--f-disp);font-size:26px;letter-spacing:1px;line-height:1.1;margin-bottom:3px}
.m-addr{font-family:var(--f-mono);font-size:11px;color:var(--dim);margin-bottom:14px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:18px}
.itile{background:var(--card);border:1px solid var(--border);border-radius:var(--rs);padding:11px}
.itile-lbl{font-size:10px;font-family:var(--f-mono);color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px}
.itile-val{font-weight:600;font-size:14px;color:var(--text)}
.slbl{font-family:var(--f-mono);font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:8px}
.desc{font-size:13px;color:var(--dim);line-height:1.6;margin-bottom:6px;padding:11px;
  background:var(--card);border-radius:var(--rs);border-left:3px solid var(--orange)}
.posted-by{font-size:11px;color:var(--muted);margin-bottom:16px;font-family:var(--f-mono)}
.roster{display:flex;flex-direction:column;gap:7px;margin-bottom:22px}
.ri{display:flex;align-items:center;gap:9px;padding:8px 11px;background:var(--card);
  border-radius:var(--rs);border:1px solid var(--border)}
.rav{width:30px;height:30px;border-radius:50%;background:var(--orange-d);border:1.5px solid var(--orange);
  display:flex;align-items:center;justify-content:center;font-family:var(--f-mono);font-size:9px;color:var(--orange)}
.rname{font-size:13px;font-weight:500}.rhost{margin-left:auto;font-size:10px;font-family:var(--f-mono);color:var(--orange)}
.btn{width:100%;padding:15px;border-radius:var(--r);border:none;font-family:var(--f-disp);
  font-size:19px;letter-spacing:2px;cursor:pointer;transition:all .2s}
.btn-p{background:var(--orange);color:#fff}
.btn-p:hover{background:#ff7d35;transform:translateY(-1px);box-shadow:0 8px 22px var(--orange-g)}
.btn-joined{background:var(--card);color:var(--green);border:1px solid var(--green);cursor:default}
.btn-full{background:var(--card);color:var(--muted);border:1px solid var(--border);cursor:not-allowed}
.post-wrap{padding:20px}
.page-ttl{font-family:var(--f-disp);font-size:34px;letter-spacing:2px;margin-bottom:2px}
.page-sub{font-size:13px;color:var(--dim);margin-bottom:22px}
.fg{margin-bottom:16px}
.flbl{display:block;font-family:var(--f-mono);font-size:10px;text-transform:uppercase;
  letter-spacing:1.5px;color:var(--dim);margin-bottom:7px}
.fi,.fsel,.fta{width:100%;background:var(--card);border:1px solid var(--border2);border-radius:var(--rs);
  color:var(--text);font-family:var(--f-body);font-size:14px;padding:11px 13px;transition:border-color .15s;
  outline:none;appearance:none}
.fi:focus,.fsel:focus,.fta:focus{border-color:var(--orange)}
.fsel option{background:var(--card)}
.fta{resize:vertical;min-height:90px;line-height:1.5}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.ai-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;background:var(--yellow-d);
  border:1px solid rgba(255,210,63,.28);border-radius:6px;color:var(--yellow);font-family:var(--f-mono);
  font-size:10px;cursor:pointer;transition:all .15s;margin-bottom:7px;letter-spacing:.5px}
.ai-btn:hover{background:rgba(255,210,63,.2)}.ai-btn:disabled{opacity:.45;cursor:not-allowed}
.scout-wrap{display:flex;flex-direction:column;overflow:hidden}
.scout-hdr{padding:18px 20px 14px;border-bottom:1px solid var(--border);flex-shrink:0}
.chat-msgs{flex:1;overflow-y:auto;padding:14px 20px;display:flex;flex-direction:column;gap:11px;min-height:0}
.cmsg{max-width:84%;animation:fadein .2s ease}
.cmsg.u{align-self:flex-end}.cmsg.a{align-self:flex-start}
.cbbl{padding:11px 15px;border-radius:15px;font-size:13px;line-height:1.55}
.cmsg.u .cbbl{background:var(--orange);color:#fff;border-radius:15px 15px 4px 15px}
.cmsg.a .cbbl{background:var(--card);border:1px solid var(--border);color:var(--text);border-radius:15px 15px 15px 4px}
.clbl{font-family:var(--f-mono);font-size:9px;color:var(--muted);margin-bottom:3px;text-transform:uppercase;letter-spacing:1px}
.cmsg.u .clbl{text-align:right}
.chat-in-area{padding:10px 20px 18px;border-top:1px solid var(--border);display:flex;gap:9px;flex-shrink:0}
.chat-in{flex:1;background:var(--card);border:1px solid var(--border2);border-radius:22px;
  padding:11px 17px;color:var(--text);font-family:var(--f-body);font-size:13px;outline:none;transition:border-color .15s}
.chat-in:focus{border-color:var(--orange)}
.chat-send{width:42px;height:42px;border-radius:50%;background:var(--orange);border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.chat-send:hover{background:#ff7d35;transform:scale(1.05)}.chat-send:disabled{background:var(--border);cursor:not-allowed;transform:none}
.typing{display:flex;gap:4px;align-items:center;padding:12px 15px;background:var(--card);
  border:1px solid var(--border);border-radius:15px 15px 15px 4px;width:fit-content}
.tdot{width:5px;height:5px;border-radius:50%;background:var(--muted);animation:bob 1.2s infinite}
.tdot:nth-child(2){animation-delay:.2s}.tdot:nth-child(3){animation-delay:.4s}
@keyframes bob{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
.suggs{padding:4px 20px 12px;display:flex;flex-direction:column;gap:7px;flex-shrink:0}
.sugg{padding:9px 14px;background:var(--card);border:1px solid var(--border2);border-radius:9px;
  font-size:12px;color:var(--dim);cursor:pointer;transition:all .15s;text-align:left}
.sugg:hover{border-color:var(--orange);color:var(--text);background:var(--card2)}
.prof-wrap{padding:20px}
.pcard{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:22px;
  display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:20px;
  position:relative;overflow:hidden}
.pcard::after{content:'🏀';position:absolute;font-size:110px;right:-15px;bottom:-15px;opacity:.04;pointer-events:none}
.pav-lg{width:68px;height:68px;border-radius:50%;background:var(--orange-d);border:2px solid var(--orange);
  display:flex;align-items:center;justify-content:center;font-family:var(--f-disp);font-size:26px;color:var(--orange)}
.pname{font-family:var(--f-disp);font-size:30px;letter-spacing:2px;text-align:center;line-height:1}
.phood{font-size:11px;color:var(--muted);font-family:var(--f-mono)}
.ptags{display:flex;gap:7px;flex-wrap:wrap;justify-content:center}
.ptag{padding:3px 11px;background:var(--orange-d);border:1px solid rgba(255,107,26,.28);
  border-radius:20px;font-size:11px;color:var(--orange);font-family:var(--f-mono)}
.pbio{font-size:13px;color:var(--dim);text-align:center;line-height:1.5;margin-top:2px}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:22px}
.stile{background:var(--card);border:1px solid var(--border);border-radius:var(--rs);padding:15px;text-align:center}
.sval{font-family:var(--f-disp);font-size:34px;color:var(--orange);line-height:1}
.slb{font-family:var(--f-mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:3px}
.edit-btn{width:100%;padding:11px;background:var(--card);border:1px solid var(--border2);border-radius:var(--rs);
  color:var(--dim);font-family:var(--f-mono);font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .15s}
.edit-btn:hover{border-color:var(--orange);color:var(--orange)}
.ob{min-height:100vh;display:flex;flex-direction:column;padding:40px 24px 32px;background:var(--bg)}
.ob-logo{font-family:var(--f-disp);font-size:46px;letter-spacing:4px;line-height:1;margin-bottom:6px}
.ob-logo span{color:var(--orange)}
.ob-tag{font-size:14px;color:var(--dim);margin-bottom:36px;line-height:1.55}
.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:18px}
.load-logo{font-family:var(--f-disp);font-size:46px;letter-spacing:4px;color:var(--text)}
.load-logo span{color:var(--orange)}
.spinner{width:28px;height:28px;border:2px solid var(--border);border-top-color:var(--orange);
  border-radius:50%;animation:spin .75s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.toast{position:fixed;bottom:76px;left:50%;transform:translateX(-50%);background:var(--green);
  color:#fff;padding:9px 20px;border-radius:22px;font-size:13px;font-weight:600;z-index:200;
  white-space:nowrap;animation:tin .3s ease, tout .3s ease 2.5s forwards}
@keyframes tin{from{opacity:0;transform:translate(-50%,18px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes tout{from{opacity:1}to{opacity:0}}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:50px 24px;gap:10px;text-align:center}
.e-ico{font-size:44px;opacity:.4}
.e-ttl{font-family:var(--f-disp);font-size:22px;letter-spacing:1px;color:var(--dim)}
.e-txt{font-size:13px;color:var(--muted)}
`;

function initials(name) {
  if(!name) return "?";
  return name.split(" ").map(w=>w[0]||"").join("").toUpperCase().slice(0,2);
}

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function lsDel(key) {
  try { localStorage.removeItem(key); } catch {}
}

export default function HoopsATX() {
  const [state,      setState]      = useState("loading");
  const [tab,        setTab]        = useState("feed");
  const [profile,    setProfile]    = useState(null);
  const [games,      setGames]      = useState([]);
  const [selGame,    setSelGame]    = useState(null);
  const [filter,     setFilter]     = useState("All");
  const [toast,      setToast]      = useState(null);
  const [draft,      setDraft]      = useState({name:"",position:"",skillLevel:"",neighborhood:"",bio:""});
  const [postForm,   setPostForm]   = useState({court:"",date:"",time:"",skillLevel:"",spotsTotal:10,description:""});
  const [aiPosting,  setAiPosting]  = useState(false);
  const [msgs,       setMsgs]       = useState([]);
  const [chatIn,     setChatIn]     = useState("");
  const [chatBusy,   setChatBusy]   = useState(false);
  const [chatLive,   setChatLive]   = useState(false);
  const chatEnd = useRef(null);

  useEffect(()=>{
    const savedProfile = lsGet("hoops:profile");
    const savedGames   = lsGet("hoops:games");
    const g = savedGames || SEED_GAMES;
    if (!savedGames) lsSet("hoops:games", SEED_GAMES);
    setGames(g);
    if (savedProfile) { setProfile(savedProfile); setState("main"); }
    else setState("onboarding");
  },[]);

  useEffect(()=>{ chatEnd.current?.scrollIntoView({behavior:"smooth"}); },[msgs,chatBusy]);

  const flash = msg => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const saveProfile = () => {
    const p = {...draft, id:`u${Date.now()}`};
    lsSet("hoops:profile", p);
    setProfile(p);
    setState("main");
  };

  const joinGame = (id) => {
    const updated = games.map(g=>{
      if(g.id!==id) return g;
      if(g.players.some(p=>p.name===profile.name)) return g;
      if(g.players.length>=g.spotsTotal) return g;
      return {...g, players:[...g.players,{name:profile.name, avatar:initials(profile.name)}]};
    });
    setGames(updated);
    lsSet("hoops:games", updated);
    if(selGame?.id===id) setSelGame(updated.find(g=>g.id===id));
    flash("You're in! 🏀");
  };

  const postGame = () => {
    if(!postForm.court||!postForm.date||!postForm.time||!postForm.skillLevel){
      flash("Fill in all required fields"); return;
    }
    const courtInfo = AUSTIN_COURTS.find(c=>c.name===postForm.court)||{address:"",neighborhood:""};
    const ng = {
      id:`g${Date.now()}`,
      court:postForm.court, address:courtInfo.address, neighborhood:courtInfo.neighborhood,
      date:postForm.date, time:postForm.time,
      skillLevel:postForm.skillLevel, spotsTotal:parseInt(postForm.spotsTotal)||10,
      players:[{name:profile.name, avatar:initials(profile.name)}],
      description:postForm.description||"Come out and run!",
      postedBy:profile.name, postedById:profile.id,
    };
    const updated = [ng,...games];
    setGames(updated);
    lsSet("hoops:games", updated);
    setPostForm({court:"",date:"",time:"",skillLevel:"",spotsTotal:10,description:""});
    flash("Run posted! 🔥");
    setTab("feed");
  };

  const aiDescribe = async () => {
    if(!postForm.court||!postForm.skillLevel){ flash("Pick a court & skill level first"); return; }
    setAiPosting(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user",content:`Write a 2-3 sentence pickup basketball game post for ${postForm.court} in Austin TX. Skill level: ${postForm.skillLevel}. Time: ${postForm.time||"evening"}. Sound like a real Austin baller — authentic, specific, inviting. No emojis. Output only the description, nothing else.`}]
        })
      });
      const d = await r.json();
      const txt = d.content?.[0]?.text||"";
      if(txt) setPostForm(f=>({...f, description:txt.trim()}));
    } catch{}
    setAiPosting(false);
  };

  const sendChat = async (override) => {
    const txt = override||chatIn;
    if(!txt.trim()||chatBusy) return;
    setChatIn(""); setChatLive(true);
    const next = [...msgs, {role:"user",content:txt}];
    setMsgs(next); setChatBusy(true);
    const ctx = JSON.stringify(games.map(g=>({
      court:g.court, neighborhood:g.neighborhood, date:g.date, time:g.time,
      skillLevel:g.skillLevel, open:`${g.spotsTotal - g.players.length} spots open`,
      description:g.description.slice(0,80)
    })));
    const pCtx = profile ? `Player: ${profile.name}, Skill: ${profile.skillLevel}, Position: ${profile.position}, Area: ${profile.neighborhood}` : "No profile";
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`You are HoopsScout, an AI for Hoops ATX — Austin Texas pickup basketball. Help players find games, learn about courts, and connect with the Austin hoops scene. Be conversational, keep replies to 2-4 sentences. No markdown.\n\nLive games: ${ctx}\nUser: ${pCtx}`,
          messages:next
        })
      });
      const d = await r.json();
      const reply = d.content?.[0]?.text||"Couldn't connect. Try again!";
      setMsgs(prev=>[...prev,{role:"assistant",content:reply}]);
    } catch {
      setMsgs(prev=>[...prev,{role:"assistant",content:"Connection issue — try again!"}]);
    }
    setChatBusy(false);
  };

  const filtered = filter==="All" ? games : games.filter(g=>g.skillLevel===filter);
  const isJoined = g => g.players.some(p=>p.name===profile?.name);
  const isFull   = g => g.players.length >= g.spotsTotal;

  if(state==="loading") return (
    <><style>{CSS}</style>
    <div className="loading">
      <div className="load-logo">HOOPS<span>ATX</span></div>
      <div className="spinner"/>
    </div></>
  );

  if(state==="onboarding") return (
    <><style>{CSS}</style>
    <div className="ob">
      <div className="ob-logo">HOOPS<span>ATX</span></div>
      <div className="ob-tag">Find your run. Meet your people.<br/>Austin's pickup basketball community.</div>
      <div style={{flex:1,overflowY:"auto"}}>
        <div className="fg">
          <label className="flbl">Your Name *</label>
          <input className="fi" placeholder="e.g. Jordan B."
            value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))}/>
        </div>
        <div className="frow">
          <div className="fg">
            <label className="flbl">Skill Level *</label>
            <select className="fsel" value={draft.skillLevel} onChange={e=>setDraft(d=>({...d,skillLevel:e.target.value}))}>
              <option value="">Select...</option>
              {SKILL_LEVELS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="flbl">Position</label>
            <select className="fsel" value={draft.position} onChange={e=>setDraft(d=>({...d,position:e.target.value}))}>
              <option value="">Select...</option>
              {POSITIONS.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="fg">
          <label className="flbl">Neighborhood</label>
          <select className="fsel" value={draft.neighborhood} onChange={e=>setDraft(d=>({...d,neighborhood:e.target.value}))}>
            <option value="">Select...</option>
            {NEIGHBORHOODS.map(n=><option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="fg">
          <label className="flbl">About You (optional)</label>
          <textarea className="fta" placeholder="SG from East Austin, been balling since '09..."
            value={draft.bio} onChange={e=>setDraft(d=>({...d,bio:e.target.value}))}/>
        </div>
      </div>
      <button className="btn btn-p" style={{marginTop:16}}
        onClick={saveProfile} disabled={!draft.name||!draft.skillLevel}>
        LET'S RUN
      </button>
    </div></>
  );

  const scoutH = `calc(100vh - 57px - 62px)`;

  return (
    <><style>{CSS}</style>
    <div className="app">
      <div className="hdr">
        <div className="logo">HOOPS<span>ATX</span></div>
        <div className="hdr-right">
          <div className="hdr-count">{games.length} runs live</div>
          <div className="av-sm" onClick={()=>setTab("profile")}>{initials(profile?.name)}</div>
        </div>
      </div>

      <div className="content" style={tab==="scout"?{overflow:"hidden"}:{}}>

        {tab==="feed" && (
          <div>
            <div className="feed-hdr">
              <div className="feed-ttl">FIND YOUR RUN</div>
              <div className="feed-sub">Austin pickup games this week</div>
            </div>
            <div className="filters">
              {["All",...SKILL_LEVELS].map(l=>(
                <button key={l} className={`chip ${filter===l?"on":""}`} onClick={()=>setFilter(l)}>{l}</button>
              ))}
            </div>
            <div className="glist">
              {filtered.length===0
                ? <div className="empty"><div className="e-ico">🏀</div><div className="e-ttl">NO RUNS FOUND</div><div className="e-txt">Be the first to post a game</div></div>
                : filtered.map(g=>{
                    const lc = LEVEL_COLORS[g.skillLevel]||LEVEL_COLORS.Intermediate;
                    const left = g.spotsTotal - g.players.length;
                    return (
                      <div key={g.id} className="gcard" style={{"--lc":lc.text,"--lb":lc.bg,"--lbc":lc.border}} onClick={()=>setSelGame(g)}>
                        <div className="gcard-top">
                          <div>
                            <div className="g-court">{g.court}</div>
                            <div className="g-addr">{g.neighborhood} · {g.address}</div>
                          </div>
                          <div className="sbadge">{g.skillLevel}</div>
                        </div>
                        <div className="gmeta">
                          <div className="mi"><span className="mi-ico">📅</span>{g.date}</div>
                          <div className="mi"><span className="mi-ico">🕐</span>{g.time}</div>
                        </div>
                        <div className="gfoot">
                          <div className="pavs">
                            {g.players.slice(0,5).map((p,i)=><div key={i} className="pav">{p.avatar}</div>)}
                            {g.players.length>5 && <div className="pav">+{g.players.length-5}</div>}
                          </div>
                          <div className={`spots${left<=2?" urg":""}`}>{left===0?"FULL":`${left} spot${left!==1?"s":""} left`}</div>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </div>
        )}

        {tab==="post" && (
          <div className="post-wrap">
            <div className="page-ttl">POST A RUN</div>
            <div className="page-sub">Let the city know you need players</div>
            <div className="fg">
              <label className="flbl">Court *</label>
              <select className="fsel" value={postForm.court} onChange={e=>setPostForm(f=>({...f,court:e.target.value}))}>
                <option value="">Select an Austin court...</option>
                {AUSTIN_COURTS.map(c=><option key={c.name} value={c.name}>{c.name} — {c.neighborhood}</option>)}
              </select>
            </div>
            <div className="frow">
              <div className="fg">
                <label className="flbl">Date *</label>
                <input type="date" className="fi" value={postForm.date} onChange={e=>setPostForm(f=>({...f,date:e.target.value}))}/>
              </div>
              <div className="fg">
                <label className="flbl">Time *</label>
                <input type="time" className="fi" value={postForm.time} onChange={e=>setPostForm(f=>({...f,time:e.target.value}))}/>
              </div>
            </div>
            <div className="frow">
              <div className="fg">
                <label className="flbl">Skill Level *</label>
                <select className="fsel" value={postForm.skillLevel} onChange={e=>setPostForm(f=>({...f,skillLevel:e.target.value}))}>
                  <option value="">Select...</option>
                  {SKILL_LEVELS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="fg">
                <label className="flbl">Total Spots</label>
                <input type="number" className="fi" min={2} max={20} value={postForm.spotsTotal} onChange={e=>setPostForm(f=>({...f,spotsTotal:e.target.value}))}/>
              </div>
            </div>
            <div className="fg">
              <label className="flbl">Description</label>
              <button className="ai-btn" onClick={aiDescribe} disabled={aiPosting}>{aiPosting?"✦ Writing...":"✦ AI Write Description"}</button>
              <textarea className="fta" placeholder="What should players know about this run?" value={postForm.description} onChange={e=>setPostForm(f=>({...f,description:e.target.value}))}/>
            </div>
            <button className="btn btn-p" style={{marginTop:8}} onClick={postGame}>POST THE RUN</button>
          </div>
        )}

        {tab==="scout" && (
          <div className="scout-wrap" style={{height:scoutH}}>
            <div className="scout-hdr">
              <div className="page-ttl">AI SCOUT</div>
              <div className="page-sub" style={{marginBottom:0}}>Find your perfect run — just ask</div>
            </div>
            {!chatLive && (
              <div className="suggs">
                <div className="slbl" style={{padding:"8px 0 2px"}}>Try asking</div>
                {[
                  "Find me a beginner-friendly game this weekend",
                  `Best game for a ${profile?.skillLevel||"intermediate"} player`,
                  "Which games in East Austin still have spots?",
                  "What are the best outdoor courts in Austin?",
                ].map(s=><button key={s} className="sugg" onClick={()=>sendChat(s)}>{s}</button>)}
              </div>
            )}
            <div className="chat-msgs">
              {msgs.map((m,i)=>(
                <div key={i} className={`cmsg ${m.role==="user"?"u":"a"}`}>
                  <div className="clbl">{m.role==="user"?(profile?.name||"You"):"HoopsScout AI"}</div>
                  <div className="cbbl">{m.content}</div>
                </div>
              ))}
              {chatBusy && (
                <div className="cmsg a">
                  <div className="clbl">HoopsScout AI</div>
                  <div className="typing"><div className="tdot"/><div className="tdot"/><div className="tdot"/></div>
                </div>
              )}
              <div ref={chatEnd}/>
            </div>
            <div className="chat-in-area">
              <input className="chat-in" placeholder="Ask about games, courts, players..."
                value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
              <button className="chat-send" onClick={()=>sendChat()} disabled={chatBusy||!chatIn.trim()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {tab==="profile" && profile && (
          <div className="prof-wrap">
            <div className="pcard">
              <div className="pav-lg">{initials(profile.name)}</div>
              <div className="pname">{profile.name.toUpperCase()}</div>
              {profile.neighborhood && <div className="phood">📍 {profile.neighborhood}</div>}
              <div className="ptags">
                {profile.skillLevel && <div className="ptag">{profile.skillLevel}</div>}
                {profile.position && <div className="ptag">{profile.position}</div>}
              </div>
              {profile.bio && <div className="pbio">{profile.bio}</div>}
            </div>
            <div className="stats">
              <div className="stile">
                <div className="sval">{games.filter(g=>g.players.some(p=>p.name===profile.name)).length}</div>
                <div className="slb">Games Joined</div>
              </div>
              <div className="stile">
                <div className="sval">{games.filter(g=>g.postedById===profile.id).length}</div>
                <div className="slb">Games Posted</div>
              </div>
            </div>
            <div className="slbl" style={{marginBottom:10}}>Your Runs</div>
            {games.filter(g=>g.players.some(p=>p.name===profile.name)).length===0
              ? <div className="empty" style={{padding:"20px 0"}}><div className="e-ico">🏀</div><div className="e-txt">Join or post a game to see it here</div></div>
              : <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:24}}>
                  {games.filter(g=>g.players.some(p=>p.name===profile.name)).map(g=>(
                    <div key={g.id} className="gcard" style={{"--lc":LEVEL_COLORS[g.skillLevel]?.text}} onClick={()=>{setSelGame(g);setTab("feed");}}>
                      <div className="g-court">{g.court}</div>
                      <div className="g-addr">{g.date} · {g.time} · {g.skillLevel}</div>
                    </div>
                  ))}
                </div>
            }
            <button className="edit-btn" onClick={()=>{ lsDel("hoops:profile"); setProfile(null); setState("onboarding"); }}>
              Edit Profile / Switch Player
            </button>
          </div>
        )}

      </div>

      <div className="tabs">
        {[{id:"feed",ico:"🏀",lbl:"Games"},{id:"post",ico:"➕",lbl:"Post"},{id:"scout",ico:"✦",lbl:"AI Scout"},{id:"profile",ico:"👤",lbl:"Profile"}].map(t=>(
          <button key={t.id} className={`tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>
            <span className="tab-ico">{t.ico}</span>{t.lbl}
          </button>
        ))}
      </div>

      {selGame && (
        <div className="overlay" onClick={e=>{ if(e.target===e.currentTarget) setSelGame(null); }}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-hdr">
              <div>
                <div style={{fontSize:10,fontFamily:"var(--f-mono)",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:3}}>{selGame.neighborhood}</div>
                <div className="m-court">{selGame.court}</div>
                <div className="m-addr">{selGame.address}</div>
              </div>
              <button className="modal-close" onClick={()=>setSelGame(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="info-grid">
                <div className="itile"><div className="itile-lbl">Date</div><div className="itile-val">{selGame.date}</div></div>
                <div className="itile"><div className="itile-lbl">Time</div><div className="itile-val">{selGame.time}</div></div>
                <div className="itile"><div className="itile-lbl">Level</div><div className="itile-val" style={{color:LEVEL_COLORS[selGame.skillLevel]?.text}}>{selGame.skillLevel}</div></div>
                <div className="itile"><div className="itile-lbl">Spots</div><div className="itile-val">{selGame.players.length}/{selGame.spotsTotal}</div></div>
              </div>
              <div className="slbl">About This Run</div>
              <div className="desc">{selGame.description}</div>
              <div className="posted-by">Posted by {selGame.postedBy}</div>
              <div className="slbl">Players ({selGame.players.length})</div>
              <div className="roster">
                {selGame.players.map((p,i)=>(
                  <div key={i} className="ri">
                    <div className="rav">{p.avatar}</div>
                    <div className="rname">{p.name}</div>
                    {i===0 && <div className="rhost">HOST</div>}
                  </div>
                ))}
              </div>
              {isJoined(selGame)
                ? <button className="btn btn-joined">✓ YOU'RE IN THIS RUN</button>
                : isFull(selGame)
                ? <button className="btn btn-full">GAME IS FULL</button>
                : <button className="btn btn-p" onClick={()=>joinGame(selGame.id)}>JOIN THIS RUN</button>
              }
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
    </>
  );
}