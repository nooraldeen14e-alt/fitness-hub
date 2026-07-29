import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ScheduleModal({ open, onClose }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = React.useState(false);

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setForm({ name: "", email: "", phone: "" });
      setSubmitted(false);
    }
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Disable going back to months fully in the past
  const canGoPrev = new Date(viewYear, viewMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const selectDate = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return;
    setSelectedDate(d);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const formatDate = (d: Date) =>
    `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-0.5">Schedule a Meeting</p>
                <h2 className="font-display font-bold text-xl text-white">
                  {step === 1 && "Pick a Date"}
                  {step === 2 && "Choose a Time"}
                  {step === 3 && "Your Details"}
                </h2>
              </div>
              {/* Step dots */}
              <div className="flex items-center gap-2">
                {[1,2,3].map(s => (
                  <div key={s} className="w-2 h-2 rounded-full transition-colors duration-300"
                    style={{ background: s <= step ? "hsl(25,100%,50%)" : "rgba(255,255,255,0.15)" }} />
                ))}
                <button onClick={onClose} className="ml-3 text-white/40 hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 1l16 16M17 1L1 17"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-7 py-6">
              {/* ── STEP 1: Calendar ── */}
              {step === 1 && (
                <div>
                  {/* Month nav */}
                  <div className="flex items-center justify-between mb-5">
                    <button
                      onClick={prevMonth}
                      disabled={!canGoPrev}
                      className="w-8 h-8 flex items-center justify-center rounded-full transition-colors disabled:opacity-20"
                      style={{ background: canGoPrev ? "rgba(255,255,255,0.07)" : "transparent" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 2L4 7l5 5"/></svg>
                    </button>
                    <span className="font-display font-bold text-white text-lg">
                      {MONTHS[viewMonth]} {viewYear}
                    </span>
                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full transition-colors" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 2l5 5-5 5"/></svg>
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 mb-2">
                    {DAYS.map(d => (
                      <div key={d} className="text-center font-mono text-[10px] uppercase text-white/30 py-1">{d}</div>
                    ))}
                  </div>

                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells before first day */}
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(viewYear, viewMonth, day);
                      const isPast = date < today;
                      const isToday = date.getTime() === today.getTime();
                      const isSel = selectedDate?.getTime() === date.getTime();
                      return (
                        <button
                          key={day}
                          onClick={() => !isPast && selectDate(day)}
                          disabled={isPast}
                          className={`aspect-square rounded-xl text-sm font-medium transition-all duration-150 flex items-center justify-center
                            ${isPast ? "text-white/15 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer"}
                            ${isToday && !isSel ? "border border-primary/50 text-primary" : ""}
                            ${isSel ? "text-black font-bold" : "text-white"}
                          `}
                          style={isSel ? { background: "hsl(25,100%,50%)" } : undefined}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-center font-mono text-[10px] text-white/20 uppercase tracking-widest mt-5">
                    Select a date to continue
                  </p>
                </div>
              )}

              {/* ── STEP 2: Time slots ── */}
              {step === 2 && (
                <div>
                  <p className="font-sans text-white/50 text-sm mb-5">
                    {selectedDate && formatDate(selectedDate)}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        onClick={() => { setSelectedTime(t); setStep(3); }}
                        className="py-3 rounded-xl border text-sm font-mono uppercase tracking-wide transition-all duration-150 hover:scale-105"
                        style={{
                          borderColor: selectedTime === t ? "hsl(25,100%,50%)" : "rgba(255,255,255,0.12)",
                          background: selectedTime === t ? "hsl(25,100%,50%)" : "rgba(255,255,255,0.04)",
                          color: selectedTime === t ? "#000" : "#fff",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="mt-6 font-mono text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 1L3 6l5 5"/></svg>
                    Back
                  </button>
                </div>
              )}

              {/* ── STEP 3: Details ── */}
              {step === 3 && (
                <div>
                  {submitted ? (
                    <div className="py-8 text-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(25,100%,50%)" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                      </div>
                      <h3 className="font-display font-bold text-2xl text-white mb-2">You're Booked!</h3>
                      <p className="font-sans text-white/50 text-sm">
                        {selectedDate && formatDate(selectedDate)} at {selectedTime}
                      </p>
                      <p className="font-sans text-white/30 text-xs mt-1">We'll confirm via email shortly.</p>
                      <button onClick={onClose} className="mt-6 px-8 py-2.5 rounded-full text-white text-sm font-semibold" style={{ background: "hsl(25,100%,50%)" }}>
                        Done
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Summary pill */}
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 text-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        <span className="text-white/70">{selectedDate && formatDate(selectedDate)}</span>
                        <span className="text-white/30">·</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <span className="text-white/70">{selectedTime}</span>
                      </div>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {[
                          { key: "name",  label: "Full Name",    type: "text",  placeholder: "Your name" },
                          { key: "email", label: "Email",         type: "email", placeholder: "your@email.com" },
                          { key: "phone", label: "Phone Number",  type: "tel",   placeholder: "+971 XX XXX XXXX" },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-1.5 block">{f.label}</label>
                            <input
                              type={f.type}
                              placeholder={f.placeholder}
                              value={form[f.key as keyof typeof form]}
                              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        ))}
                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl font-mono text-sm uppercase tracking-widest text-black font-bold mt-1 hover:opacity-90 transition-opacity"
                          style={{ background: "hsl(25,100%,50%)" }}
                        >
                          Confirm Booking
                        </button>
                      </form>
                      <button onClick={() => setStep(2)} className="mt-4 font-mono text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 1L3 6l5 5"/></svg>
                        Back
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
