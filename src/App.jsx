import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// -------------------------------------------------------
// PASTE YOUR TWO SUPABASE VALUES HERE
const SUPABASE_URL = "https://blsaggvyrsqtmnvvhlvg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsc2FnZ3Z5cnNxdG1udnZobHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjIzMjgsImV4cCI6MjA5NDg5ODMyOH0.qPH7mxA5oF-94mNZ5b0ouAZvDnuZlL961poRxC6z5yE";
// -------------------------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MOODS = [
  // Happy & Uplifting
  { name: "Euphoric",    color: "#FFD700", light: "#FFFBE6", text: "#7A6000", group: "Happy & Uplifting" },
  { name: "Cheerful",    color: "#FF6EB4", light: "#FFF0F8", text: "#8C1A52", group: "Happy & Uplifting" },
  { name: "Feel Good",   color: "#97C459", light: "#EAF3DE", text: "#3B6D11", group: "Happy & Uplifting" },
  // Energetic & Powerful
  { name: "Energetic",   color: "#EF9F27", light: "#FAEEDA", text: "#854F0B", group: "Energetic & Powerful" },
  { name: "Triumphant",  color: "#E8871A", light: "#FDF0E0", text: "#7A3D00", group: "Energetic & Powerful" },
  { name: "Adventurous", color: "#FF7043", light: "#FBE9E7", text: "#7D2000", group: "Energetic & Powerful" },
  // Calm & Peaceful
  { name: "Serene",      color: "#1D9E75", light: "#E1F5EE", text: "#0F6E56", group: "Calm & Peaceful" },
  { name: "Laid-back",   color: "#66BB6A", light: "#E8F5E9", text: "#1B5E20", group: "Calm & Peaceful" },
  { name: "Warm",        color: "#FFAB76", light: "#FFF3E0", text: "#6D3B00", group: "Calm & Peaceful" },
  // Dreamy & Atmospheric
  { name: "Dreamy",      color: "#7F77DD", light: "#EEEDFE", text: "#534AB7", group: "Dreamy & Atmospheric" },
  { name: "Ethereal",    color: "#CE93D8", light: "#F3E5F5", text: "#6A1B9A", group: "Dreamy & Atmospheric" },
  { name: "Hypnotic",    color: "#5C6BC0", light: "#E8EAF6", text: "#1A237E", group: "Dreamy & Atmospheric" },
  // Sad & Reflective
  { name: "Melancholic", color: "#4A7BC4", light: "#EAF0FB", text: "#1E3F7A", group: "Sad & Reflective" },
  { name: "Nostalgic",   color: "#C4885A", light: "#FAF1E8", text: "#6B3E1A", group: "Sad & Reflective" },
  { name: "Vulnerable",  color: "#F48FB1", light: "#FCE4EC", text: "#880E4F", group: "Sad & Reflective" },
  // Dark & Intense
  { name: "Brooding",    color: "#444441", light: "#F1EFE8", text: "#2C2C2A", group: "Dark & Intense" },
  { name: "Haunting",    color: "#7B5EA7", light: "#F2EEF9", text: "#3D1F6E", group: "Dark & Intense" },
  { name: "Ominous",     color: "#37474F", light: "#ECEFF1", text: "#0D1B21", group: "Dark & Intense" },
  // Cinematic & Epic
  { name: "Epic",        color: "#1A3A6E", light: "#E8EDF7", text: "#0D1F40", group: "Cinematic & Epic" },
  { name: "Dramatic",    color: "#283593", light: "#E8EAF6", text: "#0D1257", group: "Cinematic & Epic" },
  { name: "Mysterious",  color: "#2C6E6E", light: "#E3F4F4", text: "#0F3D3D", group: "Cinematic & Epic" },
  // Romantic & Intimate
  { name: "Romantic",    color: "#D4537E", light: "#FBEAF0", text: "#993556", group: "Romantic & Intimate" },
  { name: "Passionate",  color: "#C2185B", light: "#FCE4EC", text: "#6D0030", group: "Romantic & Intimate" },
  { name: "Soulful",     color: "#AD1457", light: "#FCE4EC", text: "#4A0025", group: "Romantic & Intimate" },
  { name: "Tender",      color: "#F48FB1", light: "#FCE4EC", text: "#880E4F", group: "Romantic & Intimate" },
  { name: "Devoted",     color: "#E91E63", light: "#FCE4EC", text: "#880E4F", group: "Romantic & Intimate" },
  { name: "Longing",     color: "#880E4F", light: "#FCE4EC", text: "#3D0020", group: "Romantic & Intimate" },
  { name: "Infatuated",  color: "#FF4081", light: "#FFE4EE", text: "#8B0038", group: "Romantic & Intimate" },
  // Groovy & Fun
  { name: "Groovy",      color: "#00897B", light: "#E0F2F1", text: "#004D40", group: "Groovy & Fun" },
  { name: "Carefree",    color: "#FFC107", light: "#FFF8E1", text: "#6D4C00", group: "Groovy & Fun" },
  { name: "Summer",      color: "#FF8F00", light: "#FFF8E1", text: "#6D3800", group: "Groovy & Fun" },
];

