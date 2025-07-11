import React, { Component, useState} from 'react';

import { Link, Route , generatePath, matchPath, Routes, useNavigate, useResolvedPath} from 'react-router-dom';

import logo from '../../logo.svg';

//views, logo
import { Sidebar, SidebarView} from '@hexhive/ui';

// import RoutedView from '../../components/primatives/routed-view';

import {
  Calendar as Schedule,
  People,
  Timeline as TimelineIcon,
  Estimates,
  Projects,
  Equipment,
  Hiveflow,
  Assigned
} from '../../assets'

import { Box } from '@mui/material'

import { ProjectList } from '../projects/list';
import { ProjectSingle } from '../projects/single';
import { PeopleList } from '../people/list';
import {Schedule as ScheduleView } from '../schedule';
import {PeopleSingle} from '../people/single';
import { EquipmentList } from '../equipment/list';
import {EstimateView} from '../estimates';

import Timeline from '../timeline/Timeline'
import { ProjectView } from '../projects';
import { PeopleView } from '../people';
import { Assignments } from '../assignments';

// const Schedule = React.lazy(() => import('../schedule'))
// const Quotes = React.lazy(() => import('../quotes'))
// const Jobs = React.lazy(() => import('../jobs'))
// const Employees = React.lazy(() => import('../staff'))
// // const MonthView = React.lazy(() => import('../../components/workhub/planning-calendar'))
// const Plant = React.lazy(() => import('../plant'))


export const Dashboard = (props: any) => { 

  //  const [ view, setView ] = React.useState('schedule')
  // const [ alerts, setAlerts ] = useState<string[]>([])

  const alerts = []
  const active = window.location.pathname.replace(process.env.PUBLIC_URL || '', '')

  
  const path = useResolvedPath(active);
  console.log({active, path})

  const navigate = useNavigate()

  const views = () => {
    let login_type =  'email' //props.user.login_type;
    let views = []
    // if(login_type == 'email'){
      views = [{
                  icon: <Schedule filter="invert(1)" />,
                  label: "Schedule",
                  path: "schedule",
                  component: <> </>,
                },
                {
                  icon: <TimelineIcon filter="invert(1)" />,
                  label: "Timeline",
                  path: "timeline",
                  component: <></>
                },
                {
                  icon: <Estimates filter="invert(1)" />,
                  label: "Estimates",
                  path: "estimates",
                  component: <></>,
                },
                {
                  icon: <Projects filter="invert(1)" />,
                  label: "Projects",
                  path: "projects",
                  component: <></>
                },
                {
                  icon: <People filter="invert(1)" />,
                  label: "People",
                  path: "people",
                  component: <></>
                }, 
                { 
                  icon: <Equipment filter="invert(1)" />,
                  label: "Equipment",
                  path: "equipment",
                  alerts: alerts.length,
                  component: <></>
                },
                {
                  label: "Reports",
                  path: "reports",
                  component: <></>
                }
      ]
    
    // else{
    //   views = [
    //       {
    //         icon: "schedule",
    //         label: "Schedule",
    //         path: "schedule",
    //         component: <></>,
    //       },
    //       {
    //         icon: 'check_circle_outline',
    //         label: "Projects",
    //         path: "projects",
    //         component: <></>
    //       },
    //       {
    //         icon: 'people',
    //         label: "People",
    //         path: "people",
    //         component: <></>
    //       }, 
    //       { 
    //         icon: 'directions_car',
    //         label: "Equipment",
    //         alerts: alerts.length,
    //         path: "equipment",
    //         component: <></>
    //       }

    //   ]
    // }
    return views;
  }


  // componentDidMount(){

  //   utils.plant.getAll().then((plants) => {
  //     console.log(plants)
  //     if(!plants.error){
  //       this.setState({
  //         alerts: (plants || []).filter((a) => utils.plant.getStatus(a.details) != "VALID"),
  //       })
  //     }
  //   })
  //     //Using testauth instead of actual route, change when
  //     //there is dashboard information for organizations
  //  }
      
  const menu = [
    {
      path: 'assignments',
      label: "Assignments",
      icon: <Assigned filter="invert(1)" />,
      component: <Assignments />
    },
    {
      path: '',
      label: 'Schedule',
      icon: <Schedule filter="invert(1)" />,
      component: <ScheduleView />
    },
    {
      path: 'timeline',
      label: 'Timeline',
      icon: <TimelineIcon filter="invert(1)" />,
      component: <Timeline />
    },
    {
      path: 'estimates',
      label: 'Estimates',
      icon: <Estimates filter="invert(1)" />,
      component: <EstimateView />
    },
    {
      path: 'projects',
      label: 'Projects',
      icon: <Projects filter="invert(1)" />,
      component: <ProjectView />
    },
    {
      path: 'people',
      label: "People",
      icon: <People filter="invert(1)"/>,
      component: <PeopleView />
    },
    {
      path: 'equipment',
      label: 'Equipment',
      icon: <Equipment filter="invert(1)" />,
      component: <EquipmentList />
    }
  ]
      return (

         <Box 
          sx={{flex: 1, display: 'flex', color: 'white', bgcolor: 'primary.dark', height: '100%'}}
          className="dashboard">
            <SidebarView
              views={menu}
                />
              {/* <Sidebar
                active={'schedule' /*active /*views()?.[views().map((x) => matchPath(active, x.path) != null ).indexOf(true)]?.path || '/'}
                menu={views()} 
                onSelect={(x: any) => {
                  // let path = generatePath(`/:path`, {path: x.path.toLowerCase()})

                  navigate(`/${x.path.toLowerCase()}`)
                }}/>

            <Box 
              background="neutral-4"
              flex 
              pad="xsmall">
            <React.Suspense fallback={(
              <Box 
                align="center"
                justify="center"
                flex>
                <Spinner size="medium" />
                <Text>Loading ...</Text>
              </Box>
            )}>
              <Routes>
                <Route path={`schedule`} element={<ScheduleView/>} />
                <Route path={`projects`} element={<ProjectList/>} >

                </Route>
                <Route path={`projects/:id`} element={<ProjectSingle/>} />

                <Route path={`estimates`} element={<Quotes/>} />
                <Route path={`people`} element={<PeopleList/>}>
                </Route>
                <Route path={`people/:id`} element={<PeopleSingle/>} />

                <Route path={`equipment`} element={<EquipmentList/>} />
                <Route path={`timeline`} element={<Timeline/>} />
              </Routes>
            </React.Suspense>
            </Box> */}
                {/*<div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px'}}>
               <UserIcon style={{fontSize: '30px', cursor: 'pointer'}} onClick={() => {this.props.history.push('/admin')}}/>
                </div>*/}

 
         </Box>
      );
  
}

/*
<RoutedView 
                views={views()} />
*/

// export default connect((state) => {
//   let token = state.auth.token;
//   if(token){
//     return {user: jwtDecode(token)}
//   }else{
//     return {user: {}}
//   }
// }, (dispatch) => ({

// }))(App);
