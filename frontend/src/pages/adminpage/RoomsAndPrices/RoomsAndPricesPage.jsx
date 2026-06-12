import React, { useState, useRef, useEffect, useCallback } from "react";
import AdminSidebar from "../AdminSidebar";
import { useAuth } from "../../../auth/AuthContext";
import { publicApi, adminApi } from "../../../api/api";
import "./RoomsAndPricesPage.css";

const ROOM_TYPES = ["All Room Types", "Suite", "Double", "Single"];
const TYPE_COLORS = { Suite: "rp-type--suite", Double: "rp-type--double", Single: "rp-type--single" };

const ALL_FEATURES = [
  { key: "wifi", label: "Free WiFi", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></svg> },
  { key: "tv", label: "TV", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" /><polyline points="17 2 12 7 7 2" /></svg> },
  { key: "minibar", label: "Minibar", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v4a1 1 0 0 1-1 1H3m0 0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8m0 0H8m0 0V3h13v5" /></svg> },
  { key: "coffee", label: "Coffee / Tea", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg> },
  { key: "ac", label: "Air Conditioning", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" /></svg> },
  { key: "balcony", label: "Balcony / Terrace", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
  { key: "bath", label: "Bathtub", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><line x1="10" y1="5" x2="8" y2="7" /></svg> },
  { key: "safe", label: "Safe", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="9" x2="12" y2="8" /></svg> },
  { key: "heating", label: "Heating", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg> },
  { key: "desk", label: "Desk", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="20" height="3" rx="1" /><line x1="6" y1="17" x2="6" y2="21" /><line x1="18" y1="17" x2="18" y2="21" /><path d="M6 14V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9" /></svg> },
  { key: "cityview", label: "City View", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
  { key: "breakfast", label: "Breakfast Incl.", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><rect x="2" y="8" width="16" height="12" rx="2" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg> },
];

const FEATURES_MAP = Object.fromEntries(ALL_FEATURES.map(f => [f.key, f.label]));

const FeatureIcon = ({ f }) => {
  const found = ALL_FEATURES.find(x => x.key === f);
  return found ? <span style={{ display: "flex", alignItems: "center" }}>{found.icon}</span> : null;
};

// Map a backend room → this page's display shape.
// Features and images are not stored in the DB, so we attach sensible local defaults.
function mapApiRoom(r) {
  return {
    id: r.id,                       // UUID
    name: r.name,
    roomNo: `Room ${r.roomNumber}`,
    roomNumber: r.roomNumber,
    type: r.type === "double" ? "Double" : r.type === "single" ? "Single" : "Suite",
    occupancy: r.standardOccupancy,
    maxGuests: r.maxGuests,                // preserved, sent back unchanged
    occupancyNote: r.occupancyNote || "",
    extraBed: r.extraBedAllowed,
    priceBase: Number(r.priceWithoutBreakfast),
    breakfastPP: Number(r.breakfastPrice),
    extraBedPrice: r.extraBedAllowed ? 30 : null,   // not in DB; display default
    features: [],                          // not stored in DB
    description: r.description || "",
    status: r.status || "active",
    img: "",                          // not stored in DB
  };
}

// ── Room Modal ────────────────────────────────────────────────────────────────
function RoomModal({ room, onClose, onSave }) {
  // This page only edits existing rooms (no Add endpoint), so room is always set.
  const [form, setForm] = useState({
    name: room.name, roomNo: room.roomNo, type: room.type,
    occupancy: room.occupancy, occupancyNote: room.occupancyNote,
    extraBed: room.extraBed, priceBase: room.priceBase,
    breakfastPP: room.breakfastPP,
    extraBedPrice: room.extraBedPrice ?? "",
    features: [...room.features],
    description: room.description || "",
    status: room.status,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [images, setImages] = useState(room.img ? [room.img] : []);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const MAX_IMAGES = 8;

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    setErrors(er => ({ ...er, [field]: "" }));
  };

  const toggleFeature = (key) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(key)
        ? prev.features.filter(x => x !== key)
        : [...prev.features, key],
    }));
  };

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;
    const toAdd = Array.from(files).slice(0, remaining);
    toAdd.forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setImages(prev => [...prev, url].slice(0, MAX_IMAGES));
    });
  };

  const handleFileChange = (e) => { addFiles(e.target.files); e.target.value = ""; };
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); };
  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.roomNo.trim()) e.roomNo = "Required";
    if (!form.priceBase) e.priceBase = "Required";
    if (!form.breakfastPP) e.breakfastPP = "Required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    setSaveError(null);
    const ok = await onSave(room.id, {
      ...form,
      occupancy: Number(form.occupancy),
      priceBase: Number(form.priceBase),
      breakfastPP: Number(form.breakfastPP),
      extraBedPrice: form.extraBed && form.extraBedPrice ? Number(form.extraBedPrice) : null,
      img: images[0] || "",
    });
    setSaving(false);
    if (ok) onClose();
    else setSaveError("Could not save the room. Please try again.");
  };

  const total = Number(form.priceBase || 0) + Number(form.breakfastPP || 0);

  return (
    <div className="rm-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rm-modal rm-modal--wide">

        {/* Header */}
        <div className="rm-header">
          <div className="rm-header__left">
            <div className="rm-header__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <h2 className="rm-header__title">Edit Room</h2>
              <p className="rm-header__sub">Editing: {room.name}</p>
            </div>
          </div>
          <button className="rm-close" onClick={onClose}>✕</button>
        </div>

        {/* Two-column body */}
        <div className="rm-body rm-body--two-col">

          {/* ── LEFT COLUMN ── */}
          <div className="rm-col-left">

            {/* 1. Basic Information */}
            <div className="rm-section">
              <p className="rm-section-title">
                <span className="rm-section-num">1</span>
                Basic Information
              </p>
              <div className="rm-row rm-row--2">
                <div className="rm-field">
                  <label className="rm-label">Room Name <span className="rm-req">*</span></label>
                  <input className={`rm-input ${errors.name ? "rm-input--err" : ""}`} placeholder="e.g. Gutedel Suite" value={form.name} onChange={set("name")} />
                  {errors.name && <p className="rm-err">{errors.name}</p>}
                </div>
                <div className="rm-field">
                  <label className="rm-label">Room Number</label>
                  <input className="rm-input" value={form.roomNo} disabled />
                  <p className="rm-hint">Room number can't be changed</p>
                </div>
              </div>
              <div className="rm-row rm-row--2">
                <div className="rm-field">
                  <label className="rm-label">Room Type</label>
                  <input className="rm-input" value={form.type} disabled />
                  <p className="rm-hint">Room type can't be changed</p>
                </div>
                <div className="rm-field">
                  <label className="rm-label">Standard Occupancy <span className="rm-req">*</span></label>
                  <div className="rm-occ-field">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <select className="rm-input rm-select rm-occ-select" value={form.occupancy} onChange={set("occupancy")}>
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <p className="rm-hint">Number of guests included in the base price</p>
                </div>
              </div>
              <div className="rm-row rm-row--2">
                <div className="rm-field">
                  <label className="rm-label">Occupancy Note</label>
                  <input className="rm-input" placeholder="e.g. 2 Adult, 1 Kid" value={form.occupancyNote} onChange={set("occupancyNote")} />
                </div>
                <div className="rm-field">
                  <label className="rm-label">Status</label>
                  <select className={`rm-input rm-select rm-select--status-${form.status}`} value={form.status} onChange={set("status")}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Pricing */}
            <div className="rm-section">
              <p className="rm-section-title">
                <span className="rm-section-num">2</span>
                Pricing (per night)
              </p>
              <div className="rm-row rm-row--3">
                <div className="rm-field">
                  <label className="rm-label">Price Without Breakfast <span className="rm-req">*</span></label>
                  <div className="rm-input-prefix">
                    <span className="rm-prefix">€</span>
                    <input className={`rm-input rm-input--prefixed ${errors.priceBase ? "rm-input--err" : ""}`} type="number" min="0" placeholder="109" value={form.priceBase} onChange={set("priceBase")} />
                  </div>
                  {errors.priceBase && <p className="rm-err">{errors.priceBase}</p>}
                </div>
                <div className="rm-field">
                  <label className="rm-label">Breakfast Price (per room) <span className="rm-req">*</span></label>
                  <div className="rm-input-prefix">
                    <span className="rm-prefix">€</span>
                    <input className={`rm-input rm-input--prefixed ${errors.breakfastPP ? "rm-input--err" : ""}`} type="number" min="0" placeholder="e.g. 26" value={form.breakfastPP} onChange={set("breakfastPP")} />
                  </div>
                  {errors.breakfastPP && <p className="rm-err">{errors.breakfastPP}</p>}
                </div>
                <div className="rm-field">
                  <label className="rm-label">Total Price (example)</label>
                  <div className="rm-total-display">
                    <span className="rm-total-val">€ {total || "—"}</span>
                    <span className="rm-total-tag">Auto-calculated</span>
                  </div>
                </div>
              </div>
              <div className="rm-row rm-row--2">
                <div className="rm-field">
                  <label className="rm-label">Extra Bed Allowed</label>
                  <div className="rm-radio-group">
                    <label className="rm-radio-label">
                      <input type="radio" name="extraBed" checked={form.extraBed === true} onChange={() => setForm(f => ({ ...f, extraBed: true }))} />
                      Yes
                    </label>
                    <label className="rm-radio-label">
                      <input type="radio" name="extraBed" checked={form.extraBed === false} onChange={() => setForm(f => ({ ...f, extraBed: false }))} />
                      No
                    </label>
                  </div>
                </div>
                <div className="rm-field">
                  <label className="rm-label">Extra Bed Price (per night)</label>
                  <div className="rm-input-prefix">
                    <span className="rm-prefix">€</span>
                    <input
                      className="rm-input rm-input--prefixed"
                      type="number" min="0" placeholder="e.g. 30"
                      value={form.extraBedPrice}
                      onChange={set("extraBedPrice")}
                      disabled={!form.extraBed}
                    />
                  </div>
                  <p className="rm-hint">Display only — not stored in the database</p>
                </div>
              </div>
            </div>

            {/* 3. Features */}
            <div className="rm-section">
              <p className="rm-section-title">
                <span className="rm-section-num">3</span>
                Features &amp; Amenities
              </p>
              <p className="rm-hint" style={{ marginTop: -4, marginBottom: 10 }}>
                Features are display-only and are not saved to the database yet.
              </p>
              <div className="rm-features-grid">
                {ALL_FEATURES.map(({ key, label, icon }) => {
                  const active = form.features.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`rm-feature-chip ${active ? "rm-feature-chip--active" : ""}`}
                      onClick={() => toggleFeature(key)}
                    >
                      <span className="rm-feature-chip__icon">{icon}</span>
                      <span className="rm-feature-chip__label">{label}</span>
                      {active && (
                        <span className="rm-feature-chip__check">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="rm-field" style={{ marginTop: 12 }}>
                <label className="rm-label">Room Description (Optional)</label>
                <textarea
                  className="rm-textarea"
                  rows={3}
                  placeholder="Describe the room, view, size, and other details..."
                  value={form.description}
                  onChange={set("description")}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN – Images ── */}
          <div className="rm-col-right">
            <div className="rm-section rm-section--sticky">
              <p className="rm-section-title">
                <span className="rm-section-num">4</span>
                Room Images
              </p>

              <label className="rm-label">Upload Images</label>
              <p className="rm-hint" style={{ marginBottom: 10 }}>
                Images are display-only and are not saved to the database yet.
              </p>

              {/* Drop zone */}
              <div
                className={`rm-dropzone ${dragging ? "rm-dropzone--active" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="rm-dropzone__text">Drag and drop images here</p>
                <p className="rm-dropzone__or">or</p>
                <button
                  type="button"
                  className="rm-choose-btn"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {/* Guidelines */}
              <div className="rm-guidelines">
                <p className="rm-guidelines__title">Image Guidelines:</p>
                <ul className="rm-guidelines__list">
                  <li>JPG, PNG (max 5MB each)</li>
                  <li>Recommended size: 1200 × 800 px</li>
                </ul>
              </div>

              {/* Preview grid */}
              {images.length > 0 && (
                <div className="rm-img-section">
                  <p className="rm-label" style={{ marginBottom: 8 }}>Image Preview</p>
                  <div className="rm-img-grid">
                    {images.map((src, i) => (
                      <div key={i} className="rm-img-thumb">
                        <img src={src} alt={`Room ${i + 1}`} />
                        <button
                          type="button"
                          className="rm-img-remove"
                          onClick={() => removeImage(i)}
                          aria-label="Remove image"
                        >✕</button>
                        {i === 0 && <span className="rm-img-primary">Main</span>}
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        className="rm-img-add"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Add More
                      </button>
                    )}
                  </div>
                  <p className="rm-hint">{images.length} / {MAX_IMAGES} images. First image is the main photo.</p>
                </div>
              )}
            </div>
          </div>

        </div>{/* end two-col */}

        {/* Footer */}
        <div className="rm-footer">
          {saveError && <p className="rm-err" style={{ marginRight: "auto" }}>{saveError}</p>}
          <button className="rm-btn rm-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="rm-btn rm-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RoomsAndPricesPage() {
  const { token } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All Room Types");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);   // room object | null
  const [menuOpen, setMenuOpen] = useState(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getRooms(token);
      setRooms(data.map(mapApiRoom));
    } catch {
      setError("Could not load rooms.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  const filtered = rooms.filter(r => {
    const matchType = typeFilter === "All Room Types" || r.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.roomNo.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const roomTypes = [...new Set(rooms.map(r => r.type))].length;
  const extraBedPrice = 30; // typical; extra-bed pricing is age-tiered (see booking flow)
  const breakfastPrice = rooms.length
    ? Math.min(...rooms.map(r => r.breakfastPP))
    : 0;

  // Save edits via PUT /api/admin/rooms/{id}
  const handleSave = async (id, form) => {
    const original = rooms.find(r => r.id === id);
    try {
      await adminApi.updateRoom(token, id, {
        name: form.name,
        priceWithoutBreakfast: form.priceBase,
        breakfastPrice: form.breakfastPP,
        maxGuests: original ? original.maxGuests : form.occupancy, // unchanged
        standardOccupancy: form.occupancy,
        occupancyNote: form.occupancyNote || null,
        extraBedAllowed: form.extraBed,
        description: form.description || null,
        status: form.status,
      });
      await loadRooms();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="rp-layout">
      <AdminSidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} activePath="/admin/rooms" />

      <div className="rp-main">
        <header className="rp-topbar">
          <div className="rp-topbar__left">
            <button className="rp-topbar__hamburger" onClick={() => setSidebarCollapsed(c => !c)}>☰</button>
            <div>
              <h1 className="rp-topbar__title">Rooms &amp; Prices</h1>
              <p className="rp-topbar__sub">Manage your rooms, occupancy, pricing and features.</p>
            </div>
          </div>
          <div className="rp-topbar__right">
            <div className="rp-topbar__date">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <div className="rp-topbar__user">
              <div className="rp-topbar__avatar">GW</div>
              <div className="rp-topbar__userinfo">
                <span className="rp-topbar__username">Gundel Woite</span>
                <span className="rp-topbar__role">Hotel Owner</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </header>

        <div className="rp-content">
          <div className="rp-top-row">
            <div className="rp-stats">
              <div className="rp-stat"><p className="rp-stat__label">Total Rooms</p><p className="rp-stat__value">{rooms.length}</p><p className="rp-stat__sub">Active rooms</p></div>
              <div className="rp-stat"><p className="rp-stat__label">Room Types</p><p className="rp-stat__value">{roomTypes}</p><p className="rp-stat__sub">Different types</p></div>
              <div className="rp-stat"><p className="rp-stat__label">Extra Bed Price</p><p className="rp-stat__value">from €{extraBedPrice}</p><p className="rp-stat__sub">Per night (age-tiered)</p></div>
              <div className="rp-stat"><p className="rp-stat__label">Breakfast Price</p><p className="rp-stat__value">from €{breakfastPrice}</p><p className="rp-stat__sub">€13 per person</p></div>
            </div>
            <div className="rp-actions">
              <button className="rp-btn rp-btn--primary" disabled title="Villa Elbling has a fixed set of rooms">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                Add New Room
              </button>
              <button className="rp-btn rp-btn--outline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Import from Excel
              </button>
            </div>
          </div>

          <div className="rp-filter-bar">
            <select className="rp-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <div className="rp-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input className="rp-search__input" placeholder="Search room..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="rp-btn rp-btn--outline rp-btn--sm" style={{ marginLeft: "auto" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              Edit Price Rules
            </button>
          </div>

          {error && <p style={{ color: "red", padding: "12px 0" }}>{error}</p>}

          <div className="rp-table-wrap">
            <table className="rp-table">
              <thead>
                <tr>
                  <th className="rp-th rp-th--room">Room</th>
                  <th className="rp-th">Type</th>
                  <th className="rp-th">Standard<br />Occupancy</th>
                  <th className="rp-th">Extra Bed<br />Allowed</th>
                  <th className="rp-th rp-th--price" colSpan={3}>Price (per night)</th>
                  <th className="rp-th">Extra Bed<br />Price (per night)</th>
                  <th className="rp-th">Features</th>
                  <th className="rp-th">Status</th>
                  <th className="rp-th">Actions</th>
                </tr>
                <tr className="rp-subhead">
                  <th colSpan={4} />
                  <th className="rp-subth">Without Breakfast</th>
                  <th className="rp-subth">Breakfast</th>
                  <th className="rp-subth">Total</th>
                  <th colSpan={4} />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={11} className="rp-empty">Loading rooms…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={11} className="rp-empty">No rooms found.</td></tr>
                ) : filtered.map(room => (
                  <tr key={room.id} className="rp-row">
                    <td className="rp-td">
                      <div className="rp-room-cell">
                        {room.img
                          ? <img src={room.img} alt={room.name} className="rp-room-img" />
                          : <div className="rp-room-img rp-room-img--placeholder"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg></div>
                        }
                        <div><p className="rp-room-name">{room.name}</p><p className="rp-room-no">{room.roomNo}</p></div>
                      </div>
                    </td>
                    <td className="rp-td"><span className={`rp-type ${TYPE_COLORS[room.type] || ""}`}>{room.type}</span></td>
                    <td className="rp-td">
                      <div className="rp-occupancy">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        <span>{room.occupancy}</span>
                        {room.occupancyNote && <span className="rp-occ-note">({room.occupancyNote})</span>}
                      </div>
                    </td>
                    <td className="rp-td">
                      {room.extraBed
                        ? <span className="rp-yes"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg>Yes</span>
                        : <span className="rp-no"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>No</span>
                      }
                    </td>
                    <td className="rp-td rp-td--num">€{room.priceBase}</td>
                    <td className="rp-td rp-td--num">€{room.breakfastPP}</td>
                    <td className="rp-td rp-td--num rp-td--total">€{room.priceBase + room.breakfastPP}</td>
                    <td className="rp-td rp-td--num">{room.extraBedPrice ? `€${room.extraBedPrice}` : <span className="rp-dash">—</span>}</td>
                    <td className="rp-td">
                      <div className="rp-features">
                        {room.features.slice(0, 5).map(f => (
                          <span key={f} className="rp-feature-icon" title={FEATURES_MAP[f] || f}><FeatureIcon f={f} /></span>
                        ))}
                        {room.features.length > 5 && <span className="rp-feature-more">+{room.features.length - 5}</span>}
                        {room.features.length === 0 && <span className="rp-dash">—</span>}
                      </div>
                    </td>
                    <td className="rp-td"><span className={`rp-status rp-status--${room.status}`}>{room.status.charAt(0).toUpperCase() + room.status.slice(1)}</span></td>
                    <td className="rp-td">
                      <div className="rp-action-cell">
                        <button className="rp-action-edit" onClick={() => setModal(room)} title="Edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <RoomModal
          room={modal}
          onClose={() => { setModal(null); setMenuOpen(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}