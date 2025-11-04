import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function App(){
  const [accent, setAccent] = useState("#ff0040"); // red-electric default
  const [preset, setPreset] = useState("red-electric");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeVolume, setActiveVolume] = useState("AI Tools");
  const [activeTool, setActiveTool] = useState(null);
  const [query, setQuery] = useState("");

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const presets = {
    "red-electric":"#ff0040",
    "neon-green":"#00ff88",
    "electric-blue":"#00baff",
    "hot-pink":"#ff3ecf"
  };

  useEffect(()=>{ setAccent(presets[preset] || "#ff0040"); },[preset]);

  const volumes = {
    "AI Tools":[ {id:"t1", name:"Text to Image", desc:"Generate images from prompts"}, {id:"t2", name:"Text to Speech", desc:"Convert text into natural audio"} ],
    "Web Tools":[ {id:"t3", name:"Video Downloader", desc:"Download videos quickly"}, {id:"t4", name:"URL Shortener", desc:"Shorten links"} ],
    "Utility Tools":[ {id:"t5", name:"Password Generator", desc:"Create secure passwords"}, {id:"t6", name:"QR Code", desc:"Generate QR codes"} ]
  };

  const tools = Object.values(volumes).flat();
  const filtered = tools.filter(t=> t.name.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase()));

  function renderToolDetail(tool){
    if(!tool) return <div className="text-gray-400">Select a tool to open its interface.</div>;
    switch(tool.id){
      case "t1": return (<div><h3 style={{textShadow:`0 6px 24px ${accent}88`}} className="text-2xl font-bold">{tool.name}</h3><p className="text-sm text-gray-300 mt-2">{tool.desc}</p></div>);
      case "t2": return (<div><h3 style={{textShadow:`0 6px 24px ${accent}88`}} className="text-2xl font-bold">{tool.name}</h3><p className="text-sm text-gray-300 mt-2">{tool.desc}</p></div>);
      default: return (<div><h3 className="text-lg">{tool.name}</h3><p className="text-sm text-gray-300">{tool.desc}</p></div>);
    }
  }

  // audio handlers
  function togglePlay(){
    const a = audioRef.current;
    if(!a) return;
    if(a.paused){ a.play(); setPlaying(true); } else { a.pause(); setPlaying(false); }
  }
  function onTimeUpdate(){
    const a = audioRef.current;
    if(!a) return;
    setProgress((a.currentTime / a.duration) || 0);
  }
  function onSeek(e){
    const a = audioRef.current;
    if(!a) return;
    const pct = Number(e.target.value);
    a.currentTime = a.duration * pct;
    setProgress(pct);
  }

  // canvas animation
  useEffect(()=>{
    const canvas = document.getElementById("animCanvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    const lines = [];
    const N = 30;
    for(let i=0;i<N;i++){
      lines.push({x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5, len:80+Math.random()*120});
    }
    let raf;
    function resize(){ w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
    window.addEventListener("resize", resize);
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(let i=0;i<lines.length;i++){
        const L = lines[i];
        L.x += L.vx; L.y += L.vy;
        if(L.x<0||L.x>w) L.vx *= -1;
        if(L.y<0||L.y>h) L.vy *= -1;
        ctx.beginPath();
        ctx.moveTo(L.x, L.y);
        ctx.lineTo((L.x+Math.sin((Date.now()/1000)+i)*L.len), (L.y+Math.cos((Date.now()/1000)+i)*L.len*0.3));
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [accent]);

  return (
    <div className="relative min-h-screen text-white" style={{background:"#000"}}>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <canvas id="animCanvas" style={{width:"100%",height:"100%"}}></canvas>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={()=>setMenuOpen(!menuOpen)} className="p-2 rounded-md border" style={{borderColor:accent}}>
              <div className="space-y-1">
                <span className="block w-5 h-0.5" style={{background:accent}}/>
                <span className="block w-5 h-0.5" style={{background:accent}}/>
                <span className="block w-5 h-0.5" style={{background:accent}}/>
              </div>
            </button>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold" style={{background:accent,color:"#111"}}>LE</div>
            <div>
              <h1 className="text-2xl font-extrabold neon-text" style={{textShadow:`0 8px 30px ${accent}80`}}>Welcome to Legend Expert</h1>
              <p className="text-sm text-gray-300">Black neon dashboard — strong red vibe</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select value={preset} onChange={(e)=>setPreset(e.target.value)} className="p-2 rounded-md bg-[#071014]" style={{border:`1px solid ${accent}`}}>
              {Object.keys(presets).map(k=>(<option key={k} value={k}>{k.replace("-"," ")}</option>))}
            </select>
            <input type="color" value={accent} onChange={(e)=>setAccent(e.target.value)} className="w-10 h-8 p-0 border-0"/>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <aside className={`col-span-12 md:col-span-3 lg:col-span-3 ${menuOpen? '':'-translate-x-2'}`}>
            <div className="bg-[#020807] rounded-2xl p-4" style={{boxShadow:`0 12px 40px ${accent}33`, borderColor:accent}}>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search tools..." className="w-full p-2 rounded-md bg-[#071014] text-sm"/>
              <h3 className="text-sm font-semibold text-gray-200 mt-3">{activeVolume}</h3>
              <div className="mt-3 space-y-2">
                {(query?filtered:volumes[activeVolume]).map((t,idx)=>(

... (paste full file until end)
