import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Overview from '@/pages/Overview';
import Bookings from '@/pages/Bookings';
import EventTypes from '@/pages/EventTypes';
import Availability from '@/pages/Availability';
import Members from '@/pages/Members';
import Insights from '@/pages/Insights';
import Settings from '@/pages/Settings';
import Components from '@/pages/Components';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/event-types" element={<EventTypes />} />
      <Route path="/availability" element={<Availability />} />
      <Route path="/members" element={<Members />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/components" element={<Components />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
