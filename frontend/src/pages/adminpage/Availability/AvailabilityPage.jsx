import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import "./AvailabilityPage.css";

const ROOMS = [
  { id: "gutedel",   name: "Gutedel (Suite)",    guests: "2 Guests" },
  { id: "bacchus",   name: "Bacchus (Double)",   guests: "2 Guests" },
  { id: "riesling",  name: "Riesling (Suite)",   guests: "2 Guests" },
  { id: "scheurebe", name: "Scheurebe (Double)", guests: "3 Guests" },
  { id: "burgunder", name: "Burgunder (Suite)",  guests: "3 Guests" },
  { id: "rivaner",   name: "Rivaner (Single)",   guests: "1 Guest"  },
  { id: "regent",    name: "Regent (Suite)",     guests: "3 Guests" },
];

const INITIAL_BOOKINGS = [
  { id:"BKG-4821", room:"gutedel",   start:19, end:22, guest:"Clara Hoffmann",  email:"clara.hoffmann@email.com",  phone:"+49 171 2345671", guests:"2 Adults", source:"Website",     price:480, notes:"Late check-in requested", status:"confirmed", type:"booking" },
  { id:"BKG-4822", room:"bacchus",   start:10, end:16, guest:"",                email:"",                          phone:"",                guests:"",          source:"",            price:0,   notes:"Maintenance",             status:"blocked",   type:"blocked"  },
  { id:"BKG-4823", room:"riesling",  start:2,  end:9,  guest:"Felix Brandt",    email:"felix.brandt@email.com",    phone:"+49 172 3456782", guests:"2 Adults", source:"Booking.com", price:405, notes:"",                        status:"confirmed", type:"booking" },
  { id:"BKG-4824", room:"riesling",  start:12, end:15, guest:"Mia Steinberg",   email:"mia.steinberg@email.com",   phone:"+49 173 4567893", guests:"2 Adults", source:"Website",     price:360, notes:"",                        status:"confirmed", type:"booking" },
  { id:"BKG-4825", room:"scheurebe", start:9,  end:11, guest:"Tobias Vogel",    email:"tobias.vogel@email.com",    phone:"+49 176 7890126", guests:"2 Adults", source:"Booking.com", price:270, notes:"",                        status:"confirmed", type:"booking" },
  { id:"BKG-4826", room:"burgunder", start:23, end:26, guest:"Jonas Richter",   email:"jonas.richter@email.com",   phone:"+49 174 5678904", guests:"3 Adults, 1 Child", source:"Phone", price:480, notes:"",               status:"confirmed", type:"booking" },
  { id:"BKG-4827", room:"rivaner",   start:14, end:20, guest:"Nina Bauer",      email:"nina.bauer@email.com",      phone:"+49 177 8901237", guests:"1 Adult",  source:"Email",       price:110, notes:"",                        status:"confirmed", type:"booking" },
  { id:"BKG-4828", room:"rivaner",   start:22, end:24, guest:"",                email:"",                          phone:"",                guests:"",          source:"",            price:0,   notes:"Room inspection",          status:"blocked",   type:"blocked"  },
  { id:"BKG-4829", room:"regent",    start:21, end:23, guest:"Leon Fischer",    email:"leon.fischer@email.com",    phone:"+49 178 9012348", guests:"2 Adults", source:"Website",     price:340, notes:"",                        status:"confirmed", type:"booking" },
  { id:"BKG-4830", room:"regent",    start:1,  end:6,  guest:"Lea Hartmann",    email:"lea.hartmann@email.com",    phone:"+49 175 6789015", guests:"2 Adults", source:"Booking.com", price:220, notes:"",                        status:"confirmed", type:"booking" },
];

const ROOM_LIST  = ["Gutedel (Suite)","Bacchus (Double)","Riesling (Suite)","Scheurebe (Double)","Burgunder (Suite)","Rivaner (Single)","Regent (Suite)"];
const GUEST_OPTS = ["1 Adult","2 Adults","3 Adults","4 Adults","2 Adults, 1 Child","2 Adults, 2 Children","3 Adults, 1 Child"];
const SOURCE_OPTS= ["Booking.com","Website","Phone","Email"];
const WEEKENDS   = ["Sat","Sun"];

function daysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }
function dayOfWeek(y,m,d){ return new Date(y,m,d).toLocaleDateString("en-US",{weekday:"short"}); }
function formatMonthYear(y,m){ return new Date(y,m,1).toLocaleDateString("en-US",{month:"long",year:"numeric"}); }
function formatDateFull(y,m,d){ return new Date(y,m,d).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}); }
function formatDateShort(y,m,d){ return new Date(y,m,d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); }

// ── View Booking Modal ────────────────────────────────────────────────────────
function ViewBookingModal({ booking, roomName, year, month, onClose, onEdit }) {
  const nights = booking.end - booking.start;
  const perNight = nights > 0 ? Math.round(booking.price / nights) : 0;

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="vm-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="vm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="vm-header">
          <div className="vm-header__left">
            <div className="vm-header__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <h2 className="vm-header__title">Booking Details</h2>
              <p className="vm-header__id">#{booking.id}</p>
            </div>
          </div>
          <div className="vm-header__right">
            <span className="vm-status vm-status--confirmed">Confirmed</span>
            <button className="vm-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="vm-body">
          {/* Guest card */}
          <div className="vm-guest-card">
            <div className="vm-guest-avatar">{booking.guest.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
            <div className="vm-guest-info">
              <p className="vm-guest-name">{booking.guest}</p>
              <p className="vm-guest-detail">{booking.email}</p>
              <p className="vm-guest-detail">{booking.phone}</p>
            </div>
          </div>

          {/* Two-col details */}
          <div className="vm-details-grid">
            <div className="vm-detail-block">
              <p className="vm-detail-label">Room</p>
              <p className="vm-detail-val">{roomName}</p>
            </div>
            <div className="vm-detail-block">
              <p className="vm-detail-label">Guests</p>
              <p className="vm-detail-val">{booking.guests}</p>
            </div>
            <div className="vm-detail-block">
              <p className="vm-detail-label">Check-in</p>
              <p className="vm-detail-val">{formatDateFull(year, month, booking.start)}</p>
            </div>
            <div className="vm-detail-block">
              <p className="vm-detail-label">Check-out</p>
              <p className="vm-detail-val">{formatDateFull(year, month, booking.end)}</p>
              <p className="vm-detail-sub">{nights} night{nights !== 1 ? "s" : ""}</p>
            </div>
            <div className="vm-detail-block">
              <p className="vm-detail-label">Source</p>
              <p className="vm-detail-val">{booking.source}</p>
            </div>
            <div className="vm-detail-block">
              <p className="vm-detail-label">Booking Date</p>
              <p className="vm-detail-val">Today</p>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="vm-notes">
              <p className="vm-detail-label">Notes</p>
              <p className="vm-notes-text">{booking.notes}</p>
            </div>
          )}

          {/* Price breakdown */}
          <div className="vm-price-card">
            <p className="vm-price-card__title">Price Breakdown</p>
            <div className="vm-price-row">
              <span>Room ({nights} night{nights!==1?"s":""} × €{perNight})</span>
              <span>€{booking.price}</span>
            </div>
            <div className="vm-price-row">
              <span>Breakfast</span>
              <span className="vm-muted">Not included</span>
            </div>
            <div className="vm-price-row vm-price-row--total">
              <span>Total</span>
              <span>€{booking.price}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="vm-footer">
          <button className="vm-btn vm-btn--ghost" onClick={onClose}>Close</button>
          <button className="vm-btn vm-btn--outline" onClick={onEdit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Booking
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Booking Modal ────────────────────────────────────────────────────────
function EditBookingModal({ booking, roomName, year, month, onClose, onSave }) {
  const [form, setForm] = useState({
    guest:   booking.guest,
    email:   booking.email,
    phone:   booking.phone,
    room:    roomName,
    guests:  booking.guests,
    notes:   booking.notes,
    source:  booking.source,
    status:  booking.status,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const set = (field) => (e) => {
    setForm(f => ({...f, [field]: e.target.value}));
    setErrors(er => ({...er, [field]: ""}));
  };

  const validate = () => {
    const e = {};
    if (!form.guest.trim())  e.guest  = "Required";
    if (!form.email.trim())  e.email  = "Required";
    if (!form.phone.trim())  e.phone  = "Required";
    if (!form.guests)        e.guests = "Required";
    if (!form.source)        e.source = "Required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  const nights = booking.end - booking.start;
  const perNight = nights > 0 ? Math.round(booking.price / nights) : 0;

  return (
    <div className="vm-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="vm-modal vm-modal--edit" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="vm-header">
          <div className="vm-header__left">
            <div className="vm-header__icon vm-header__icon--edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <h2 className="vm-header__title">Edit Booking</h2>
              <p className="vm-header__id">#{booking.id} · {formatDateShort(year,month,booking.start)} – {formatDateShort(year,month,booking.end)}</p>
            </div>
          </div>
          <button className="vm-close" onClick={onClose}>✕</button>
        </div>

        <div className="vm-body">

          {/* ── Guest Information ── */}
          <div className="em-section">
            <p className="em-section-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Guest Information
            </p>
            <div className="em-row em-row--3">
              <div className="em-field">
                <label className="em-label">Full Name <span className="em-req">*</span></label>
                <input className={`em-input ${errors.guest?"em-input--err":""}`} value={form.guest} onChange={set("guest")} />
                {errors.guest && <p className="em-err">{errors.guest}</p>}
              </div>
              <div className="em-field">
                <label className="em-label">Email <span className="em-req">*</span></label>
                <input className={`em-input ${errors.email?"em-input--err":""}`} type="email" value={form.email} onChange={set("email")} />
                {errors.email && <p className="em-err">{errors.email}</p>}
              </div>
              <div className="em-field">
                <label className="em-label">Phone <span className="em-req">*</span></label>
                <input className={`em-input ${errors.phone?"em-input--err":""}`} value={form.phone} onChange={set("phone")} />
                {errors.phone && <p className="em-err">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* ── Booking Details ── */}
          <div className="em-section">
            <p className="em-section-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Booking Details
            </p>
            <div className="em-row em-row--3">
              <div className="em-field">
                <label className="em-label">Room</label>
                <select className="em-input em-select" value={form.room} onChange={set("room")}>
                  {ROOM_LIST.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="em-field">
                <label className="em-label">Check-in</label>
                <div className="em-readonly">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {formatDateShort(year, month, booking.start)}
                  <span className="em-readonly__hint">Change via calendar</span>
                </div>
              </div>
              <div className="em-field">
                <label className="em-label">Check-out</label>
                <div className="em-readonly">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {formatDateShort(year, month, booking.end)}
                  <span className="em-readonly__hint">{nights} night{nights!==1?"s":""}</span>
                </div>
              </div>
            </div>
            <div className="em-row em-row--2">
              <div className="em-field">
                <label className="em-label">Guests <span className="em-req">*</span></label>
                <select className={`em-input em-select ${errors.guests?"em-input--err":""}`} value={form.guests} onChange={set("guests")}>
                  <option value="">Select guests</option>
                  {GUEST_OPTS.map(g => <option key={g}>{g}</option>)}
                </select>
                {errors.guests && <p className="em-err">{errors.guests}</p>}
              </div>
              <div className="em-field">
                <label className="em-label">Special Notes</label>
                <input className="em-input" placeholder="Any special requests..." value={form.notes} onChange={set("notes")} />
              </div>
            </div>
          </div>

          {/* ── Source & Status ── */}
          <div className="em-section">
            <p className="em-section-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Source &amp; Status
            </p>
            <div className="em-row em-row--2">
              <div className="em-field">
                <label className="em-label">Booking Source <span className="em-req">*</span></label>
                <select className={`em-input em-select ${errors.source?"em-input--err":""}`} value={form.source} onChange={set("source")}>
                  <option value="">Select source</option>
                  {SOURCE_OPTS.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.source && <p className="em-err">{errors.source}</p>}
              </div>
              <div className="em-field">
                <label className="em-label">Status</label>
                <select className={`em-input em-select em-select--status em-select--${form.status}`} value={form.status} onChange={set("status")}>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price summary — read only */}
          <div className="em-price-summary">
            <p className="em-price-summary__title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Price Summary
            </p>
            <div className="em-price-row">
              <span>Room rate</span>
              <span>€{perNight} / night</span>
            </div>
            <div className="em-price-row">
              <span>{nights} night{nights!==1?"s":""}</span>
              <span>×</span>
            </div>
            <div className="em-price-row em-price-row--total">
              <span>Total</span>
              <span>€{booking.price}</span>
            </div>
            <p className="em-price-hint">To adjust pricing, go to Rooms &amp; Prices</p>
          </div>

        </div>

        {/* Footer */}
        <div className="vm-footer">
          <button className="vm-btn vm-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="vm-btn vm-btn--primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AvailabilityPage() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [modal, setModal] = useState(null); // "view" | "edit" | null
  const panelRef = useRef(null);

  const days     = daysInMonth(year, month);
  const dayArray = Array.from({length: days}, (_,i) => i+1);
  const todayDay = today.getFullYear()===year && today.getMonth()===month ? today.getDate() : null;

  const totalNights    = ROOMS.length * days;
  const bookedNights   = bookings.filter(b=>b.type==="booking").reduce((s,b)=>s+(b.end-b.start),0);
  const blockedNights  = bookings.filter(b=>b.type==="blocked").reduce((s,b)=>s+(b.end-b.start),0);
  const availableNights= totalNights - bookedNights - blockedNights;

  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };
  const goToday   = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  const openPanel  = (bkg) => { setSelectedBooking(bkg); setPanelOpen(true); };
  const closePanel = () => { setPanelOpen(false); setModal(null); setTimeout(()=>setSelectedBooking(null),300); };

  useEffect(() => {
    const h = (e) => {
      if(panelOpen && panelRef.current && !panelRef.current.contains(e.target)){
        if(!e.target.closest(".av-booking-bar") && !e.target.closest(".vm-backdrop")) closePanel();
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [panelOpen]);

  useEffect(() => {
    const h = (e) => { if(e.key==="Escape" && !modal) closePanel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [modal]);

  const roomBookings = (roomId) => bookings.filter(b=>b.room===roomId);
  const selectedRoom = selectedBooking ? ROOMS.find(r=>r.id===selectedBooking.room) : null;

  return (
    <div className="av-layout">
      <AdminSidebar collapsed={sidebarCollapsed} onCollapse={()=>setSidebarCollapsed(c=>!c)} activePath="/admin/availability" />

      <div className="av-main">
        <header className="av-topbar">
          <div className="av-topbar__left">
            <button className="av-topbar__hamburger" onClick={()=>setSidebarCollapsed(c=>!c)}>☰</button>
            <div>
              <h1 className="av-topbar__title">Availability Overview</h1>
              <p className="av-topbar__sub">View and manage room availability, booking and blocked dates</p>
            </div>
          </div>
          <div className="av-topbar__right">
            <button className="av-topbar__notif">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="av-topbar__user">
              <div className="av-topbar__avatar">GW</div>
              <div className="av-topbar__userinfo">
                <span className="av-topbar__username">Gundel</span>
                <span className="av-topbar__role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="av-content">

          {/* Action row */}
          <div className="av-action-row">
            <div className="av-month-nav">
              <button className="av-nav-btn" onClick={goToday}>Today</button>
              <button className="av-nav-btn av-nav-btn--icon" onClick={prevMonth}>‹</button>
              <span className="av-month-label">{formatMonthYear(year,month)}</span>
              <button className="av-nav-btn av-nav-btn--icon" onClick={nextMonth}>›</button>
            </div>
            <div className="av-action-right">
              <div className="av-month-picker">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {formatMonthYear(year,month)}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              <button className="av-action-btn av-action-btn--outline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Block Dates / Room
              </button>
              <button className="av-action-btn av-action-btn--outline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </button>
            </div>
          </div>

          {/* Calendar card */}
          <div className="av-card">
            <div className="av-view-toggle">
              <button className="av-view-btn av-view-btn--active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="16" x2="21" y2="16"/><line x1="9" y1="4" x2="9" y2="22"/></svg>
                Month View
              </button>
              <button className="av-view-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                List View
              </button>
            </div>

            <div className="av-grid-wrap">
              <table className="av-grid">
                <thead>
                  <tr>
                    <th className="av-th-room">Room</th>
                    {dayArray.map(d => {
                      const dow = dayOfWeek(year,month,d);
                      return (
                        <th key={d} className={`av-th-day ${WEEKENDS.includes(dow)?"av-th-day--weekend":""}`}>
                          <span className="av-th-dow">{dow}</span>
                          <span className={`av-th-num ${d===todayDay?"av-th-num--today":""}`}>{d}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {ROOMS.map(room => (
                    <tr key={room.id} className="av-row">
                      <td className="av-td-room">
                        <p className="av-room-name">{room.name}</p>
                        <p className="av-room-guests">{room.guests}</p>
                      </td>
                      <td colSpan={days} className="av-td-days">
                        <div className="av-cells-bg">
                          {dayArray.map(d => {
                            const dow = dayOfWeek(year,month,d);
                            return <div key={d} className={`av-cell ${WEEKENDS.includes(dow)?"av-cell--weekend":""} ${d===todayDay?"av-cell--today":""}`}/>;
                          })}
                        </div>
                        <div className="av-bars">
                          {roomBookings(room.id).map(bkg => {
                            const left  = ((bkg.start-1)/days)*100;
                            const width = ((bkg.end-bkg.start)/days)*100;
                            return (
                              <div key={bkg.id}
                                className={`av-booking-bar av-booking-bar--${bkg.type}`}
                                style={{left:`${left}%`,width:`${width}%`}}
                                onClick={()=>openPanel(bkg)}
                              >
                                {bkg.type==="blocked"
                                  ? <span className="av-bar-label av-bar-label--blocked">🔒 Blocked</span>
                                  : <span className="av-bar-label">{bkg.guest}
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginLeft:4,flexShrink:0}}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    </span>
                                }
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="av-legend">
              <span className="av-legend-item"><span className="av-legend-dot av-legend-dot--available"/>Available</span>
              <span className="av-legend-item"><span className="av-legend-dot av-legend-dot--booked"/>Booked</span>
              <span className="av-legend-item"><span className="av-legend-dot av-legend-dot--blocked"/>Blocked</span>
              <span className="av-legend-item"><span className="av-legend-dot av-legend-dot--departure"/>Departure Today</span>
              <span className="av-legend-hint">Click on any booking to view details</span>
            </div>
          </div>

          {/* Summary */}
          <div className="av-summary">
            <h3 className="av-summary__title">Availability Summary – {formatMonthYear(year,month)}</h3>
            <div className="av-summary__grid">
              <div className="av-summary-card">
                <div className="av-summary-card__icon av-summary-card__icon--green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p className="av-summary-card__label">Available Room Nights</p>
                  <p className="av-summary-card__value">{availableNights}</p>
                  <p className="av-summary-card__sub">{Math.round((availableNights/totalNights)*100)}% of total</p>
                </div>
              </div>
              <div className="av-summary-card">
                <div className="av-summary-card__icon av-summary-card__icon--blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <p className="av-summary-card__label">Booked Room Nights</p>
                  <p className="av-summary-card__value">{bookedNights}</p>
                  <p className="av-summary-card__sub">{Math.round((bookedNights/totalNights)*100)}% of total</p>
                </div>
              </div>
              <div className="av-summary-card">
                <div className="av-summary-card__icon av-summary-card__icon--red">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div>
                  <p className="av-summary-card__label">Blocked Room Nights</p>
                  <p className="av-summary-card__value">{blockedNights}</p>
                  <p className="av-summary-card__sub">{Math.round((blockedNights/totalNights)*100)}% of total</p>
                </div>
              </div>
              <div className="av-summary-card">
                <div className="av-summary-card__icon av-summary-card__icon--gray">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <p className="av-summary-card__label">Total Room Nights</p>
                  <p className="av-summary-card__value">{totalNights}</p>
                  <p className="av-summary-card__sub">{ROOMS.length} rooms × {days} nights</p>
                </div>
              </div>
              <div className="av-summary-card av-summary-card--help">
                <p className="av-summary-card__help-title">Need help?</p>
                <p className="av-summary-card__help-text">Use block dates to close rooms for maintenance, events or other reasons.</p>
                <button className="av-summary-card__help-btn">Learn more ↗</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Slide-in Panel ── */}
      {selectedBooking && (
        <div className={`av-panel-backdrop ${panelOpen?"av-panel-backdrop--open":""}`} onClick={closePanel}>
          <div ref={panelRef} className={`av-panel ${panelOpen?"av-panel--open":""}`} onClick={e=>e.stopPropagation()}>
            <div className="av-panel__header">
              <h3 className="av-panel__title">Booking Details</h3>
              <button className="av-panel__close" onClick={closePanel}>✕</button>
            </div>

            {selectedBooking.type === "blocked" ? (
              <div className="av-panel__body">
                <div className="av-panel__status av-panel__status--blocked">Blocked</div>
                <p className="av-panel__guest">Room Blocked</p>
                <p className="av-panel__room">{selectedRoom?.name}</p>
                <div className="av-panel__detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div><p className="av-panel__detail-label">From</p><p className="av-panel__detail-val">{formatDateFull(year,month,selectedBooking.start)}</p></div>
                </div>
                <div className="av-panel__detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div><p className="av-panel__detail-label">Until</p><p className="av-panel__detail-val">{formatDateFull(year,month,selectedBooking.end)}</p></div>
                </div>
                {selectedBooking.notes && <p className="av-panel__nights">{selectedBooking.notes}</p>}
                <div className="av-panel__actions">
                  <button className="av-panel__btn av-panel__btn--outline">Edit Block</button>
                  <button className="av-panel__btn av-panel__btn--cancel">Remove Block</button>
                </div>
              </div>
            ) : (
              <div className="av-panel__body">
                <div className="av-panel__status av-panel__status--confirmed">Confirmed</div>
                <p className="av-panel__guest">{selectedBooking.guest}</p>
                <p className="av-panel__room">{selectedRoom?.name}</p>
                <p className="av-panel__booking-id">#{selectedBooking.id}</p>

                <div className="av-panel__detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div><p className="av-panel__detail-label">Check-in</p><p className="av-panel__detail-val">{formatDateFull(year,month,selectedBooking.start)}</p></div>
                </div>
                <div className="av-panel__detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div><p className="av-panel__detail-label">Check-out</p><p className="av-panel__detail-val">{formatDateFull(year,month,selectedBooking.end)}</p><p className="av-panel__detail-sub">{selectedBooking.end-selectedBooking.start} nights</p></div>
                </div>
                <div className="av-panel__detail-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <div><p className="av-panel__detail-label">Guests</p><p className="av-panel__detail-val">{selectedBooking.guests}</p></div>
                </div>
                <div className="av-panel__price-row">
                  <p className="av-panel__price-label">Total Price</p>
                  <p className="av-panel__price-val">€{selectedBooking.price}</p>
                </div>
                <div className="av-panel__source-row">
                  <p className="av-panel__detail-label">Source</p>
                  <p className="av-panel__detail-val">{selectedBooking.source}</p>
                </div>

                <div className="av-panel__actions">
                  <button className="av-panel__btn av-panel__btn--outline" onClick={()=>setModal("view")}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View Booking
                  </button>
                  <button className="av-panel__btn av-panel__btn--outline" onClick={()=>setModal("edit")}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit Booking
                  </button>
                  <button className="av-panel__btn av-panel__btn--cancel">Cancel Booking</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {modal === "view" && selectedBooking && (
        <ViewBookingModal
          booking={selectedBooking}
          roomName={selectedRoom?.name}
          year={year} month={month}
          onClose={()=>setModal(null)}
          onEdit={()=>setModal("edit")}
        />
      )}

      {/* ── Edit Modal ── */}
      {modal === "edit" && selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          roomName={selectedRoom?.name}
          year={year} month={month}
          onClose={()=>setModal(null)}
          onSave={(form)=>{
            setBookings(prev => prev.map(b => b.id === selectedBooking.id
              ? {...b, guest: form.guest, email: form.email, phone: form.phone, guests: form.guests, notes: form.notes, source: form.source, status: form.status}
              : b
            ));
            setSelectedBooking(b => ({...b, ...form}));
          }}
        />
      )}

    </div>
  );
}