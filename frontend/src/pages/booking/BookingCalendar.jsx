import { useState, useMemo } from "react";
import styles from "./BookingCalendar.module.css";
import { ROOMS, UNAVAILABLE_DATES, getPriceForDate } from "./BookingData";

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
const WEEKDAYS     = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS       = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

function toKey(date) {
  return date.toISOString().slice(0, 10);
}

function addMonths(date, n) {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return d;
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

function formatDate(date) {
  if (!date) return "—";
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateShort(date) {
  if (!date) return "—";
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

function calcNights(start, end) {
  if (!start || !end) return 0;
  return Math.round(Math.abs(end - start) / 86400000);
}

function getNightlyBreakdown(room, start, end) {
  if (!start || !end || !room) return [];
  const breakdown = [];
  const cur  = new Date(Math.min(start, end));
  const last = new Date(Math.max(start, end));
  let night  = 1;
  while (cur < last) {
    breakdown.push({ night, date: new Date(cur), price: getPriceForDate(room, cur) });
    cur.setDate(cur.getDate() + 1);
    night++;
  }
  return breakdown;
}

// ─────────────────────────────────────────────
//  SINGLE MONTH GRID
// ─────────────────────────────────────────────
function MonthGrid({ year, month, room, checkIn, checkOut, hoverDate, onDayClick, onDayHover }) {
  const unavailable = new Set(UNAVAILABLE_DATES[room?.id] || []);
  const today = new Date(); today.setHours(0,0,0,0);

  const firstDay    = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const rangeEnd = checkOut || hoverDate;

  return (
    <div className={styles.calendarMonth}>
      <div className={styles.calendarMonthTitle}>
        {MONTHS[month]} {year}
      </div>
      <div className={styles.calendarWeekdays}>
        {WEEKDAYS.map(w => (
          <div key={w} className={styles.calendarWeekday}>{w}</div>
        ))}
      </div>
      <div className={styles.calendarDays}>
        {cells.map((date, i) => {
          if (!date) return <div key={"e" + i} className={`${styles.calendarDay} ${styles.dayEmpty}`} />;

          const key     = toKey(date);
          const past    = date < today;
          const unavail = unavailable.has(key);
          const price   = room ? getPriceForDate(room, date) : null;

          const isStart = isSameDay(date, checkIn);
          const isEnd   = isSameDay(date, checkOut);
          const inRange = isBetween(date, checkIn, rangeEnd);

          let cls = styles.calendarDay;
          if (past)         cls += ` ${styles.dayPast}`;
          else if (unavail) cls += ` ${styles.dayUnavailable}`;
          else if (isStart) cls += ` ${styles.daySelected} ${styles.dayRangeStart}`;
          else if (isEnd)   cls += ` ${styles.daySelected} ${styles.dayRangeEnd}`;
          else if (inRange) cls += ` ${styles.dayInRange}`;

          return (
            <button
              key={key}
              className={cls}
              onClick={() => !past && !unavail && onDayClick(date)}
              onMouseEnter={() => !past && !unavail && onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              disabled={past || unavail}
            >
              <span>{date.getDate()}</span>
              {price && !past && !unavail && (
                <span className={styles.dayPrice}>{price}€</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  STEP INDICATOR
// ─────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  const steps = ["Zimmer wählen", "Datum wählen", "Ihre Daten"];
  return (
    <div className={styles.stepIndicator}>
      {steps.map((label, i) => {
        const num    = i + 1;
        const done   = currentStep > num;
        const active = currentStep === num;
        return (
          <div key={label} className={styles.stepItem}>
            <div className={styles.stepLeft}>
              <div className={`${styles.stepCircle} ${active ? styles.stepCircleActive : ""} ${done ? styles.stepCircleDone : ""}`}>
                {done ? "✓" : num}
              </div>
              <span className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ""} ${done ? styles.stepLabelDone : ""}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`${styles.stepLine} ${done ? styles.stepLineDone : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  BOOKING SUMMARY SIDEBAR (step 3)
// ─────────────────────────────────────────────
function BookingSummary({ room, checkIn, checkOut, nights, breakdown, total }) {
  return (
    <div className={styles.summaryBox}>
      <h3 className={styles.summaryTitle}>Buchungsübersicht</h3>

      <img src={room.image} alt={room.name} className={styles.summaryImg} />

      <div className={styles.summarySection}>
        <div className={styles.summaryLabel}>Zimmer</div>
        <div className={styles.summaryValue}>{room.name}</div>
        <ul className={styles.summaryHighlights}>
          {room.highlights.map(h => <li key={h}>{h}</li>)}
        </ul>
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.summarySection}>
        <div className={styles.summaryLabel}>Datum</div>
        <div className={styles.summaryValue}>
          {formatDateShort(checkIn)} – {formatDateShort(checkOut)}
        </div>
        <div className={styles.summaryMeta}>{nights} Nacht{nights > 1 ? "e" : ""}</div>
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.summarySection}>
        <div className={styles.summaryLabel}>Preisaufschlüsselung</div>
        <div className={styles.breakdownList}>
          {breakdown.slice(0, 5).map(n => (
            <div key={n.night} className={styles.breakdownRow}>
              <span>{n.night}. Nacht ({n.date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" })})</span>
              <span>{n.price}€</span>
            </div>
          ))}
          {breakdown.length > 5 && (
            <div className={styles.breakdownRow}>
              <span>+ {breakdown.length - 5} weitere Nächte</span>
              <span>{breakdown.slice(5).reduce((s, n) => s + n.price, 0)}€</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.summaryDivider} />

      <div className={styles.summaryTotal}>
        <span>Gesamt</span>
        <span className={styles.summaryTotalPrice}>{total}€</span>
      </div>
      <div className={styles.summaryVat}>Alle Preise inkl. Frühstück & MwSt.</div>

      <div className={styles.summaryDivider} />

      <div className={styles.trustBadge}>
        <span className={styles.trustIcon}>🕐</span>
        <div>
          <div className={styles.trustTitle}>Kostenlose Stornierung</div>
          <div className={styles.trustSub}>Bis 7 Tage vor Anreise</div>
        </div>
      </div>
      <div className={styles.trustBadge}>
        <span className={styles.trustIcon}>🔒</span>
        <div>
          <div className={styles.trustTitle}>Sichere Buchung</div>
          <div className={styles.trustSub}>Ihre Daten sind sicher bei uns</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function BookingCalendar({ onConfirm }) {
  const [step,      setStep]      = useState(1);
  const [room,      setRoom]      = useState(null);
  const [checkIn,   setCheckIn]   = useState(null);
  const [checkOut,  setCheckOut]  = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", guests: "2 Erwachsene", requests: "",
  });
  const [errors, setErrors] = useState({});

  const today = new Date(); today.setHours(0,0,0,0);
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const month2 = addMonths(viewMonth, 1);

  function handleDayClick(date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else {
      if (date <= checkIn) {
        setCheckIn(date);
        setCheckOut(null);
      } else {
        const unavail = new Set(UNAVAILABLE_DATES[room?.id] || []);
        let blocked = false;
        const cur = new Date(checkIn);
        cur.setDate(cur.getDate() + 1);
        while (cur < date) {
          if (unavail.has(toKey(cur))) { blocked = true; break; }
          cur.setDate(cur.getDate() + 1);
        }
        if (blocked) { setCheckIn(date); setCheckOut(null); }
        else { setCheckOut(date); }
      }
    }
  }

  const nights    = calcNights(checkIn, checkOut);
  const breakdown = useMemo(() => getNightlyBreakdown(room, checkIn, checkOut), [room, checkIn, checkOut]);
  const total     = useMemo(() => breakdown.reduce((s, n) => s + n.price, 0), [breakdown]);

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = "Bitte geben Sie Ihren Namen ein.";
    if (!form.email.trim()) e.email = "Bitte geben Sie Ihre E-Mail ein.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Bitte geben Sie eine gültige E-Mail ein.";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (onConfirm) onConfirm({ room, checkIn, checkOut, nights, total, guest: form });
  }

  const GUEST_OPTIONS = [
    "1 Erwachsener",
    "2 Erwachsene",
    "3 Erwachsene",
    "4 Erwachsene",
    "2 Erwachsene + 1 Kind",
    "2 Erwachsene + 2 Kinder",
  ];

  return (
    <div className={styles.bookingSection}>
      <h2 className={styles.bookingSectionTitle}>Jetzt Zimmer buchen</h2>
      <p className={styles.bookingSectionSub}>
        Wählen Sie Ihr Zimmer, Ihre Daten und senden Sie Ihre Buchungsanfrage.
      </p>

      <StepIndicator currentStep={step} />

      {/* ══════════════════════════════════
          STEP 1 — ROOM SELECTION
      ══════════════════════════════════ */}
      {step === 1 && (
        <>
          <div className={styles.roomGrid}>
            {ROOMS.map((r) => (
              <div
                key={r.id}
                className={`${styles.roomCard} ${room?.id === r.id ? styles.roomCardSelected : ""}`}
                onClick={() => setRoom(r)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setRoom(r)}
              >
                <img src={r.image} alt={r.name} className={styles.roomCardImg} />
                <div className={styles.roomCardBody}>
                  {room?.id === r.id && <span className={styles.selectedBadge}>Ausgewählt</span>}
                  <div className={styles.roomCardName}>{r.name}</div>
                  <div className={styles.roomCardDesc}>{r.description}</div>
                  <div className={styles.roomCardFooter}>
                    <div className={styles.roomCardPrice}>
                      ab {r.basePrice}€ <span className={styles.roomCardPriceSub}>/ Nacht inkl. Frühstück</span>
                    </div>
                    <div className={styles.roomCardGuests}>👤 {r.guests}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.stepActions}>
            <button className={styles.btnNext} disabled={!room} onClick={() => setStep(2)}>
              Weiter: Datum wählen →
            </button>
          </div>
        </>
      )}

      {/* ══════════════════════════════════
          STEP 2 — CALENDAR
      ══════════════════════════════════ */}
      {step === 2 && (
        <>
          <div className={styles.calendarWrapper}>
            <div className={styles.calendarHeader}>
              <button className={styles.calendarNav} onClick={() => setViewMonth(addMonths(viewMonth, -1))}>
                ←
              </button>
              <button className={styles.calendarNav} onClick={() => setViewMonth(addMonths(viewMonth, 1))}>
                →
              </button>
            </div>

            <div className={styles.calendarMonths}>
              <MonthGrid
                year={viewMonth.getFullYear()} month={viewMonth.getMonth()}
                room={room} checkIn={checkIn} checkOut={checkOut} hoverDate={hoverDate}
                onDayClick={handleDayClick} onDayHover={setHoverDate}
              />
              <MonthGrid
                year={month2.getFullYear()} month={month2.getMonth()}
                room={room} checkIn={checkIn} checkOut={checkOut} hoverDate={hoverDate}
                onDayClick={handleDayClick} onDayHover={setHoverDate}
              />
            </div>

            <div className={styles.calendarLegend}>
              <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.legendAvailable}`} />Verfügbar</div>
              <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.legendUnavailable}`} />Nicht verfügbar</div>
              <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.legendSelected}`} />An-/Abreise</div>
              <div className={styles.legendItem}><div className={`${styles.legendDot} ${styles.legendInRange}`} />Ausgewählter Zeitraum</div>
            </div>

            {checkIn && (
              <div className={styles.rangeSummary}>
                <div>
                  <div className={styles.rangeSummaryText}><strong>Anreise:</strong> {formatDate(checkIn)}</div>
                  <div className={styles.rangeSummaryText}><strong>Abreise:</strong> {formatDate(checkOut)}</div>
                  {nights > 0 && <div className={styles.rangeSummaryNights}>{nights} Nacht{nights > 1 ? "e" : ""}</div>}
                </div>
                {nights > 0 && (
                  <div>
                    <div className={styles.rangeSummaryTotal}>{total}€</div>
                    <div className={styles.rangeSummaryNights}>Gesamtpreis inkl. Frühstück</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.stepActions}>
            <button className={styles.btnBack} onClick={() => setStep(1)}>← Zimmer ändern</button>
            <button className={styles.btnNext} disabled={!checkIn || !checkOut} onClick={() => setStep(3)}>
              Weiter: Ihre Daten →
            </button>
          </div>
        </>
      )}

      {/* ══════════════════════════════════
          STEP 3 — GUEST FORM + SUMMARY
      ══════════════════════════════════ */}
      {step === 3 && (
        <>
          <div className={styles.step3Layout}>

            {/* ── LEFT: form ── */}
            <div className={styles.formCol}>

              {/* Stay bar */}
              <div className={styles.stayBar}>
                <div className={styles.stayBarItem}>
                  <div className={styles.stayBarLabel}>Anreise</div>
                  <div className={styles.stayBarValue}>📅 {formatDateShort(checkIn)}</div>
                </div>
                <div className={styles.stayBarDivider} />
                <div className={styles.stayBarItem}>
                  <div className={styles.stayBarLabel}>Abreise</div>
                  <div className={styles.stayBarValue}>📅 {formatDateShort(checkOut)}</div>
                </div>
                <div className={styles.stayBarDivider} />
                <div className={styles.stayBarItem}>
                  <div className={styles.stayBarLabel}>Nächte</div>
                  <div className={styles.stayBarValue}>🌙 {nights}</div>
                </div>
                <div className={styles.stayBarDivider} />
                <div className={styles.stayBarItem}>
                  <div className={styles.stayBarLabel}>Gäste</div>
                  <div className={styles.stayBarValue}>👤 {form.guests}</div>
                </div>
                <button className={styles.stayBarChange} onClick={() => setStep(2)}>
                  Ändern
                </button>
              </div>

              <h3 className={styles.formTitle}>Ihre Informationen</h3>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Vollständiger Name <span className={styles.required}>*</span>
                </label>
                <input
                  className={`${styles.formInput} ${errors.name ? styles.inputError : ""}`}
                  type="text"
                  placeholder="Max Mustermann"
                  value={form.name}
                  onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: ""}); }}
                />
                {errors.name && <div className={styles.errorMsg}>{errors.name}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  E-Mail-Adresse <span className={styles.required}>*</span>
                </label>
                <input
                  className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
                  type="email"
                  placeholder="max@beispiel.de"
                  value={form.email}
                  onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email: ""}); }}
                />
                {errors.email && <div className={styles.errorMsg}>{errors.email}</div>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Telefonnummer (optional)</label>
                <input
                  className={styles.formInput}
                  type="tel"
                  placeholder="+49 123 456789"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Anzahl Gäste</label>
                <select
                  className={styles.formSelect}
                  value={form.guests}
                  onChange={e => setForm({...form, guests: e.target.value})}
                >
                  {GUEST_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Besondere Wünsche (optional)</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Besondere Anfragen, Allergien, Anreisezeit..."
                  rows={4}
                  value={form.requests}
                  onChange={e => setForm({...form, requests: e.target.value})}
                />
              </div>

              <button className={styles.btnConfirm} onClick={handleSubmit}>
                Buchungsanfrage senden →
              </button>
            </div>

            {/* ── RIGHT: summary ── */}
            <div className={styles.summaryCol}>
              <BookingSummary
                room={room}
                checkIn={checkIn}
                checkOut={checkOut}
                nights={nights}
                breakdown={breakdown}
                total={total}
              />
            </div>
          </div>

          <div className={styles.stepActions}>
            <button className={styles.btnBack} onClick={() => setStep(2)}>
              ← Datum ändern
            </button>
          </div>
        </>
      )}
    </div>
  );
}