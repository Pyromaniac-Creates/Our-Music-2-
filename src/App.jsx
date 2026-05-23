import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://blsaggvyrsqtmnvvhlvg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsc2FnZ3Z5cnNxdG1udnZobHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjIzMjgsImV4cCI6MjA5NDg5ODMyOH0.qPH7mxA5oF-94mNZ5b0ouAZvDnuZlL961poRxC6z5yE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MOODS = [
  { name: "Euphoric",    color: "#FFD700", light: "#FFFBE6", text: "#7A6000", group: "Happy & Uplifting" },
  { name: "Cheerful",    color: "#FF6EB4", light: "#FFF0F8", text: "#8C1A52", group: "Happy & Uplifting" },
  { name: "Feel Good",   color: "#97C459", light: "#EAF3DE", text: "#3B6D11", group: "Happy & Uplifting" },
  { name: "Energetic",   color: "#EF9F27", light: "#FAEEDA", text: "#854F0B", group: "Energetic & Powerful" },
  { name: "Triumphant",  color: "#E8871A", light: "#FDF0E0", text: "#7A3D00", group: "Energetic & Powerful" },
  { name: "Adventurous", color: "#FF7043", light: "#FBE9E7", text: "#7D2000", group: "Energetic & Powerful" },
  { name: "Serene",      color: "#1D9E75", light: "#E1F5EE", text: "#0F6E56", group: "Calm & Peaceful" },
  { name: "Laid-back",   color: "#66BB6A", light: "#E8F5E9", text: "#1B5E20", group: "Calm & Peaceful" },
  { name: "Warm",        color: "#FFAB76", light: "#FFF3E0", text: "#6D3B00", group: "Calm & Peaceful" },
  { name: "Dreamy",      color: "#7F77DD", light: "#EEEDFE", text: "#534AB7", group: "Dreamy & Atmospheric" },
  { name: "Ethereal",    color: "#CE93D8", light: "#F3E5F5", text: "#6A1B9A", group: "Dreamy & Atmospheric" },
  { name: "Hypnotic",    color: "#5C6BC0", light: "#E8EAF6", text: "#1A237E", group: "Dreamy & Atmospheric" },
  { name: "Melancholic", color: "#4A7BC4", light: "#EAF0FB", text: "#1E3F7A", group: "Sad & Reflective" },
  { name: "Nostalgic",   color: "#C4885A", light: "#FAF1E8", text: "#6B3E1A", group: "Sad & Reflective" },
  { name: "Vulnerable",  color: "#F48FB1", light: "#FCE4EC", text: "#880E4F", group: "Sad & Reflective" },
  { name: "Brooding",    color: "#444441", light: "#F1EFE8", text: "#2C2C2A", group: "Dark & Intense" },
  { name: "Haunting",    color: "#7B5EA7", light: "#F2EEF9", text: "#3D1F6E", group: "Dark & Intense" },
  { name: "Ominous",     color: "#37474F", light: "#ECEFF1", text: "#0D1B21", group: "Dark & Intense" },
  { name: "Epic",        color: "#1A3A6E", light: "#E8EDF7", text: "#0D1F40", group: "Cinematic & Epic" },
  { name: "Dramatic",    color: "#283593", light: "#E8EAF6", text: "#0D1257", group: "Cinematic & Epic" },
  { name: "Mysterious",  color: "#2C6E6E", light: "#E3F4F4", text: "#0F3D3D", group: "Cinematic & Epic" },
  { name: "Romantic",    color: "#D4537E", light: "#FBEAF0", text: "#993556", group: "Romantic & Intimate" },
  { name: "Passionate",  color: "#C2185B", light: "#FCE4EC", text: "#6D0030", group: "Romantic & Intimate" },
  { name: "Soulful",     color: "#AD1457", light: "#FCE4EC", text: "#4A0025", group: "Romantic & Intimate" },
  { name: "Tender",      color: "#F48FB1", light: "#FCE4EC", text: "#880E4F", group: "Romantic & Intimate" },
  { name: "Devoted",     color: "#E91E63", light: "#FCE4EC", text: "#880E4F", group: "Romantic & Intimate" },
  { name: "Longing",     color: "#880E4F", light: "#FCE4EC", text: "#3D0020", group: "Romantic & Intimate" },
  { name: "Infatuated",  color: "#FF4081", light: "#FFE4EE", text: "#8B0038", group: "Romantic & Intimate" },
  { name: "Groovy",      color: "#00897B", light: "#E0F2F1", text: "#004D40", group: "Groovy & Fun" },
  { name: "Carefree",    color: "#FFC107", light: "#FFF8E1", text: "#6D4C00", group: "Groovy & Fun" },
  { name: "Summer",      color: "#FF8F00", light: "#FFF8E1", text: "#6D3800", group: "Groovy & Fun" },
];

