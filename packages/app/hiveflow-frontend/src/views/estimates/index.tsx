import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { EstimateList } from './list';
import { EstimateSingle } from './single';

export const EstimateView = () => {
    return (
        <Routes>
            <Route path="" element={<Outlet />} >
                <Route path="" element={<EstimateList />} />
                <Route path=":id" element={<EstimateSingle />} />
            </Route>
        </Routes>
    )
}