import React from 'react';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';
import { BatchList } from './list';
import { BatchSingle } from './single';

export const BatchView = () => {
    const { id: projectId } = useParams();

    return (
        <Routes>
            <Route path="" element={<Outlet />}>
                <Route path="" element={<BatchList projectId={projectId} />} />
                <Route path=":id" element={<BatchSingle />} />
            </Route>
        </Routes>
    );
};
