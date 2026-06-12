import { useState, useMemo, useEffect } from "react";
import styles from "./BookingCalendar.module.css";
import { mergeRooms, getPriceForRoom, calcTotalPrice, BREAKFAST_PER_PERSON } from "./BookingData";
import { publicApi } from "../../api/api";

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MAX_ADULTS = 4;
const MAX_CHILDREN = 4;

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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

// Check if a room fits the guest count
function isRoomSuitableForGuests(room, adults, children) {
  const totalGuests = adults + children;
  return totalGuests <= room.maxGuests;
}

// Format guest count as a readable string
function formatGuestLabel(adults, children) {
  const parts = [];
  if (adults > 0) parts.push(`${adults} Adult${adults !== 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} Child${children !== 1 ? "ren" : ""}`);
  return parts.join(", ") || "—";
}

// ─────────────────────────────────────────────
//  CALENDAR COMPONENT
// ─────────────────────────────────────────────
function Calendar({ checkIn, checkOut, hoverDate, onDayClick, onDayHover, viewMonth, onPrev, onNext }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const rangeEnd = checkOut || hoverDate;

  return (
    <div className={styles.calendar}>
      <div className={styles.calNav}>
        <button className={styles.calArrow} onClick={onPrev} aria-label="Previous month">‹</button>
        <span className={styles.calMonthTitle}>{MONTHS[month]} {year}</span>
        <button className={styles.calArrow} onClick={onNext} aria-label="Next month">›</button>
      </div>

      <div className={styles.calGrid}>
        {WEEKDAYS.map(w => (
          <div key={w} className={styles.calDow}>{w}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={"e" + i} className={styles.calEmpty} />;
          const key = toKey(date);
          const past = date < today;
          const isStart = isSameDay(date, checkIn);
          const isEnd = isSameDay(date, checkOut);
          const inRange = isBetween(date, checkIn, rangeEnd);

          let cls = styles.calDay;
          if (past) cls += " " + styles.calDayPast;
          else if (isStart) cls += " " + styles.calDayStart;
          else if (isEnd) cls += " " + styles.calDayEnd;
          else if (inRange) cls += " " + styles.calDayRange;
          else cls += " " + styles.calDayAvail;

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
//  GUEST SELECTOR COMPONENT
// ─────────────────────────────────────────────
function GuestSelector({ adults, children, onAdultsChange, onChildrenChange }) {
  return (
    <div className={styles.guestSelector}>
      <div className={styles.guestRow}>
        <div className={styles.guestInfo}>
          <span className={styles.guestLabel}>Adults</span>
          <span className={styles.guestSub}>Age 18+</span>
        </div>
        <div className={styles.guestCounter}>
          <button
            className={styles.guestBtn}
            onClick={() => onAdultsChange(Math.max(1, adults - 1))}
            disabled={adults <= 1}
            aria-label="Decrease adults"
          >−</button>
          <span className={styles.guestCount}>{adults}</span>
          <button
            className={styles.guestBtn}
            onClick={() => onAdultsChange(Math.min(MAX_ADULTS, adults + 1))}
            disabled={adults >= MAX_ADULTS}
            aria-label="Increase adults"
          >+</button>
        </div>
      </div>

      <div className={styles.guestRow}>
        <div className={styles.guestInfo}>
          <span className={styles.guestLabel}>Children</span>
          <span className={styles.guestSub}>Under 18</span>
        </div>
        <div className={styles.guestCounter}>
          <button
            className={styles.guestBtn}
            onClick={() => onChildrenChange(Math.max(0, children - 1))}
            disabled={children <= 0}
            aria-label="Decrease children"
          >−</button>
          <span className={styles.guestCount}>{children}</span>
          <button
            className={styles.guestBtn}
            onClick={() => onChildrenChange(Math.min(MAX_CHILDREN, children + 1))}
            disabled={children >= MAX_CHILDREN}
            aria-label="Increase children"
          >+</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ROOM CARD
// ─────────────────────────────────────────────
function RoomCard({ room, available, checkIn, checkOut, nights, adults, children, onSelect }) {
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const firstAvail = null; // availability comes from backend now
  const pricePerNight = getPriceForRoom(room, includeBreakfast);
  const total = checkIn && checkOut ? calcTotalPrice(room, nights, includeBreakfast) : null;

  // Breakfast is €13 per person × standard occupancy. Show both the total and the basis.
  const breakfastPeople = room.standardOccupancy
    || Math.max(1, Math.round(room.breakfastPrice / BREAKFAST_PER_PERSON));

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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {room.maxGuests} {room.maxGuests === 1 ? "Guest" : "Guests"}
                {room.occupancyNote ? ` (${room.occupancyNote})` : ""}
              </span>
              {room.highlights.slice(0, 2).map(h => (
                <span key={h} className={styles.roomSpec}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {h}
                </span>
              ))}
            </div>

            {/* Availability badge */}
            {available ? (
              <p className={styles.roomAvailBadge}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {checkIn && checkOut ? "Available for selected dates" : "Available"}
              </p>
            ) : (
              <p className={styles.roomUnavailBadge}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                Not available
              </p>
            )}

            {/* Breakfast toggle — only show for available rooms */}
            {available && (
              <label className={styles.breakfastToggle}>
                <input
                  type="checkbox"
                  checked={includeBreakfast}
                  onChange={e => setIncludeBreakfast(e.target.checked)}
                />
                <span className={styles.breakfastToggleLabel}>
                  Add breakfast
                  <span className={styles.breakfastTogglePrice}>
                    +€{room.breakfastPrice}/night (€{BREAKFAST_PER_PERSON} per person × {breakfastPeople})
                  </span>
                </span>
              </label>
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
                  onClick={() => onSelect(room, includeBreakfast)}
                >
                  Select Room
                </button>
              </>
            ) : (
              <div className={styles.roomAvailFrom}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
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
//  BOOKING MODAL
// ─────────────────────────────────────────────
function BookingModal({ room, roomUuid, checkIn, checkOut, nights, total, includeBreakfast, adults, children, onClose, onConfirm }) {
  const [step, setStep] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", requests: "" });
  const [errors, setErrors] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingReference, setBookingReference] = useState(null);

  const STEPS = ["Select Room", "Guest Information", "Confirmation"];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.phone.trim()) e.phone = "Please enter your phone number.";
    return e;
  }

  function handleContinue() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(3);
  }

  async function handleConfirmFinal() {
    setBookingLoading(true);
    setBookingError(null);

    const nameParts = form.name.trim().split(/\s+/);
    const firstName = nameParts[0] || form.name;
    const lastName = nameParts.slice(1).join(" ") || "-";

    try {
      const result = await publicApi.createBooking({
        roomId: roomUuid,
        checkIn: toKey(checkIn),
        checkOut: toKey(checkOut),
        adults,
        children,
        firstName,
        lastName,
        email: form.email,
        phone: form.phone,
        includeBreakfast,
        specialRequests: form.requests || null,
      });
      setBookingReference(result.bookingReference);
      if (onConfirm) onConfirm(result);
    } catch (err) {
      setBookingError(err.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  }

  const guestLabel = formatGuestLabel(adults, children);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <h2 className={styles.modalTitle}>Book your stay</h2>
            <p className={styles.modalSub}>Step {step} of 3 – {STEPS[step - 1]}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Step indicator */}
        <div className={styles.modalSteps}>
          {STEPS.map((label, i) => {
            const num = i + 1;
            const done = step > num;
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

        {/* ── STEP 2: GUEST INFORMATION ── */}
        {step === 2 && (
          <div className={styles.modalBody}>

            {/* Left: form */}
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
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      {formatDateShort(checkIn)}
                    </span>
                  </div>
                  <div className={styles.modalStayDivider} />
                  <div className={styles.modalStayCell}>
                    <span className={styles.modalStayCellLabel}>Check-out</span>
                    <span className={styles.modalStayCellVal}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
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
                    <span className={styles.modalStayCellVal}>👤 {guestLabel}</span>
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
                  onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                />
                {errors.name && <p className={styles.errMsg}>{errors.name}</p>}
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Email Address <span className={styles.req}>*</span></label>
                <input
                  className={`${styles.modalInput} ${errors.email ? styles.inputErr : ""}`}
                  type="email" placeholder="max@example.com"
                  value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                />
                {errors.email && <p className={styles.errMsg}>{errors.email}</p>}
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Phone Number <span className={styles.req}>*</span></label>
                <input
                  className={`${styles.modalInput} ${errors.phone ? styles.inputErr : ""}`}
                  type="tel" placeholder="+49 123 456789"
                  value={form.phone}
                  onChange={e => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                />
                {errors.phone && <p className={styles.errMsg}>{errors.phone}</p>}
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Home Address (optional)</label>
                <input
                  className={styles.modalInput}
                  type="text" placeholder="Street, City, Country"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Special Requests (optional)</label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Late arrival, dietary needs, special occasions..."
                  rows={3}
                  value={form.requests}
                  onChange={e => setForm({ ...form, requests: e.target.value })}
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.modalBtnBack} onClick={onClose}>← Back</button>
                <button className={styles.modalBtnNext} onClick={handleContinue}>
                  Continue to Confirmation
                </button>
              </div>
            </div>

            {/* Right: booking summary */}
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
                <p className={styles.modalSummaryValue}>{guestLabel}</p>
              </div>

              <div className={styles.modalSummarySection}>
                <p className={styles.modalSummaryLabel}>Breakfast</p>
                <p className={styles.modalSummaryValue}>
                  {includeBreakfast
                    ? `Included (+€${room.breakfastPrice}/night)`
                    : "Not included"}
                </p>
              </div>

              <div className={styles.modalSummaryDivider} />

              <div className={styles.modalSummarySection}>
                <p className={styles.modalSummaryLabel}>Price Breakdown</p>
                <div className={styles.modalBreakdown}>
                  <div className={styles.modalBreakdownRow}>
                    <span>Room rate</span>
                    <span>€{getPriceForRoom(room, includeBreakfast)}/night</span>
                  </div>
                  <div className={styles.modalBreakdownRow}>
                    <span>{nights} night{nights !== 1 ? "s" : ""}</span>
                    <span>× €{getPriceForRoom(room, includeBreakfast)}</span>
                  </div>
                  {includeBreakfast && (
                    <div className={styles.modalBreakdownRow}>
                      <span>Breakfast included</span>
                      <span>€{room.breakfastPrice}/night</span>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  <div>
                    <p className={styles.modalTrustTitle}>Free Cancellation</p>
                    <p className={styles.modalTrustSub}>Up to 7 days before arrival</p>
                  </div>
                </div>
                <div className={styles.modalTrustItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <div>
                    <p className={styles.modalTrustTitle}>Secure Booking</p>
                    <p className={styles.modalTrustSub}>Your data is safe with us</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: CONFIRMATION ── */}
        {step === 3 && !bookingReference && (
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
              <div className={styles.modalConfirmRow}><span>Phone</span><strong>{form.phone}</strong></div>
              {form.address && <div className={styles.modalConfirmRow}><span>Address</span><strong>{form.address}</strong></div>}
              <div className={styles.modalConfirmRow}><span>Check-in</span><strong>{formatDateShort(checkIn)}</strong></div>
              <div className={styles.modalConfirmRow}><span>Check-out</span><strong>{formatDateShort(checkOut)}</strong></div>
              <div className={styles.modalConfirmRow}><span>Nights</span><strong>{nights}</strong></div>
              <div className={styles.modalConfirmRow}><span>Guests</span><strong>{guestLabel}</strong></div>
              <div className={styles.modalConfirmRow}>
                <span>Breakfast</span>
                <strong>{includeBreakfast ? "Included" : "Not included"}</strong>
              </div>
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

            {bookingError && (
              <p style={{ color: "red", marginBottom: "12px", textAlign: "center" }}>
                {bookingError}
              </p>
            )}
            <div className={styles.modalActions}>
              <button className={styles.modalBtnBack} onClick={() => setStep(2)} disabled={bookingLoading}>
                ← Back
              </button>
              <button className={styles.modalBtnConfirm} onClick={handleConfirmFinal} disabled={bookingLoading}>
                {bookingLoading ? "Submitting…" : "Send Booking Request →"}
              </button>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {bookingReference && (
          <div className={styles.modalConfirm}>
            <div className={styles.modalConfirmIcon}>✓</div>
            <h3 className={styles.modalConfirmTitle}>Booking Confirmed!</h3>
            <p className={styles.modalConfirmSub}>Your booking reference number is:</p>
            <p style={{ fontSize: "1.6rem", fontWeight: "bold", letterSpacing: "3px", margin: "16px 0" }}>
              {bookingReference}
            </p>
            <p className={styles.modalConfirmSub}>
              Please save this reference. A confirmation will be sent to{" "}
              <strong>{form.email}</strong>.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnConfirm} onClick={onClose}>
                Close
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

  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selecting, setSelecting] = useState("in");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showUnavail, setShowUnavail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // All rooms (merged API + presentation). Loaded once on mount.
  const [allRooms, setAllRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);

  // API-driven availability state (date-filtered)
  const [apiAvailableRoomNos, setApiAvailableRoomNos] = useState(null);
  const [roomUuidMap, setRoomUuidMap] = useState({});
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  const totalGuests = adults + children;

  // Load the full room list from the API once (live prices/occupancy/status)
  useEffect(() => {
    let cancelled = false;
    setRoomsLoading(true);
    setRoomsError(null);
    publicApi.getRooms()
      .then(apiRooms => {
        if (cancelled) return;
        setAllRooms(mergeRooms(apiRooms));
      })
      .catch(err => {
        if (cancelled) return;
        setRoomsError(err.message || "Could not load rooms. Please try again.");
      })
      .finally(() => { if (!cancelled) setRoomsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Show "contact us" message if group exceeds all room capacities
  const maxCapacity = allRooms.length
    ? Math.max(...allRooms.map(r => r.maxGuests))
    : 0;
  const groupTooLarge = allRooms.length > 0 && totalGuests > maxCapacity;

  // Fetch availability from backend whenever dates or guests change
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setApiAvailableRoomNos(null);
      setRoomUuidMap({});
      return;
    }

    const guests = adults + children;
    setAvailabilityLoading(true);
    setAvailabilityError(null);

    publicApi.getAvailability(toKey(checkIn), toKey(checkOut), guests)
      .then(rooms => {
        const nos = new Set(rooms.map(r => r.roomNumber));
        const uuidMap = {};
        rooms.forEach(r => { uuidMap[r.roomNumber] = r.id; });
        setApiAvailableRoomNos(nos);
        setRoomUuidMap(uuidMap);
      })
      .catch((err) => {
        // Clear stale results so no rooms render alongside the error
        setApiAvailableRoomNos(new Set());
        setRoomUuidMap({});
        setAvailabilityError(err.message || "Could not load availability. Please try again.");
      })
      .finally(() => setAvailabilityLoading(false));
  }, [checkIn, checkOut, adults, children]);

  // Day click logic
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

  const nights = calcNights(checkIn, checkOut);

  // Available rooms — before dates picked, filter by guest count only;
  // after dates picked, use backend availability matched by room number.
  const availableRooms = useMemo(() => {
    if (!checkIn || !checkOut) {
      return allRooms.filter(r => isRoomSuitableForGuests(r, adults, children));
    }
    if (!apiAvailableRoomNos) return [];
    return allRooms.filter(r => apiAvailableRoomNos.has(r.roomNo));
  }, [allRooms, checkIn, checkOut, adults, children, apiAvailableRoomNos]);

  const unavailableRooms = useMemo(() => {
    if (!checkIn || !checkOut) {
      return allRooms.filter(r => !isRoomSuitableForGuests(r, adults, children));
    }
    if (!apiAvailableRoomNos) return [];
    return allRooms.filter(r => !apiAvailableRoomNos.has(r.roomNo));
  }, [allRooms, checkIn, checkOut, adults, children, apiAvailableRoomNos]);

  function handleSelectRoom(room, includeBreakfast) {
    if (!checkIn || !checkOut) {
      alert("Please select your check-in and check-out dates first.");
      return;
    }
    const total = calcTotalPrice(room, nights, includeBreakfast);
    // Prefer the UUID from the availability response; fall back to the merged room's uuid.
    const roomUuid = roomUuidMap[room.roomNo] || room.uuid;
    setSelectedRoom({ room, total, includeBreakfast, roomUuid });
  }

  function handleConfirm(bookingData) {
    if (onConfirm) onConfirm(bookingData);
  }

  return (
    <>
      <div className={styles.layout}>

        {/* ══ LEFT PANEL — Calendar + Guests ══ */}
        <div className={styles.leftPanel}>

          {/* Step 1 — Dates */}
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
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
            onNext={() => setViewMonth(addMonths(viewMonth, 1))}
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
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
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

          {/* Step 2 — Guests */}
          <div className={styles.panelHeading} style={{ marginTop: "20px" }}>
            <span className={styles.panelIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <h2 className={styles.panelTitle}>2. Select guests</h2>
          </div>

          <GuestSelector
            adults={adults}
            children={children}
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
          />

          {/* Info note */}
          <div className={styles.infoNote}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Availability updates in real-time as you select your dates and guests.
          </div>
        </div>

        {/* ══ RIGHT PANEL — Rooms ══ */}
        <div className={styles.rightPanel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <h2 className={styles.panelTitle}>3. Choose your room</h2>
            <span className={styles.availBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {availableRooms.length} room{availableRooms.length !== 1 ? "s" : ""} available
            </span>
          </div>

          {/* Initial room-list load states */}
          {roomsLoading && (
            <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
              Loading rooms…
            </p>
          )}
          {roomsError && (
            <div className={styles.availabilityNotice}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {roomsError}
            </div>
          )}

          {availabilityLoading && (
            <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
              Checking availability…
            </p>
          )}

          {availabilityError && (
            <div className={styles.availabilityNotice}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {availabilityError}
            </div>
          )}

          {/* Group too large warning */}
          {groupTooLarge && (
            <div className={styles.groupWarning}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              For groups larger than {maxCapacity} guests, please{" "}
              <a href="/anfahrt" className={styles.groupWarningLink}>contact us directly</a>.
            </div>
          )}

          <div className={styles.roomList}>
            {availableRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                available={true}
                checkIn={checkIn}
                checkOut={checkOut}
                nights={nights}
                adults={adults}
                children={children}
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </span>
                Not available for selected dates / guests
                <span className={styles.unavailCount}>
                  {unavailableRooms.length} room{unavailableRooms.length !== 1 ? "s" : ""}
                </span>
                <svg
                  className={`${styles.unavailChevron} ${showUnavail ? styles.unavailChevronOpen : ""}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
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
                      adults={adults}
                      children={children}
                      onSelect={handleSelectRoom}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom.room}
          roomUuid={selectedRoom.roomUuid}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          total={selectedRoom.total}
          includeBreakfast={selectedRoom.includeBreakfast}
          adults={adults}
          children={children}
          onClose={() => setSelectedRoom(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