const GROUPS = ["Happy & Uplifting","Energetic & Powerful","Calm & Peaceful","Dreamy & Atmospheric","Sad & Reflective","Dark & Intense","Cinematic & Epic","Romantic & Intimate","Groovy & Fun"];

const USERS = [
  { id: "you", name: "Jude",  initials: "JU", color: "#7F77DD", light: "#EEEDFE", text: "#534AB7" },
  { id: "her", name: "Sarra", initials: "SA", color: "#D4537E", light: "#FBEAF0", text: "#993556" },
];

// Extract dominant colour from album art using a canvas
async function getDominantColor(imgUrl) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 50; canvas.height = 50;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 50, 50);
        const d = ctx.getImageData(0, 0, 50, 50).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < d.length; i += 16) {
          r += d[i]; g += d[i+1]; b += d[i+2]; count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        resolve(`rgb(${r},${g},${b})`);
      } catch { resolve("#7F77DD"); }
    };
    img.onerror = () => resolve("#7F77DD");
    img.src = imgUrl;
  });
}

function Avatar({ user, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: user.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 500, color: user.text, flexShrink: 0 }}>
      {user.initials}
    </div>
  );
}

function MoodDot({ mood, size = 14, showName = false }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: size, height: size, borderRadius: "50%", background: mood.color, display: "inline-block", flexShrink: 0 }} />
      {showName && <span style={{ fontSize: 13, color: mood.text, background: mood.light, padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>{mood.name}</span>}
    </span>
  );
}

