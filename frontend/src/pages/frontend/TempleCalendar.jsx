import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users } from 'lucide-react';
import LayoutHome from "../../layouts/frontend";

const TempleEventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Sample temple events data
  const events = {
    '2024-01-15': [
      {
        id: 1,
        title: 'พิธีทำบุญตักบาตร',
        time: '06:00 - 07:30',
        type: 'daily',
        participants: 'ทุกท่าน',
        location: 'หน้าอุโบสถ'
      }
    ],
    '2024-01-20': [
      {
        id: 2,
        title: 'พิธีสวดมนต์เย็น',
        time: '17:00 - 18:30',
        type: 'religious',
        participants: 'ทุกท่าน',
        location: 'อุโบสถ'
      }
    ],
    '2024-01-25': [
      {
        id: 3,
        title: 'บรรพชาอุปสมบท',
        time: '08:00 - 12:00',
        type: 'ceremony',
        participants: 'ญาติโยมผู้มีจิตศรัทธา',
        location: 'อุโบสถ'
      }
    ],
    '2024-02-01': [
      {
        id: 4,
        title: 'วันพระ - พิธีสวดมนต์พิเศษ',
        time: '08:00 - 10:00',
        type: 'special',
        participants: 'ทุกท่าน',
        location: 'อุโบสถ'
      },
      {
        id: 5,
        title: 'การบริจาคอาหารกลางวัน',
        time: '11:00 - 13:00',
        type: 'donation',
        participants: 'ญาติโยมทั่วไป',
        location: 'ศาลาการเปรียญ'
      }
    ]
  };

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      daily: 'bg-green-100 text-green-800 border-green-200',
      religious: 'bg-blue-100 text-blue-800 border-blue-200',
      ceremony: 'bg-purple-100 text-purple-800 border-purple-200',
      special: 'bg-orange-100 text-orange-800 border-orange-200',
      donation: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const days = getDaysInMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  return (
    <LayoutHome fullWidth>
    <section className="relative w-full">
  <div className="absolute inset-0">
    <img
      src="/src/assets/heroabout.png" 
      alt="วัดกำแพง"
      className="w-full h-[500px] object-cover"
    />
    <div className="absolute inset-0 bg-black/60"></div> {/* overlay */}
  </div>
  <div className="relative z-10 flex items-center justify-center h-[500px] text-center text-white">
    <div>
      <h1 className="text-4xl font-bold mb-4 text-orange-400">ปฎิทินกิจกรรมวัดกำแพง</h1>
      <p className="text-lg">ศูนย์รวมจิตใจ สืบสานพระพุทธศาสนา และวัฒนธรรมไทย</p>
    </div>
  </div>
  </section>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <h2 className="text-2xl font-bold">
                    {monthNames[month]} {year + 543}
                  </h2>
                  
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Calendar Body */}
              <div className="p-6">
                {/* Day Names */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (!day) return <div key={index} className="h-24"></div>;
                    
                    const dateKey = formatDateKey(year, month, day);
                    const dayEvents = events[dateKey] || [];
                    const hasEvents = dayEvents.length > 0;
                    
                    return (
                      <div
                        key={day}
                        className={`h-24 p-2 border border-gray-100 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          hasEvents ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedDate(hasEvents ? dateKey : null)}
                      >
                        <div className="font-semibold text-gray-700 mb-1">{day}</div>
                        {hasEvents && (
                          <div className="text-xs">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mb-1"></div>
                            <div className="text-orange-600 truncate">
                              {dayEvents[0].title}
                            </div>
                            {dayEvents.length > 1 && (
                              <div className="text-gray-500">+{dayEvents.length - 1} เพิ่มเติม</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            {selectedDate && events[selectedDate] && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    กิจกรรมวันที่ {new Date(selectedDate).getDate()}
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {events[selectedDate].map((event) => (
                    <div key={event.id} className={`p-4 rounded-lg border-2 ${getEventTypeColor(event.type)}`}>
                      <h4 className="font-bold mb-2">{event.title}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.participants}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                <h3 className="text-xl font-bold">กิจกรรมที่จะมาถึง</h3>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(events)
                  .slice(0, 3)
                  .map(([date, dayEvents]) => (
                    dayEvents.map(event => (
                      <div key={event.id} className="border-l-4 border-orange-500 pl-4 py-2">
                        <div className="font-semibold text-gray-800">{event.title}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(date).getDate()} {monthNames[new Date(date).getMonth()]} • {event.time}
                        </div>
                      </div>
                    ))
                  ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h4 className="font-bold text-gray-800 mb-3">ประเภทกิจกรรม</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>กิจกรรมประจำวัน</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>พิธีกรรมทางศาสนา</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>พิธีสำคัญ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>วันพระ/งานพิเศษ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>การบริจาค/ทำบุญ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </LayoutHome>
  );
};

export default TempleEventCalendar;