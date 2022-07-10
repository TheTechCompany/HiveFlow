import React, { Component } from 'react';
import { Outlet, Route, Routes} from 'react-router-dom'
import {PeopleList} from './list';
import {PeopleSingle} from './single';

export const PeopleView = (props: any) => (
   <Routes>
      <Route path={''} element={<Outlet />}>
         <Route path={``} element={<PeopleList/>} />      
         <Route path={`/:id/*`} element={<PeopleSingle/>}/>
      </Route>
    </Routes>
);