function SongCard({ share, currentUser, onSave, onDelete }) {
  const user = USERS.find(u => u.id === share.user_id);
  const mood = MOODS.find(m => m.name === share.mood_name) || { color: share.mood_color, light: share.mood_light, text: share.mood_text_color, name: share.mood_name };
  const isOwner = share.user_id === currentUser;
  const timeLabel = share.created_at ? new Date(share.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Just now";
  return (
    <div style={{ background: "var(--color-background-primary)", border: `1.5px solid ${mood.color}`, borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <img src={share.album_art} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.background = "#eee"; e.target.src = ""; }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <Avatar user={user} size={22} />
            <span style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>{user.name}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{timeLabel}</span>
          </div>
          <div style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{share.title}</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>{share.artist}</div>
          <MoodDot mood={mood} showName />
        </div>
      </div>
      {share.note && (
        <div style={{ marginTop: 12, fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6, borderLeft: `3px solid ${mood.color}`, paddingLeft: 12 }}>
          {share.note}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
        <a href={share.spotify_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#1DB954", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          Open in Spotify
        </a>
        {isOwner && (
          <>
            <button onClick={() => onSave(share.id, share.saved)} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, border: share.saved ? "1.5px solid #1DB954" : "1px solid var(--color-border-secondary)", background: share.saved ? "#E8F8EE" : "transparent", color: share.saved ? "#0F6E56" : "var(--color-text-secondary)", cursor: "pointer" }}>
              {share.saved ? "Saved" : "Save"}
            </button>
            <button onClick={() => onDelete(share.id)} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, border: "1px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-tertiary)", cursor: "pointer" }}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ShareModal({ onClose, onShare, currentUser }) {
  const [url, setUrl] = useState("");
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");
  const [save, setSave] = useState(false);
  const [meta, setMeta] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  function extractSpotifyId(u) {
    const m = u.match(/track\/([a-zA-Z0-9]+)/);
    return m ? m[1] : null;
  }

  async function getSpotifyToken() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Basic " + btoa(clientId + ":" + clientSecret) },
      body: "grant_type=client_credentials",
    });
    const data = await res.json();
    return data.access_token;
  }

  async function fetchMeta() {
    const id = extractSpotifyId(url);
    if (!id) { setMeta({ error: "Paste a Spotify track link" }); return; }
    setFetching(true);
    setMeta({ title: "Loading...", artist: "", albumArt: "" });
    try {
      const token = await getSpotifyToken();
      const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
      const track = await res.json();
      setMeta({ title: track.name, artist: track.artists.map(a => a.name).join(", "), albumArt: track.album.images[0]?.url || "" });
    } catch { setMeta({ error: "Couldn't fetch track info. Check the link and try again." }); }
    setFetching(false);
  }

  async function handleShare() {
    if (!meta || !mood || meta.error) return;
    setSaving(true);
    const { data, error } = await supabase.from("shares").insert([{
      user_id: currentUser, spotify_url: url, title: meta.title, artist: meta.artist,
      album_art: meta.albumArt, mood_name: mood.name, mood_color: mood.color,
      mood_light: mood.light, mood_text_color: mood.text, note, saved: save,
    }]).select().single();
    setSaving(false);
    if (!error && data) { onShare(data); onClose(); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 100, overflowY: "auto", padding: "16px 0 32px" }}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 20, padding: "1.5rem", width: 460, maxWidth: "95vw", border: "1px solid var(--color-border-secondary)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#111" }}>Share a song</span>
          <button onClick={onClose} style={{ background: "none", border: "1.5px solid #ddd", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", color: "#555", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste Spotify track link..." style={{ flex: 1, fontSize: 14, border: "1.5px solid #ccc", borderRadius: 8, padding: "9px 12px", background: "#fff", color: "#111", outline: "none" }} />
          <button onClick={fetchMeta} disabled={fetching} style={{ padding: "0 14px", fontSize: 13, whiteSpace: "nowrap", border: "1.5px solid #ccc", borderRadius: 8, cursor: "pointer", background: "#f5f5f5", color: "#333", fontWeight: 500 }}>Preview</button>
        </div>
        {meta && !meta.error && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, padding: "10px 12px", background: "#f9f9f9", borderRadius: 8, border: "1.5px solid #ddd" }}>
            {meta.albumArt && <img src={meta.albumArt} alt="" style={{ width: 44, height: 44, borderRadius: 6 }} />}
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{meta.title}</div>
              <div style={{ fontSize: 13, color: "#555" }}>{meta.artist}</div>
            </div>
          </div>
        )}
        {meta?.error && <div style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>{meta.error}</div>}
        <div style={{ marginBottom: 12, maxHeight: 220, overflowY: "auto", paddingRight: 4, border: "1.5px solid #ddd", borderRadius: 10, padding: "10px 12px", background: "#fafafa" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 10 }}>Mood</div>
          {GROUPS.map(group => (
            <div key={group} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{group}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MOODS.filter(m => m.group === group).map(m => (
                  <button key={m.name} onClick={() => setMood(m)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, border: mood?.name === m.name ? `2px solid ${m.color}` : "1.5px solid #ddd", background: mood?.name === m.name ? m.light : "#fff", color: mood?.name === m.name ? m.text : "#333", fontSize: 13, cursor: "pointer", fontWeight: mood?.name === m.name ? 600 : 400 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: m.color, display: "inline-block" }} />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How did this song make you feel? (optional)" rows={2} style={{ width: "100%", fontSize: 14, resize: "none", borderRadius: 8, padding: "10px 12px", border: "1.5px solid #ccc", background: "#fff", color: "#111", boxSizing: "border-box", outline: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555", cursor: "pointer" }}>
            <input type="checkbox" checked={save} onChange={e => setSave(e.target.checked)} />
            Save to collection
          </label>
          <button onClick={handleShare} disabled={!meta || !mood || !!meta.error || saving} style={{ padding: "8px 20px", fontSize: 14, fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer", background: "#1DB954", color: "#fff", opacity: (!meta || !mood || !!meta.error || saving) ? 0.5 : 1 }}>
            {saving ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsPage({ shares }) {
  const moodCounts = {}, artistCounts = {};
  shares.forEach(s => {
    moodCounts[s.mood_name] = (moodCounts[s.mood_name] || 0) + 1;
    artistCounts[s.artist] = (artistCounts[s.artist] || 0) + 1;
  });
  const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topArtists = Object.entries(artistCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Songs shared", value: shares.length },
          { label: "Songs saved", value: shares.filter(s => s.saved).length },
          { label: "Unique artists", value: Object.keys(artistCounts).length },
          { label: "Moods used", value: Object.keys(moodCounts).length },
        ].map(stat => (
          <div key={stat.label} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "1rem", textAlign: "center", border: "1px solid var(--color-border-secondary)" }}>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 500 }}>{stat.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 }}>
        <div style={{ fontWeight: 500, marginBottom: 12 }}>Top moods</div>
        {topMoods.length === 0 && <div style={{ color: "var(--color-text-tertiary)", fontSize: 14 }}>No data yet</div>}
        {topMoods.map(([name, count]) => {
          const mood = MOODS.find(m => m.name === name) || { color: "#888", light: "#eee", text: "#444", name };
          const pct = Math.round((count / shares.length) * 100);
          return (
            <div key={name} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MoodDot mood={mood} showName /></span>
                <span style={{ color: "var(--color-text-secondary)" }}>{count} song{count !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: mood.color, borderRadius: 999 }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)", borderRadius: 12, padding: "1rem 1.25rem" }}>
        <div style={{ fontWeight: 500, marginBottom: 12 }}>Top artists</div>
        {topArtists.length === 0 && <div style={{ color: "var(--color-text-tertiary)", fontSize: 14 }}>No data yet</div>}
        {topArtists.map(([artist, count], i) => (
          <div key={artist} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < topArtists.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-background-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 14 }}>{artist}</span>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("feed");
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState("you");
  const [notif, setNotif] = useState(null);
  const [bgColor, setBgColor] = useState("#7F77DD");

  useEffect(() => {
    fetchShares();
    const channel = supabase.channel("shares-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "shares" }, payload => {
        if (payload.eventType === "INSERT") {
          setShares(prev => [payload.new, ...prev]);
          if (payload.new.user_id !== currentUser) {
            const sharer = USERS.find(u => u.id === payload.new.user_id);
            setNotif(`${sharer?.name || "Someone"} just shared a song 🎵`);
            setTimeout(() => setNotif(null), 4000);
          }
          if (payload.new.album_art) extractBgColor(payload.new.album_art);
        }
        if (payload.eventType === "UPDATE") setShares(prev => prev.map(s => s.id === payload.new.id ? payload.new : s));
        if (payload.eventType === "DELETE") setShares(prev => prev.filter(s => s.id !== payload.old.id));
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function extractBgColor(imgUrl) {
    const color = await getDominantColor(imgUrl);
    setBgColor(color);
  }

  async function fetchShares() {
    setLoading(true);
    const { data, error } = await supabase.from("shares").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch error:", error);
    const rows = data || [];
    setShares(rows);
    setLoading(false);
    if (rows[0]?.album_art) extractBgColor(rows[0].album_art);
  }

  async function handleSave(id, current) {
    await supabase.from("shares").update({ saved: !current }).eq("id", id);
  }

  async function handleDelete(id) {
    await supabase.from("shares").delete().eq("id", id);
  }

  function handleShare(share) {
    setShares(prev => [share, ...prev]);
    if (share.album_art) extractBgColor(share.album_art);
    setNotif("Shared! 🎵");
    setTimeout(() => setNotif(null), 3000);
  }

  const savedShares = shares.filter(s => s.saved);
  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "saved", label: "Saved" },
    { id: "stats", label: "Stats" },
  ];

  return (
    <div style={{
      maxWidth: 520, margin: "0 auto", padding: "1rem", fontFamily: "var(--font-sans)",
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${bgColor}33 0%, ${bgColor}11 40%, transparent 70%)`,
      transition: "background 1.5s ease"
    }}>
      {notif && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#1DB954", color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 14, fontWeight: 500, zIndex: 200, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          {notif}
        </div>
      )}
      {showModal && <ShareModal onClose={() => setShowModal(false)} onShare={handleShare} currentUser={currentUser} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 20, color: "var(--color-text-primary)" }}>Our Music Space</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Sharing as: {USERS.find(u => u.id === currentUser).name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select value={currentUser} onChange={e => setCurrentUser(e.target.value)} style={{ fontSize: 13, padding: "4px 8px", border: "1px solid var(--color-border-secondary)", borderRadius: 8, background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }}>
            {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <button onClick={() => setShowModal(true)} style={{ padding: "7px 14px", fontSize: 14, fontWeight: 500, background: "#1DB954", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
            + Share
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--color-background-secondary)", borderRadius: 10, padding: 4, border: "1px solid var(--color-border-secondary)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: tab === t.id ? "1px solid var(--color-border-secondary)" : "1px solid transparent", background: tab === t.id ? "var(--color-background-primary)" : "transparent", color: tab === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 500 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>
      {loading && <div style={{ textAlign: "center", color: "var(--color-text-tertiary)", padding: "2rem" }}>Loading...</div>}
      {!loading && tab === "feed" && (
        <div>
          {shares.length === 0 && <div style={{ textAlign: "center", color: "var(--color-text-tertiary)", padding: "2rem" }}>No shares yet. Be the first!</div>}
          {shares.map(s => <SongCard key={s.id} share={s} currentUser={currentUser} onSave={handleSave} onDelete={handleDelete} />)}
        </div>
      )}
      {!loading && tab === "saved" && (
        <div>
          {savedShares.length === 0 && <div style={{ textAlign: "center", color: "var(--color-text-tertiary)", padding: "2rem" }}>No saved songs yet.</div>}
          {savedShares.map(s => <SongCard key={s.id} share={s} currentUser={currentUser} onSave={handleSave} onDelete={handleDelete} />)}
        </div>
      )}
      {!loading && tab === "stats" && <StatsPage shares={shares} />}
    </div>
  );
}
