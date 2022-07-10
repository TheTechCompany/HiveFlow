import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { ProjectList } from './list';
import { ProjectSingle } from './single';

export const ProjectView = () => {
    return (
        <Routes>
            <Route path={''} element={<Outlet />} >
                <Route path={''} element={<ProjectList />} />
                <Route path={'/:id/*'} element={<ProjectSingle />} />
            </Route>
        </Routes>
    )
}