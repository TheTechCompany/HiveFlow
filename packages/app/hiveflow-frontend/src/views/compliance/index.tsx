import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { ComplianceList } from './list';
import { ComplianceSingle } from './single';

export const ComplianceView = () => {
  return (
    <Routes>
      <Route path="" element={<Outlet />}>
        <Route path="" element={<ComplianceList />} />
        <Route path=":id" element={<ComplianceSingle />} />
      </Route>
    </Routes>
  );
};
