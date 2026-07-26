import React, { useState, useEffect } from "react";
import { DoorOpen, Clock, Plus, CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { Card } from "../common/Card";
import { SectionTitle } from "../common/SectionTitle";
import { Pill } from "../common/Pill";

const INITIAL_ROOMS = [
  { id: 1, name: "Orion Executive Boardroom", capacity: 16, location: "Floor 4 - HQ", status: "Available", features: "4K Display, VC Camera, Whiteboard" },
  { id: 2, name: "Apollo Innovation Lab", capacity: 8, location: "Floor 3 - HQ", status: "Booked", features: "TV Display, Smart Board" },
  { id: 3, name: "Zeus Conference Suite", capacity: 12, location: "Floor 4 - HQ", status: "Available", features: "Dual Screens, Podcast Mic" },
  { id: 4, name: "Hermes Sync Room", capacity: 4, location: "Floor 2 - HQ", status: "Available", features: "TV Display, Glass Wall" },
];

const INITIAL_BOOKINGS = [
  { id: "b1", room: "Apollo Innovation Lab", time: "02:00 PM - 03:00 PM", bookedBy: "Rahul Sharma", title: "Q3 Sprint Planning" },
  { id: "b2", room: "Orion Executive Boardroom", time: "04:30 PM - 05:30 PM", bookedBy: "Priya Nair", title: "Townhall Prep" },
];

function generate24HourSlots() {
  const slots = [];
  const hours = [
    "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM",
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"
  ];
  for (let i = 0; i < hours.length - 1; i++) {
    slots.push(`${hours[i]} - ${hours[i + 1]}`);
  }
  return slots;
}

const TIME_SLOTS_24H = generate24HourSlots();

export function MeetingRoomsModule({ employees }) {
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_rooms");
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_rooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("peoplepulse_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const [showReserveModal, setShowReserveModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [notification, setNotification] = useState(null);

  const [reserveForm, setReserveForm] = useState({
    room: "Orion Executive Boardroom",
    title: "",
    time: "03:00 PM - 04:00 PM",
    bookedBy: employees && employees.length > 0 ? employees[1].name : "Vanshika Tripathi",
  });

  const [editRoomForm, setEditRoomForm] = useState({
    name: "",
    capacity: 8,
    location: "",
    features: "",
    status: "Available",
  });

  const handleBookRoom = (e) => {
    e.preventDefault();
    if (!reserveForm.title.trim() || !reserveForm.room.trim()) return;

    const customRoomName = reserveForm.room.trim();
    const newBooking = {
      id: `b${Date.now()}`,
      room: customRoomName,
      time: reserveForm.time,
      bookedBy: reserveForm.bookedBy,
      title: reserveForm.title,
    };

    const roomExists = rooms.some((r) => r.name.toLowerCase() === customRoomName.toLowerCase());
    if (!roomExists) {
      const newRoomObj = {
        id: Date.now(),
        name: customRoomName,
        capacity: 10,
        location: "Floor 3 - HQ",
        status: "Booked",
        features: "4K Display, Smart TV, Whiteboard",
      };
      setRooms([newRoomObj, ...rooms]);
    } else {
      setRooms(rooms.map((r) => r.name.toLowerCase() === customRoomName.toLowerCase() ? { ...r, status: "Booked" } : r));
    }

    setShowReserveModal(false);
    setNotification(`Successfully reserved ${customRoomName} for ${reserveForm.title}!`);
    setReserveForm({
      room: "Orion Executive Boardroom",
      title: "",
      time: "03:00 PM - 04:00 PM",
      bookedBy: employees && employees.length > 0 ? employees[1].name : "Vanshika Tripathi",
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenEditRoom = (room) => {
    setEditingRoom(room);
    setEditRoomForm({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      features: room.features,
      status: room.status,
    });
  };

  const handleSaveEditRoom = (e) => {
    e.preventDefault();
    if (!editingRoom) return;

    const updated = rooms.map((r) => {
      if (r.id === editingRoom.id) {
        return { ...r, ...editRoomForm, capacity: Number(editRoomForm.capacity) };
      }
      return r;
    });

    setRooms(updated);
    setEditingRoom(null);
    setNotification(`Updated room details for "${editRoomForm.name}"!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteRoom = (id, name) => {
    setRooms(rooms.filter((r) => r.id !== id));
    setNotification(`Deleted meeting room "${name}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteBooking = (id, title) => {
    setBookings(bookings.filter((b) => b.id !== id));
    setNotification(`Cancelled booking "${title}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <SectionTitle
        eyebrow="Facilities"
        title="Meeting Room Reservation"
        action={
          <button className="nf-btn primary" onClick={() => setShowReserveModal(true)}>
            <Plus size={14} /> Reserve Room
          </button>
        }
      />

      {notification && (
        <div style={{ background: "#2F8F8222", border: "1px solid #2F8F82", padding: "10px 16px", borderRadius: 10, color: "#2F8F82", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {showReserveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Book Conference Room</h3>
            <form onSubmit={handleBookRoom} className="nf-form">
              <label>Room Name (Type custom or select)
                <input
                  type="text"
                  list="room-suggestions"
                  className="nf-select"
                  placeholder="e.g. Orion Executive Boardroom or Type Custom Room..."
                  value={reserveForm.room}
                  onChange={(e) => setReserveForm({ ...reserveForm, room: e.target.value })}
                  required
                />
                <datalist id="room-suggestions">
                  {rooms.map((r) => (
                    <option key={r.id} value={r.name} />
                  ))}
                </datalist>
              </label>

              <label>Meeting Title / Purpose
                <input className="nf-select" placeholder="e.g. Design Review Sync" value={reserveForm.title} onChange={(e) => setReserveForm({ ...reserveForm, title: e.target.value })} required />
              </label>

              <label>Time Slot (24-Hour Schedule)
                <select className="nf-select" value={reserveForm.time} onChange={(e) => setReserveForm({ ...reserveForm, time: e.target.value })}>
                  {TIME_SLOTS_24H.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </label>

              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setShowReserveModal(false)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Confirm Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingRoom && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="nf-card" style={{ maxWidth: 440, width: "100%", margin: "auto", background: "var(--surface)" }}>
            <h3 className="nf-h3" style={{ marginBottom: 14 }}>Edit Meeting Room Details</h3>
            <form onSubmit={handleSaveEditRoom} className="nf-form">
              <label>Room Name
                <input className="nf-select" value={editRoomForm.name} onChange={(e) => setEditRoomForm({ ...editRoomForm, name: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Capacity (Seats)
                  <input type="number" min="1" className="nf-select" value={editRoomForm.capacity} onChange={(e) => setEditRoomForm({ ...editRoomForm, capacity: e.target.value })} required />
                </label>
                <label style={{ flex: 1 }}>Status
                  <select className="nf-select" value={editRoomForm.status} onChange={(e) => setEditRoomForm({ ...editRoomForm, status: e.target.value })}>
                    <option>Available</option>
                    <option>Booked</option>
                    <option>Under Maintenance</option>
                  </select>
                </label>
              </div>
              <label>Location / Floor
                <input className="nf-select" value={editRoomForm.location} onChange={(e) => setEditRoomForm({ ...editRoomForm, location: e.target.value })} required />
              </label>
              <label>Features &amp; Equipment
                <input className="nf-select" value={editRoomForm.features} onChange={(e) => setEditRoomForm({ ...editRoomForm, features: e.target.value })} required />
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button type="button" className="nf-btn ghost" onClick={() => setEditingRoom(null)}>Cancel</button>
                <button type="submit" className="nf-btn primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="nf-grid-2" style={{ marginBottom: 20 }}>
        {rooms.map((r) => (
          <Card key={r.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="nf-avatar" style={{ background: "#E8A33D26", color: "#E8A33D" }}>
                  <DoorOpen size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{r.location} · {r.capacity} Seats</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Pill tone={r.status === "Available" ? "good" : "warn"}>{r.status}</Pill>
                <button className="nf-btn ghost sm" onClick={() => handleOpenEditRoom(r)}>
                  <Edit3 size={13} />
                </button>
                <button className="nf-btn ghost sm danger" onClick={() => handleDeleteRoom(r.id, r.name)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-dim)", marginTop: 12 }}>
              Equipped with: {r.features}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="nf-h3">Today's Room Bookings ({bookings.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          {bookings.map((b) => (
            <div key={b.id} className="nf-leave-item" style={{ alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{b.room} · {b.time}</div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink-dim)" }}>
                  Reserved by {b.bookedBy}
                </div>
                <button className="nf-btn ghost sm danger" onClick={() => handleDeleteBooking(b.id, b.title)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