const GROUPS = ["Happy & Uplifting","Energetic & Powerful","Calm & Peaceful","Dreamy & Atmospheric","Sad & Reflective","Dark & Intense","Cinematic & Epic","Romantic & Intimate","Groovy & Fun"];

const USERS = [
  { id: "you", name: "Jude",  initials: "JK", color: "#A07850", light: "#F5EDE0", text: "#5C3D1E" },
  { id: "her", name: "Sarra", initials: "SZ", color: "#C2185B", light: "#FCE4EC", text: "#6D0030" },
];

const WARM = {
  bg: "#FDFAF6",
  card: "#FFFFFF",
  cardBorder: "#EDE8E0",
  text: "#2C1A0E",
  textSoft: "#7A6650",
  textMuted: "#B0A090",
  accent: "#A07850",
  accentLight: "#F5EDE0",
  divider: "#EDE8E0",
  inputBg: "#FAF7F2",
  inputBorder: "#DDD5C8",
  tabBg: "#F0EBE3",
  shadow: "0 2px 16px rgba(100,60,20,0.08)",
  shadowHover: "0 4px 24px rgba(100,60,20,0.13)",
};

// Convert "rgb(r,g,b)" string to rgba with opacity
function toRgba(rgbStr, opacity) {
  const match = rgbStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return `rgba(160,136,90,${opacity})`;
  return `rgba(${match[1]},${match[2]},${match[3]},${opacity})`;
}

async function getDominantColors(imgUrl) {
  try {
    const res = await fetch(`/api/color?url=${encodeURIComponent(imgUrl)}&t=${Date.now()}`);
    if (!res.ok) throw new Error("color fetch failed");
    const { color1, color2 } = await res.json();
    return [color1, color2];
  } catch {
    return ["rgb(196,136,90)", "rgb(127,119,221)"];
  }
}

function Avatar({ user, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: user.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 600, color: user.color, flexShrink: 0, border: `1.5px solid ${user.color}33`, letterSpacing: 0.5 }}>
      {user.initials}
    </div>
  );
}

function MoodPill({ mood, showName = false }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: mood.light, border: `1px solid ${mood.color}44`, borderRadius: 999, padding: showName ? "3px 10px 3px 7px" : "3px 7px" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: mood.color, display: "inline-block", flexShrink: 0 }} />
      {showName && <span style={{ fontSize: 12, color: mood.text, fontWeight: 600, letterSpacing: 0.2 }}>{mood.name}</span>}
    </span>
  );
}

