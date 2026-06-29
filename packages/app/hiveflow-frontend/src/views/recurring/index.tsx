import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { ScheduleList } from './list';
import { ScheduleSingle } from './single';

export const RecurringView = () => {
  return (
    <Routes>
      <Route path="" element={<Outlet />}>
        <Route path="" element={<ScheduleList />} />
        <Route path=":id" element={<ScheduleSingle />} />
      </Route>
    </Routes>
  );
};
