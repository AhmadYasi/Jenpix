import { useState, useMemo } from "react";
import styles from "./BookingCalendar.module.css";
import { ROOMS, UNAVAILABLE_DATES, getPriceForDate } from "./BookingData";

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS   = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function toKey(date) {
  return date.toISOString().slice(0, 10);
}

function isSameDay(a, b) {
  return a && b && toKey(a) === toKey(b);
}

function isBetween(date, start, end) {
  if (!start || !end) return false;
  const d = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return d > s && d < e;
}

function formatDateLong(date) {
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(date) {
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function calcNights(start, end) {
  if (!start || !end) return 0;
  return Math.round(Math.abs(end - start) / 86400000);
}

function addMonths(date, n) {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return d;
}

// Check if a room is fully available for the selected range
function isRoomAvailableForRange(room, checkIn, checkOut) {
  if (!checkIn || !checkOut) return true; // no dates selected = show all
  const unavail = new Set(UNAVAILABLE_DATES[room.id] || []);
  const cur = new Date(Math.min(checkIn, checkOut));
  const end = new Date(Math.max(checkIn, checkOut));
  while (cur < end) {
    if (unavail.has(toKey(cur))) return false;
    cur.setDate(cur.getDate() + 1);
  }
  return true;
}

// Get first available date after range for unavailable rooms
function getFirstAvailableAfter(room, checkOut) {
  if (!checkOut) return null;
  const unavail = new Set(UNAVAILABLE_DATES[room.id] || []);
  const cur = new Date(checkOut);
  cur.setDate(cur.getDate() + 1);
  // Search up to 60 days ahead
  for (let i = 0; i < 60; i++) {
    if (!unavail.has(toKey(cur))) return new Date(cur);
    cur.setDate(cur.getDate() + 1);
  }
  return null;
}

// Calculate total price for a range
function calcTotal(room, checkIn, checkOut) {
  if (!checkIn || !checkOut) return room.basePrice;
  const nights = calcNights(checkIn, checkOut);
  if (nights === 0) return room.basePrice;
  let total = 0;
  const cur = new Date(Math.min(checkIn, checkOut));
  const end = new Date(Math.max(checkIn, checkOut));
  while (cur < end) {
    total += getPriceForDate(room, cur);
    cur.setDate(cur.getDate() + 1);
  }
  return total;
}

// ─────────────────────────────────────────────
//  CALENDAR COMPONENT
// ─────────────────────────────────────────────
function Calendar({ checkIn, checkOut, hoverDate, onDayClick, onDayHover, viewMonth, onPrev, onNext }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year  = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstDay    = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const rangeEnd = checkOut || hoverDate;

  return (
    <div className={styles.calendar}>
      {/* Month nav */}
      <div className={styles.calNav}>
        <button className={styles.calArrow} onClick={onPrev} aria-label="Previous month">‹</button>
        <span className={styles.calMonthTitle}>{MONTHS[month]} {year}</span>
        <button className={styles.calArrow} onClick={onNext} aria-label="Next month">›</button>
      </div>

      {/* Weekday headers */}
      <div className={styles.calGrid}>
        {WEEKDAYS.map(w => (
          <div key={w} className={styles.calDow}>{w}</div>
        ))}

        {/* Day cells */}
        {cells.map((date, i) => {
          if (!date) return <div key={"e" + i} className={styles.calEmpty} />;

          const key     = toKey(date);
          const past    = date < today;
          const isStart = isSameDay(date, checkIn);
          const isEnd   = isSameDay(date, checkOut);
          const inRange = isBetween(date, checkIn, rangeEnd);

          let cls = styles.calDay;
          if (past)         cls += " " + styles.calDayPast;
          else if (isStart) cls += " " + styles.calDayStart;
          else if (isEnd)   cls += " " + styles.calDayEnd;
          else if (inRange) cls += " " + styles.calDayRange;
          else              cls += " " + styles.calDayAvail;

          return (
            <button
              key={key}
              className={cls}
              disabled={past}
              onClick={() => !past && onDayClick(date)}
              onMouseEnter={() => !past && onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              aria-label={`${date.getDate()} ${MONTHS[month]} ${year}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ROOM CARD
// ─────────────────────────────────────────────
function RoomCard({ room, available, checkIn, checkOut, nights, onSelect }) {
  const firstAvail = !available && checkOut ? getFirstAvailableAfter(room, checkOut) : null;
  const pricePerNight = getPriceForDate(room, checkIn || new Date());
  const total = checkIn && checkOut ? calcTotal(room, checkIn, checkOut) : null;

  return (
    <div className={`${styles.roomCard} ${!available ? styles.roomCardUnavail : ""}`}>
      <img src={room.image} alt={room.name} className={styles.roomImg} />

      <div className={styles.roomBody}>
        <div className={styles.roomTop}>
          <div className={styles.roomInfo}>
            <h3 className={styles.roomName}>{room.name}</h3>
            <p className={styles.roomDesc}>{room.description}</p>

            {/* Specs row */}
            <div className={styles.roomSpecs}>
              <span className={styles.roomSpec}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {room.guests} {room.guests === 1 ? "Guest" : "Guests"}
              </span>
              {room.highlights.slice(0, 2).map(h => (
                <span key={h} className={styles.roomSpec}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {h}
                </span>
              ))}
            </div>

            {/* Availability status */}
            {available ? (
              <p className={styles.roomAvailBadge}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {checkIn && checkOut ? "Available for selected dates" : "Available"}
              </p>
            ) : (
              <p className={styles.roomUnavailBadge}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
                Not available
              </p>
            )}
          </div>

          {/* Price + button */}
          <div className={styles.roomRight}>
            {available ? (
              <>
                <div className={styles.roomPriceWrap}>
                  {total && nights > 1 ? (
                    <>
                      <span className={styles.roomPriceTotal}>€{total}</span>
                      <span className={styles.roomPriceSub}>total · {nights} nights</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.roomPrice}>€{pricePerNight}</span>
                      <span className={styles.roomPriceSub}>per night</span>
                    </>
                  )}
                </div>
                <button
                  className={styles.roomSelectBtn}
                  onClick={() => onSelect(room)}
                >
                  Select Room
                </button>
              </>
            ) : (
              <div className={styles.roomAvailFrom}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8"  y1="2" x2="8"  y2="6"/>
                  <line x1="3"  y1="10" x2="21" y2="10"/>
                </svg>
                <div>
                  <p className={styles.roomAvailFromLabel}>Available from</p>
                  <p className={styles.roomAvailFromDate}>
                    {firstAvail ? formatDateShort(firstAvail) : "Check dates"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  NIGHTLY BREAKDOWN HELPER
// ─────────────────────────────────────────────
function getNightlyBreakdown(room, checkIn, checkOut) {
  if (!room || !checkIn || !checkOut) return [];
  const breakdown = [];
  const cur  = new Date(Math.min(checkIn, checkOut));
  const last = new Date(Math.max(checkIn, checkOut));
  let night  = 1;
  while (cur < last) {
    breakdown.push({ night, date: new Date(cur), price: getPriceForDate(room, cur) });
    cur.setDate(cur.getDate() + 1);
    night++;
  }
  return breakdown;
}

// ─────────────────────────────────────────────
//  BOOKING MODAL  — Figma design
//  Step indicator · two-column · summary sidebar
// ─────────────────────────────────────────────
function BookingModal({ room, checkIn, checkOut, nights, total, onClose, onConfirm }) {
  const [step,      setStep]   = useState(2); // starts at step 2 (room already chosen)
  const [form, setForm]        = useState({ name: "", email: "", phone: "", guests: String(room.guests), requests: "" });
  const [errors, setErrors]    = useState({});

  const breakdown = getNightlyBreakdown(room, checkIn, checkOut);

  // Guest options up to room max
  const guestOptions = Array.from({ length: room.guests }, (_, i) => i + 1);

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email.";
    return e;
  }

  function handleContinue() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(3);
  }

  function handleConfirmFinal() {
    onConfirm({ room, checkIn, checkOut, nights, total, guest: form });
  }

  // Prevent background scroll while modal open
  const STEPS = ["Select Room", "Guest Information", "Confirmation"];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* ── MODAL HEADER ─────────────────────────────────────── */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <h2 className={styles.modalTitle}>Book your stay</h2>
            <p className={styles.modalSub}>
              Step {step} of 3 – {STEPS[step - 1]}
            </p>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── STEP INDICATOR ───────────────────────────────────── */}
        <div className={styles.modalSteps}>
          {STEPS.map((label, i) => {
            const num    = i + 1;
            const done   = step > num;
            const active = step === num;
            return (
              <div key={label} className={styles.modalStepItem}>
                <div className={`${styles.modalStepCircle} ${active ? styles.modalStepActive : ""} ${done ? styles.modalStepDone : ""}`}>
                  {done ? "✓" : num}
                </div>
                <span className={`${styles.modalStepLabel} ${active ? styles.modalStepLabelActive : ""} ${done ? styles.modalStepLabelDone : ""}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`${styles.modalStepLine} ${done ? styles.modalStepLineDone : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── STEP 2: GUEST INFORMATION ────────────────────────── */}
        {step === 2 && (
          <div className={styles.modalBody}>

            {/* LEFT: form column */}
            <div className={styles.modalFormCol}>

              {/* Room mini-card */}
              <div className={styles.modalRoomBar}>
                <img src={room.image} alt={room.name} className={styles.modalRoomBarImg} />
                <div className={styles.modalRoomBarInfo}>
                  <p className={styles.modalRoomBarName}>{room.name}</p>
                  <ul className={styles.modalRoomBarHighlights}>
                    {room.highlights.map(h => <li key={h}>{h}</li>)}
                  </ul>
                  <button className={styles.modalRoomBarView} onClick={onClose}>View details</button>
                </div>
              </div>

              {/* Your Stay bar */}
              <div className={styles.modalStaySection}>
                <h3 className={styles.modalSectionTitle}>Your Stay</h3>
                <div className={styles.modalStayBar}>
                  <div className={styles.modalStayCell}>
                    <span className={styles.modalStayCellLabel}>Check-in</span>
                    <span className={styles.modalStayCellVal}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {formatDateShort(checkIn)}
                    </span>
                  </div>
                  <div className={styles.modalStayDivider} />
                  <div className={styles.modalStayCell}>
                    <span className={styles.modalStayCellLabel}>Check-out</span>
                    <span className={styles.modalStayCellVal}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {formatDateShort(checkOut)}
                    </span>
                  </div>
                  <div className={styles.modalStayDivider} />
                  <div className={styles.modalStayCell}>
                    <span className={styles.modalStayCellLabel}>Nights</span>
                    <span className={styles.modalStayCellVal}>🌙 {nights}</span>
                  </div>
                  <div className={styles.modalStayDivider} />
                  <div className={styles.modalStayCell}>
                    <span className={styles.modalStayCellLabel}>Guests</span>
                    <span className={styles.modalStayCellVal}>👤 {form.guests}</span>
                  </div>
                  <button className={styles.modalStayChange} onClick={onClose}>Change</button>
                </div>
              </div>

              {/* Guest info form */}
              <h3 className={styles.modalSectionTitle}>Guest Information</h3>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Full Name <span className={styles.req}>*</span></label>
                <input
                  className={`${styles.modalInput} ${errors.name ? styles.inputErr : ""}`}
                  type="text" placeholder="Max Mustermann"
                  value={form.name}
                  onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: ""}); }}
                />
                {errors.name && <p className={styles.errMsg}>{errors.name}</p>}
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Email Address <span className={styles.req}>*</span></label>
                <input
                  className={`${styles.modalInput} ${errors.email ? styles.inputErr : ""}`}
                  type="email" placeholder="max@example.com"
                  value={form.email}
                  onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email: ""}); }}
                />
                {errors.email && <p className={styles.errMsg}>{errors.email}</p>}
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Phone Number (optional)</label>
                <input
                  className={styles.modalInput}
                  type="tel" placeholder="+49 123 456789"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Special Requests (optional)</label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Special requests, allergies, arrival time..."
                  rows={4}
                  value={form.requests}
                  onChange={e => setForm({...form, requests: e.target.value})}
                />
              </div>

              {/* Actions */}
              <div className={styles.modalActions}>
                <button className={styles.modalBtnBack} onClick={onClose}>← Back</button>
                <button className={styles.modalBtnNext} onClick={handleContinue}>
                  Continue to Confirmation
                </button>
              </div>
            </div>

            {/* RIGHT: booking summary */}
            <div className={styles.modalSummaryCol}>
              <h3 className={styles.modalSummaryTitle}>Booking Summary</h3>

              <div className={styles.modalSummarySection}>
                <p className={styles.modalSummaryLabel}>Room</p>
                <p className={styles.modalSummaryValue}>{room.name}</p>
              </div>

              <div className={styles.modalSummarySection}>
                <p className={styles.modalSummaryLabel}>Dates</p>
                <p className={styles.modalSummaryValue}>
                  {formatDateShort(checkIn)} – {formatDateShort(checkOut)}
                </p>
                <p className={styles.modalSummaryMeta}>{nights} night{nights !== 1 ? "s" : ""}</p>
              </div>

              <div className={styles.modalSummarySection}>
                <p className={styles.modalSummaryLabel}>Guests</p>
                <p className={styles.modalSummaryValue}>{form.guests} Adult{form.guests > 1 ? "s" : ""}</p>
              </div>

              <div className={styles.modalSummaryDivider} />

              <div className={styles.modalSummarySection}>
                <p className={styles.modalSummaryLabel}>Price Breakdown</p>
                <div className={styles.modalBreakdown}>
                  {breakdown.slice(0, 5).map((n, i) => (
                    <div key={i} className={styles.modalBreakdownRow}>
                      <span>{n.night === 1 ? "1st" : n.night === 2 ? "2nd" : n.night === 3 ? "3rd" : `${n.night}th`} Night</span>
                      <span>€{n.price}</span>
                    </div>
                  ))}
                  {breakdown.length > 5 && (
                    <div className={styles.modalBreakdownRow}>
                      <span>+ {breakdown.length - 5} more nights</span>
                      <span>€{breakdown.slice(5).reduce((s, n) => s + n.price, 0)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalSummaryDivider} />

              <div className={styles.modalSummaryTotal}>
                <span>Total</span>
                <span className={styles.modalSummaryTotalPrice}>€{total}</span>
              </div>
              <p className={styles.modalSummaryVat}>All prices include VAT.</p>

              <div className={styles.modalSummaryDivider} />

              <div className={styles.modalSummaryTrust}>
                <div className={styles.modalTrustItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div>
                    <p className={styles.modalTrustTitle}>Free Cancellation</p>
                    <p className={styles.modalTrustSub}>Up to 7 days before arrival</p>
                  </div>
                </div>
                <div className={styles.modalTrustItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <div>
                    <p className={styles.modalTrustTitle}>Secure Booking</p>
                    <p className={styles.modalTrustSub}>Your data is safe with us</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: CONFIRMATION ─────────────────────────────── */}
        {step === 3 && (
          <div className={styles.modalConfirm}>
            <div className={styles.modalConfirmIcon}>✓</div>
            <h3 className={styles.modalConfirmTitle}>Confirm Your Booking</h3>
            <p className={styles.modalConfirmSub}>
              Please review your details and confirm your booking request.
            </p>

            <div className={styles.modalConfirmDetails}>
              <div className={styles.modalConfirmRow}><span>Room</span><strong>{room.name}</strong></div>
              <div className={styles.modalConfirmRow}><span>Guest</span><strong>{form.name}</strong></div>
              <div className={styles.modalConfirmRow}><span>Email</span><strong>{form.email}</strong></div>
              {form.phone && <div className={styles.modalConfirmRow}><span>Phone</span><strong>{form.phone}</strong></div>}
              <div className={styles.modalConfirmRow}><span>Check-in</span><strong>{formatDateShort(checkIn)}</strong></div>
              <div className={styles.modalConfirmRow}><span>Check-out</span><strong>{formatDateShort(checkOut)}</strong></div>
              <div className={styles.modalConfirmRow}><span>Nights</span><strong>{nights}</strong></div>
              <div className={styles.modalConfirmRow}><span>Guests</span><strong>{form.guests} Adult{form.guests > 1 ? "s" : ""}</strong></div>
              <div className={`${styles.modalConfirmRow} ${styles.modalConfirmRowTotal}`}>
                <span>Total</span><strong>€{total}</strong>
              </div>
            </div>

            {form.requests && (
              <div className={styles.modalConfirmRequests}>
                <p className={styles.modalSummaryLabel}>Special Requests</p>
                <p className={styles.modalConfirmRequestsText}>{form.requests}</p>
              </div>
            )}

            <div className={styles.modalActions}>
              <button className={styles.modalBtnBack} onClick={() => setStep(2)}>← Back</button>
              <button className={styles.modalBtnConfirm} onClick={handleConfirmFinal}>
                Send Booking Request →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────
export default function BookingCalendar({ onConfirm }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth,  setViewMonth]  = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn,    setCheckIn]    = useState(null);
  const [checkOut,   setCheckOut]   = useState(null);
  const [hoverDate,  setHoverDate]  = useState(null);
  const [selecting,  setSelecting]  = useState("in"); // "in" | "out"
  const [showUnavail, setShowUnavail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null); // triggers modal

  // ── Day click logic ──────────────────────────────────────────────────────
  function handleDayClick(date) {
    if (selecting === "in" || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      setSelecting("out");
    } else {
      if (date <= checkIn) {
        setCheckIn(date);
        setCheckOut(null);
        setSelecting("out");
      } else {
        setCheckOut(date);
        setSelecting("in");
      }
    }
  }

  function handleEdit() {
    setCheckIn(null);
    setCheckOut(null);
    setSelecting("in");
  }

  // ── Derived data ─────────────────────────────────────────────────────────
  const nights = calcNights(checkIn, checkOut);

  const availableRooms   = useMemo(() =>
    ROOMS.filter(r => isRoomAvailableForRange(r, checkIn, checkOut)),
    [checkIn, checkOut]
  );
  const unavailableRooms = useMemo(() =>
    ROOMS.filter(r => !isRoomAvailableForRange(r, checkIn, checkOut)),
    [checkIn, checkOut]
  );

  function handleSelectRoom(room) {
    if (!checkIn || !checkOut) {
      alert("Please select your check-in and check-out dates first.");
      return;
    }
    const total = calcTotal(room, checkIn, checkOut);
    setSelectedRoom({ room, total });
  }

  function handleConfirm(bookingData) {
    setSelectedRoom(null);
    if (onConfirm) onConfirm(bookingData);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className={styles.layout}>

        {/* ══════════════════════════════════════
            LEFT PANEL — Calendar
        ══════════════════════════════════════ */}
        <div className={styles.leftPanel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <h2 className={styles.panelTitle}>1. Select your dates</h2>
          </div>

          <Calendar
            checkIn={checkIn}
            checkOut={checkOut}
            hoverDate={hoverDate}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
            viewMonth={viewMonth}
            onPrev={() => setViewMonth(addMonths(viewMonth, -1))}
            onNext={() => setViewMonth(addMonths(viewMonth,  1))}
          />

          {/* Legend */}
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotSelected}`} />Selected
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotAvail}`} />Available
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotNa}`} />Not available
            </span>
          </div>

          {/* Selected dates summary */}
          <div className={styles.datesSummary}>
            <div className={styles.datesSummaryRow}>
              <span className={styles.datesSummaryIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8"  y1="2" x2="8"  y2="6"/>
                  <line x1="3"  y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <div className={styles.datesSummaryContent}>
                <p className={styles.datesSummaryLabel}>Selected Dates</p>
                <p className={styles.datesSummaryValue}>
                  {checkIn && checkOut ? (
                    <>
                      {formatDateLong(checkIn)} – {formatDateLong(checkOut)}{" "}
                      <span className={styles.datesSummaryNights}>({nights} night{nights !== 1 ? "s" : ""})</span>
                    </>
                  ) : checkIn ? (
                    <span className={styles.placeholder}>Select check-out date…</span>
                  ) : (
                    <span className={styles.placeholder}>Select check-in date…</span>
                  )}
                </p>
              </div>
              {(checkIn || checkOut) && (
                <button className={styles.editBtn} onClick={handleEdit}>Edit ✎</button>
              )}
            </div>
          </div>

          {/* Info note */}
          <div className={styles.infoNote}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Availability updates in real-time as you select your dates.
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT PANEL — Rooms
        ══════════════════════════════════════ */}
        <div className={styles.rightPanel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            <h2 className={styles.panelTitle}>2. Available rooms</h2>
            <span className={styles.availBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {availableRooms.length} room{availableRooms.length !== 1 ? "s" : ""} available
            </span>
          </div>

          {/* Available rooms */}
          <div className={styles.roomList}>
            {availableRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                available={true}
                checkIn={checkIn}
                checkOut={checkOut}
                nights={nights}
                onSelect={handleSelectRoom}
              />
            ))}
          </div>

          {/* Unavailable rooms */}
          {unavailableRooms.length > 0 && (
            <div className={styles.unavailSection}>
              <button
                className={styles.unavailToggle}
                onClick={() => setShowUnavail(u => !u)}
              >
                <span className={styles.unavailToggleIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                  </svg>
                </span>
                Not available for selected dates
                <span className={styles.unavailCount}>
                  {unavailableRooms.length} room{unavailableRooms.length !== 1 ? "s" : ""} not available
                </span>
                <svg
                  className={`${styles.unavailChevron} ${showUnavail ? styles.unavailChevronOpen : ""}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showUnavail && (
                <div className={styles.roomList}>
                  {unavailableRooms.map(room => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      available={false}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      nights={nights}
                      onSelect={handleSelectRoom}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOOKING MODAL
      ══════════════════════════════════════ */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom.room}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          total={selectedRoom.total}
          onClose={() => setSelectedRoom(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}