function SongCard({ share, currentUser, onSave, onDelete }) {
  const user = USERS.find(u => u.id === share.user_id);
  const mood = MOODS.find(m => m.name === share.mood_name) || { color: share.mood_color, light: share.mood_light, text: share.mood_text_color, name: share.mood_name };
  const isOwner = share.user_id === currentUser;
  const timeLabel = share.created_at ? new Date(share.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Just now";
  return (
    <div style={{ background: WARM.card, border: `1px solid ${WARM.cardBorder}`, borderLeft: `3.5px solid ${mood.color}`, borderRadius: 14, padding: "1.1rem 1.25rem", marginBottom: 14, boxShadow: WARM.shadow }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <img src={share.album_art} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} onError={e => { e.target.style.background = "#eee"; e.target.src = ""; }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Avatar user={user} size={22} />
              <span style={{ fontWeight: 600, fontSize: 13, color: user.color }}>{user.name}</span>
            </div>
            <span style={{ fontSize: 11, color: WARM.textMuted }}>{timeLabel}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: WARM.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>{share.title}</div>
          <div style={{ fontSize: 13, color: WARM.textSoft, marginBottom: 8 }}>{share.artist}</div>
          <MoodPill mood={mood} showName />
        </div>
      </div>
      {share.note && (
        <div style={{ marginTop: 12, fontSize: 13.5, color: WARM.textSoft, lineHeight: 1.65, background: WARM.inputBg, borderRadius: 8, padding: "10px 14px", fontStyle: "italic", border: `1px solid ${WARM.divider}` }}>
          "{share.note}"
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", paddingTop: 10, borderTop: `1px solid ${WARM.divider}` }}>
        <a href={share.spotify_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#1DB954", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 5, background: "#F0FBF3", border: "1px solid #1DB95433", borderRadius: 999, padding: "4px 10px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          Play on Spotify
        </a>
        <div style={{ flex: 1 }} />
        {isOwner && (
          <>
            <button onClick={() => onSave(share.id, share.saved)} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, border: share.saved ? `1.5px solid #1DB954` : `1px solid ${WARM.inputBorder}`, background: share.saved ? "#F0FBF3" : "transparent", color: share.saved ? "#1DB954" : WARM.textSoft, cursor: "pointer", fontWeight: 500 }}>
              {share.saved ? "✓ Saved" : "Save"}
            </button>
            <button onClick={() => onDelete(share.id)} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, border: `1px solid ${WARM.inputBorder}`, background: "transparent", color: WARM.textMuted, cursor: "pointer" }}>
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(40,20,5,0.55)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 100, overflowY: "auto", padding: "20px 0 40px" }}>
      <div style={{ background: WARM.bg, borderRadius: 22, padding: "1.6rem", width: 460, maxWidth: "95vw", border: `1px solid ${WARM.cardBorder}`, boxShadow: "0 32px 80px rgba(60,30,10,0.22)", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: WARM.text }}>Share a song</div>
            <div style={{ fontSize: 12, color: WARM.textMuted, marginTop: 2 }}>What are you listening to?</div>
          </div>
          <button onClick={onClose} style={{ background: WARM.tabBg, border: `1px solid ${WARM.cardBorder}`, borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: WARM.textSoft, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste Spotify track link..." style={{ flex: 1, fontSize: 14, border: `1.5px solid ${WARM.inputBorder}`, borderRadius: 10, padding: "10px 14px", background: WARM.inputBg, color: WARM.text, outline: "none", fontFamily: "inherit" }} />
          <button onClick={fetchMeta} disabled={fetching} style={{ padding: "0 16px", fontSize: 13, whiteSpace: "nowrap", border: `1.5px solid ${WARM.inputBorder}`, borderRadius: 10, cursor: "pointer", background: WARM.accentLight, color: WARM.accent, fontWeight: 600, fontFamily: "inherit" }}>Preview</button>
        </div>
        {meta && !meta.error && (
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, padding: "12px 14px", background: WARM.card, borderRadius: 10, border: `1px solid ${WARM.cardBorder}`, boxShadow: WARM.shadow }}>
            {meta.albumArt && <img src={meta.albumArt} alt="" style={{ width: 48, height: 48, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: WARM.text }}>{meta.title}</div>
              <div style={{ fontSize: 12, color: WARM.textSoft, marginTop: 2 }}>{meta.artist}</div>
            </div>
          </div>
        )}
        {meta?.error && <div style={{ fontSize: 13, color: "#c0392b", marginBottom: 12, padding: "8px 12px", background: "#FEF0F0", borderRadius: 8, border: "1px solid #f5c6c6" }}>{meta.error}</div>}
        <div style={{ marginBottom: 14, maxHeight: 230, overflowY: "auto", border: `1.5px solid ${WARM.inputBorder}`, borderRadius: 12, padding: "12px 14px", background: WARM.inputBg }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: WARM.textSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Choose a mood</div>
          {GROUPS.map(group => (
            <div key={group} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: WARM.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>{group}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MOODS.filter(m => m.group === group).map(m => (
                  <button key={m.name} onClick={() => setMood(m)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999, border: mood?.name === m.name ? `2px solid ${m.color}` : `1.5px solid ${WARM.inputBorder}`, background: mood?.name === m.name ? m.light : WARM.card, color: mood?.name === m.name ? m.text : WARM.textSoft, fontSize: 13, cursor: "pointer", fontWeight: mood?.name === m.name ? 700 : 400, fontFamily: "inherit" }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: m.color, display: "inline-block" }} />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How did this song make you feel? (optional)" rows={2} style={{ width: "100%", fontSize: 14, resize: "none", borderRadius: 10, padding: "11px 14px", border: `1.5px solid ${WARM.inputBorder}`, background: WARM.inputBg, color: WARM.text, boxSizing: "border-box", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: WARM.textSoft, cursor: "pointer" }}>
            <input type="checkbox" checked={save} onChange={e => setSave(e.target.checked)} />
            Save to collection
          </label>
          <button onClick={handleShare} disabled={!meta || !mood || !!meta.error || saving} style={{ padding: "10px 24px", fontSize: 14, fontWeight: 700, border: "none", borderRadius: 10, cursor: "pointer", background: saving || !meta || !mood || !!meta.error ? WARM.tabBg : "#1DB954", color: saving || !meta || !mood || !!meta.error ? WARM.textMuted : "#fff", fontFamily: "inherit", letterSpacing: 0.3 }}>
            {saving ? "Sharing..." : "Share ♫"}
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
          { label: "Songs shared", value: shares.length, icon: "♫" },
          { label: "Songs saved", value: shares.filter(s => s.saved).length, icon: "♡" },
          { label: "Unique artists", value: Object.keys(artistCounts).length, icon: "✦" },
          { label: "Moods used", value: Object.keys(moodCounts).length, icon: "◉" },
        ].map(stat => (
          <div key={stat.label} style={{ background: WARM.card, borderRadius: 12, padding: "1.1rem", textAlign: "center", border: `1px solid ${WARM.cardBorder}`, boxShadow: WARM.shadow }}>
            <div style={{ fontSize: 22, marginBottom: 4, color: WARM.accent }}>{stat.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: WARM.text, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: WARM.textMuted, fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: WARM.card, border: `1px solid ${WARM.cardBorder}`, borderRadius: 14, padding: "1.2rem 1.4rem", marginBottom: 14, boxShadow: WARM.shadow }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: WARM.text, marginBottom: 14 }}>Top moods</div>
        {topMoods.length === 0 && <div style={{ color: WARM.textMuted, fontSize: 14 }}>No data yet</div>}
        {topMoods.map(([name, count]) => {
          const mood = MOODS.find(m => m.name === name) || { color: "#888", light: "#eee", text: "#444", name };
          const pct = Math.round((count / shares.length) * 100);
          return (
            <div key={name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <MoodPill mood={mood} showName />
                <span style={{ color: WARM.textMuted, fontSize: 12 }}>{count} song{count !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ height: 5, background: WARM.tabBg, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: mood.color, borderRadius: 999, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: WARM.card, border: `1px solid ${WARM.cardBorder}`, borderRadius: 14, padding: "1.2rem 1.4rem", boxShadow: WARM.shadow }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: WARM.text, marginBottom: 14 }}>Top artists</div>
        {topArtists.length === 0 && <div style={{ color: WARM.textMuted, fontSize: 14 }}>No data yet</div>}
        {topArtists.map(([artist, count], i) => (
          <div key={artist} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topArtists.length - 1 ? `1px solid ${WARM.divider}` : "none" }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: WARM.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: WARM.accent, fontWeight: 700 }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 14, color: WARM.text, fontWeight: 500 }}>{artist}</span>
            <span style={{ fontSize: 12, color: WARM.textMuted }}>{count} share{count !== 1 ? "s" : ""}</span>
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
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("currentUser") || "you");
  const [notif, setNotif] = useState(null);
  const [bgColors, setBgColors] = useState(["rgb(196,136,90)", "rgb(127,119,221)"]);

  async function registerPush(userId) {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
      const existing = await reg.pushManager.getSubscription();
      const sub = existing || await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
      });
      await supabase.from("subscriptions").upsert(
        { user_id: userId, subscription: JSON.stringify(sub) },
        { onConflict: "user_id" }
      );
    } catch (err) { console.error("Push registration error:", err); }
  }

  async function sendPushToOther(share) {
    const otherId = share.user_id === "you" ? "her" : "you";
    const sharer = USERS.find(u => u.id === share.user_id);
    const { data } = await supabase.from("subscriptions").select("subscription").eq("user_id", otherId).single();
    if (!data) return;
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: data.subscription,
        title: `${sharer.name} shared a song 🎵`,
        body: `${share.title} — ${share.artist}`,
        url: "/"
      })
    });
  }

  async function extractBgColors(imgUrl) {
    const colors = await getDominantColors(imgUrl);
    setBgColors(colors);
  }

  async function fetchShares() {
    setLoading(true);
    const { data, error } = await supabase.from("shares").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch error:", error);
    const rows = data || [];
    setShares(rows);
    setLoading(false);
    if (rows[0]?.album_art) extractBgColors(rows[0].album_art);
  }

  useEffect(() => {
    fetchShares();
    registerPush(currentUser);
    const channel = supabase.channel("shares-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "shares" }, payload => {
        if (payload.eventType === "INSERT") {
          setShares(prev => [payload.new, ...prev]);
          if (payload.new.user_id !== currentUser) {
            const sharer = USERS.find(u => u.id === payload.new.user_id);
            setNotif(`${sharer?.name || "Someone"} just shared a song 🎵`);
            setTimeout(() => setNotif(null), 4000);
          }
          if (payload.new.album_art) extractBgColors(payload.new.album_art);
        }
        if (payload.eventType === "UPDATE") setShares(prev => prev.map(s => s.id === payload.new.id ? payload.new : s));
        if (payload.eventType === "DELETE") setShares(prev => prev.filter(s => s.id !== payload.old.id));
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function handleSave(id, current) {
    await supabase.from("shares").update({ saved: !current }).eq("id", id);
  }

  async function handleDelete(id) {
    await supabase.from("shares").delete().eq("id", id);
  }

  function handleShare(share) {
    setShares(prev => [share, ...prev]);
    if (share.album_art) extractBgColors(share.album_art);
    setNotif("Shared! 🎵");
    setTimeout(() => setNotif(null), 3000);
    sendPushToOther(share);
  }

  function handleUserChange(userId) {
    setCurrentUser(userId);
    localStorage.setItem("currentUser", userId);
    registerPush(userId);
  }

  const savedShares = shares.filter(s => s.saved);
  const user = USERS.find(u => u.id === currentUser);
  const tabs = ["Feed", "Saved", "Stats"];

  // Convert rgb() strings to rgba() with proper opacity for the gradient
  const grad1 = toRgba(bgColors[0], 0.45);
  const grad2 = toRgba(bgColors[1], 0.30);

  return (
    <div style={{
      maxWidth: 520, margin: "0 auto", padding: "1.2rem 1rem 3rem",
      fontFamily: "'Georgia', serif", minHeight: "100vh",
      background: `linear-gradient(135deg, ${grad1} 0%, ${grad2} 100%)`,
      transition: "background 1.5s ease"
    }}>
      {notif && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: WARM.text, color: "#fff", padding: "11px 22px", borderRadius: 999, fontSize: 14, fontWeight: 600, zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
          {notif}
        </div>
      )}
      {showModal && <ShareModal onClose={() => setShowModal(false)} onShare={handleShare} currentUser={currentUser} />}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 24, color: WARM.text, letterSpacing: -0.5 }}>Our Music Space</div>
            <div style={{ fontSize: 13, color: WARM.textMuted, marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
              <Avatar user={user} size={18} />
              Sharing as <span style={{ color: user.color, fontWeight: 600 }}>{user.name}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select value={currentUser} onChange={e => handleUserChange(e.target.value)} style={{ fontSize: 13, padding: "6px 10px", border: `1px solid ${WARM.inputBorder}`, borderRadius: 8, background: WARM.inputBg, color: WARM.textSoft, fontFamily: "inherit", cursor: "pointer" }}>
              {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <button onClick={() => setShowModal(true)} style={{ padding: "8px 16px", fontSize: 14, fontWeight: 700, background: WARM.text, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: 0.3, fontFamily: "inherit" }}>
              + Share
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 22, background: WARM.tabBg, borderRadius: 12, padding: 4, border: `1px solid ${WARM.cardBorder}` }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t.toLowerCase())} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: "none", background: tab === t.toLowerCase() ? WARM.card : "transparent", color: tab === t.toLowerCase() ? WARM.text : WARM.textMuted, cursor: "pointer", fontSize: 14, fontWeight: tab === t.toLowerCase() ? 700 : 400, boxShadow: tab === t.toLowerCase() ? WARM.shadow : "none", transition: "all 0.2s", fontFamily: "inherit" }}>
            {t}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", color: WARM.textMuted, padding: "3rem", fontSize: 14 }}>Loading your music...</div>}
      {!loading && tab === "feed" && (
        <div>
          {shares.length === 0 && <div style={{ textAlign: "center", color: WARM.textMuted, padding: "3rem", fontSize: 14 }}>No shares yet — be the first to share a song ♫</div>}
          {shares.map(s => <SongCard key={s.id} share={s} currentUser={currentUser} onSave={handleSave} onDelete={handleDelete} />)}
        </div>
      )}
      {!loading && tab === "saved" && (
        <div>
          {savedShares.length === 0 && <div style={{ textAlign: "center", color: WARM.textMuted, padding: "3rem", fontSize: 14 }}>No saved songs yet ♡</div>}
          {savedShares.map(s => <SongCard key={s.id} share={s} currentUser={currentUser} onSave={handleSave} onDelete={handleDelete} />)}
        </div>
      )}
      {!loading && tab === "stats" && <StatsPage shares={shares} />}
    </div>
  );
}
