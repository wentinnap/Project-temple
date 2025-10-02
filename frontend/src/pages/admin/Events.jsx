import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import th from "date-fns/locale/th";
import "react-big-calendar/lib/css/react-big-calendar.css";
import API from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

const locales = {
  "en-US": enUS,
  th: th,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });

  // สำหรับแก้ไข
  const [editingEvent, setEditingEvent] = useState(null);

  // โหลดข้อมูลกิจกรรม
  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(
      res.data.map((ev) => ({
        id: ev.id,
        title: ev.title,
        start: new Date(ev.start_time),
        end: new Date(ev.end_time),
      }))
    );
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // เพิ่มกิจกรรม
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    await API.post("/events", newEvent);
    setNewEvent({ title: "", start: "", end: "" });
    fetchEvents();
  };

  // ลบกิจกรรม
  const handleDeleteEvent = async (id) => {
    if (window.confirm("คุณต้องการลบกิจกรรมนี้หรือไม่?")) {
      await API.delete(`/events/${id}`);
      fetchEvents();
    }
  };

  // แก้ไขกิจกรรม
  const handleEditEvent = async () => {
    if (!editingEvent.title || !editingEvent.start || !editingEvent.end) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    await API.put(`/events/${editingEvent.id}`, {
      title: editingEvent.title,
      start: editingEvent.start,
      end: editingEvent.end,
    });
    setEditingEvent(null);
    fetchEvents();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">จัดการปฏิทินกิจกรรม</h2>

        {/* ฟอร์มเพิ่มกิจกรรม */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <input
            type="text"
            placeholder="ชื่อกิจกรรม"
            className="border p-2 rounded"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          />
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          />
          <button
            onClick={handleAddEvent}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            เพิ่มกิจกรรม
          </button>
        </div>

        {/* Calendar */}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={(event) => setEditingEvent(event)} // 👉 คลิกเพื่อแก้ไข
        />

        {/* Modal แก้ไขกิจกรรม */}
        {editingEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4">แก้ไขกิจกรรม</h3>
              <input
                type="text"
                className="w-full border p-2 rounded mb-3"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
              />
              <input
                type="datetime-local"
                className="w-full border p-2 rounded mb-3"
                value={format(editingEvent.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, start: e.target.value })
                }
              />
              <input
                type="datetime-local"
                className="w-full border p-2 rounded mb-3"
                value={format(editingEvent.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, end: e.target.value })
                }
              />

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleEditEvent}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => handleDeleteEvent(editingEvent.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  ลบ
                </button>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
