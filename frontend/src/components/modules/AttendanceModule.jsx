import React, { useState } from "react";
import { CheckCircle, Clock, XCircle, Home, LogIn, LogOut, ChevronLeft, ChevronRight, Trash2, RotateCcw } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { Pill } from "../common/Pill";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function AttendanceModule({ role, employees }) {
  const isManagerOrAdmin = role === "Admin" || role === "Manager";

  const todayDateObj = new Date();
  const todayISO = todayDateObj.toISOString().slice(0, 10);
  const todayFormattedString = todayDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const todayDayNum = todayDateObj.getDate();
  const todayMonthIndex = todayDateObj.getMonth();
  const todayYearNum = todayDateObj.getFullYear();

  const [currentYear, setCurrentYear] = useState(todayYearNum);
  const [currentMonth, setCurrentMonth] = useState(todayMonthIndex);

  const [checkedIn, setCheckedIn] = useState(() => {
    try {
      const saved = localStorage.getItem(`peoplepulse_checkin_${todayISO}`);
      return saved ? JSON.parse(saved).checkedIn : false;
    } catch (e) {
      return false;
    }
  });

  const [checkInTime, setCheckInTime] = useState(() => {
    try {
      const saved = localStorage.getItem(`peoplepulse_checkin_${todayISO}`);
      return saved ? JSON.parse(saved).checkInTime : null;
    } catch (e) {
      return null;
    }
  });

  const [checkOutTime, setCheckOutTime] = useState(() => {
    try {
      const saved = localStorage.getItem(`peoplepulse_checkin_${todayISO}`);
      return saved ? JSON.parse(saved).checkOutTime : null;
    } catch (e) {
      return null;
    }
  });

  const [todayMarked, setTodayMarked] = useState(() => {
    try {
      const saved = localStorage.getItem(`peoplepulse_attendance_marked_${todayISO}`);
      return saved ? true : false;
    } catch (e) {
      return false;
    }
  });

  const handleCheckIn = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCheckInTime(timeStr);
    setCheckedIn(true);
    try {
      localStorage.setItem(`peoplepulse_checkin_${todayISO}`, JSON.stringify({ checkedIn: true, checkInTime: timeStr }));
    } catch (e) {}
  };

  const handleCheckOut = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCheckOutTime(timeStr);
    setCheckedIn(false);
    setTodayMarked(true);
    try {
      localStorage.setItem(`peoplepulse_checkin_${todayISO}`, JSON.stringify({ checkedIn: false, checkInTime, checkOutTime: timeStr }));
      localStorage.setItem(`peoplepulse_attendance_marked_${todayISO}`, JSON.stringify({ marked: true, date: todayISO }));
    } catch (e) {}
  };

  const handleDeleteAttendance = () => {
    if (!isManagerOrAdmin) return;
    try {
      localStorage.removeItem(`peoplepulse_checkin_${todayISO}`);
      localStorage.removeItem(`peoplepulse_attendance_marked_${todayISO}`);
    } catch (e) {}
    setCheckedIn(false);
    setCheckInTime(null);
    setCheckOutTime(null);
    setTodayMarked(false);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    let status = null;

    if (currentYear < todayYearNum || (currentYear === todayYearNum && currentMonth < todayMonthIndex)) {
      status = (day % 7 === 0 || day % 7 === 6) ? "H" : (day % 5 === 0 ? "WFH" : "P");
    } else if (currentYear === todayYearNum && currentMonth === todayMonthIndex) {
      if (day < todayDayNum) {
        status = (day % 7 === 0 || day % 7 === 6) ? "H" : (day % 5 === 0 ? "WFH" : "P");
      } else if (day === todayDayNum) {
        status = todayMarked ? "P" : (checkedIn ? "P" : null);
      } else {
        status = null;
      }
    } else {
      status = null;
    }

    calendarCells.push({ day, status });
  }

  const getStatusBadge = (st) => {
    if (st === "P") return { label: "Present", color: "#2F8F82" };
    if (st === "WFH") return { label: "WFH", color: "#6C6FB0" };
    if (st === "L") return { label: "Leave", color: "#E2604F" };
    if (st === "H") return { label: "Holiday", color: "#E8A33D" };
    if (st === "A") return { label: "Absent", color: "#EF4444" };
    return null;
  };

  return (
    <>
      <SectionTitle title="Attendance Calendar" />

      <Card style={{ marginBottom: 24, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 className="nf-h3" style={{ margin: 0, fontSize: 18 }}>Daily Work Punch</h3>
            <div style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 4 }}>
              Today: <span style={{ fontWeight: 600, color: "var(--ink)" }}>{todayFormattedString}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {checkInTime && (
              <div style={{ fontSize: 12.5, textAlign: "right" }}>
                <div style={{ color: "var(--ink-dim)" }}>In: <span style={{ fontWeight: 700, color: "#2F8F82" }}>{checkInTime}</span></div>
                {checkOutTime && <div style={{ color: "var(--ink-dim)" }}>Out: <span style={{ fontWeight: 700, color: "#E8A33D" }}>{checkOutTime}</span></div>}
              </div>
            )}

            {!checkedIn && !todayMarked && (
              <button className="nf-btn primary" onClick={handleCheckIn} style={{ padding: "10px 20px" }}>
                <LogIn size={16} /> Check In
              </button>
            )}

            {checkedIn && (
              <button className="nf-btn warning" onClick={handleCheckOut} style={{ padding: "10px 20px" }}>
                <LogOut size={16} /> Check Out &amp; Mark Attendance
              </button>
            )}

            {todayMarked && (
              <Pill tone="good" style={{ padding: "8px 14px", fontSize: 13 }}>
                <CheckCircle size={14} /> Attendance Marked &amp; Locked For Today
              </Pill>
            )}

            {isManagerOrAdmin && (todayMarked || checkedIn || checkInTime) && (
              <button
                className="nf-btn ghost"
                style={{ color: "#E2604F", border: "1px solid #E2604F44", padding: "8px 12px" }}
                title="Delete false attendance record"
                onClick={handleDeleteAttendance}
              >
                <Trash2 size={15} /> Delete Attendance
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 className="nf-h3" style={{ margin: 0, fontSize: 18 }}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            {currentYear === todayYearNum && currentMonth === todayMonthIndex && (
              <Pill tone="good" style={{ fontSize: 11 }}>Current Month</Pill>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="nf-btn ghost sm" onClick={handlePrevMonth}>
              <ChevronLeft size={16} /> Previous Month
            </button>

            <button
              className="nf-btn ghost sm"
              onClick={() => {
                setCurrentMonth(todayMonthIndex);
                setCurrentYear(todayYearNum);
              }}
            >
              Today
            </button>

            <button className="nf-btn ghost sm" onClick={handleNextMonth}>
              Next Month <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="nf-grid-7" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
            <div key={dayName} style={{ textAlign: "center", fontWeight: 700, fontSize: 12, color: "var(--ink-dim)", padding: "6px 0" }}>
              {dayName}
            </div>
          ))}

          {calendarCells.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} style={{ minHeight: 64, background: "transparent" }} />;
            }

            const badge = getStatusBadge(cell.status);
            const isToday = currentYear === todayYearNum && currentMonth === todayMonthIndex && cell.day === todayDayNum;

            return (
              <div
                key={`day-${cell.day}`}
                style={{
                  minHeight: 68,
                  padding: 8,
                  borderRadius: 10,
                  background: isToday ? "var(--surface-alt)" : "var(--surface)",
                  border: isToday ? "2px solid var(--accent)" : "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: isToday ? 700 : 500, fontSize: 13, color: isToday ? "var(--accent)" : "var(--ink)" }}>
                    {cell.day}
                  </span>
                  {isToday && <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>TODAY</span>}
                </div>

                {badge ? (
                  <div style={{ marginTop: 8 }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: 6,
                        background: `${badge.color}22`,
                        color: badge.color,
                        display: "inline-block",
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>
                ) : (
                  <div style={{ marginTop: 8, fontSize: 10, color: "var(--ink-dim)", fontStyle: "italic" }}>
                    —
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
