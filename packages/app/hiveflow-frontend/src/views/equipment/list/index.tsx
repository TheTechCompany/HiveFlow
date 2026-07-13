import React, {
  Component, useState
} from 'react';


// import utils from '../../../utils';
import moment from 'moment';
import { DataTable } from '@hive-flow/ui'
import { PlantHeader } from './header';
import { useMutation, useQuery } from '@apollo/client';
import { GET_EQUIPMENT, CREATE_EQUIPMENT, UPDATE_EQUIPMENT, DELETE_EQUIPMENT } from '@hive-flow/api';
import { useTypeConfiguration } from '../../../context';
import { Equipment, EquipmentModal } from '../../../modals/equipment';
import { Box, Paper } from '@mui/material'

export const EquipmentList: React.FC<any> = (props) => {

  const configuration = useTypeConfiguration('Equipment')

  const [ modalOpen, openModal ] = useState(false);
  const [ selected, setSelected ] = useState<Equipment>()

  const [search, setSearch] = useState<string>('');

  const listKeys = [
    { property: 'displayId', header: 'ID', size: 'xsmall', sortable: true },
    { property: 'name', header: 'Name', size: 'large', sortable: true },
    { property: 'registration', header: 'Registration', size: 'medium', sortable: true },
    { property: 'status', header: 'Status', size: 'small', sortable: true },
  ]

  const { data } = useQuery(GET_EQUIPMENT, { fetchPolicy: 'cache-and-network' });


  const [ direction, setDirection ] = useState<"asc" | "desc" | undefined>('desc')
  const [ property, setProperty ] = useState<string>('displayId')


  const sortEquipment = (left: any, right: any) => {
    if(property && direction){
      return direction == 'asc' ?
        left[property].localeCompare(right[property], undefined, {numeric: true}) :
        right[property].localeCompare(left[property], undefined, {numeric: true})
    }else{
      return 0;
    }
  }

  const filterEquipment = (item: any) => {

    if (search.length > 0) {
        let name = item?.name?.toLowerCase() || ''
        let registration = item?.registration?.toLowerCase() || ''
        let id = `${item?.displayId}`.toLowerCase() || ''

        let _search = search.toLowerCase() || ''


        return registration.indexOf(_search) > -1 || name?.indexOf(_search) > -1 || id?.indexOf(_search) > -1 || `${id} ${name}`.indexOf(_search) > -1
    }

    return true;

   // return items.map((x) => ({...x, price: formatter.format(x.price)}))
  }

  const listData = (data as any)?.equipment || [];

  const [ createEquipment ] = useMutation(CREATE_EQUIPMENT, { refetchQueries: ['GetEquipment'] })

  const [ updateEquipment ] = useMutation(UPDATE_EQUIPMENT, { refetchQueries: ['GetEquipment'] })

  const [ deleteEquipment ] = useMutation(DELETE_EQUIPMENT, { refetchQueries: ['GetEquipment'] })

  // constructor(props: any){
  //   super(props);
  //   this.state = {
  //     alerts: [],
  //     emergencyAlerts: [],
  //     listKeys: ,
  //     listData: []
  //   }
  // }

  const statusColor = (details: any) => {
    if (details) {
      // let status = utils.plant.getStatus(details);

      // switch(status){
      //   case 'VALID':
      //     return null;
      //   case 'EXPIRING':
      //     return 'rgba(255, 121, 0, 1)';
      //   case 'EXPIRED':
      //     return 'rgba(255, 0, 0, 1)';
      //   default:
      //     return null;
      // }
    }
  }

  // componentDidMount(){
  // utils.plant.getAll().then((plants) => {
  //   this.setState({
  //     emergencyAlerts: plants.filter((a) => utils.plant.getStatus(a.details) == "EXPIRED"),
  //     alerts: plants.filter((a) => utils.plant.getStatus(a.details) == "EXPIRING"),
  //     listData: plants.map((x) => ({
  //       ...x,
  //       VehicleType: x.details ? x.details.vehicleType : '',
  //       colour: this.statusColor(x.details),
  //       status: utils.plant.getStatus(x.details)
  //   }))})
  // })
  // }

  // _selectPlant(p: any){
  // if(p.Registration){
  //   this.props.history.push(`/dashboard/plant/${p.Registration}`)
  // }
  // }

  const selectPlant = (item: any) => {

  }
  return (
    <Box
      sx={{flex: 1, display: 'flex', flexDirection: 'column'}}
      className="plants-page">
      <EquipmentModal 
        open={modalOpen} 
        selected={selected}
        onDelete={() => {
          deleteEquipment({ variables: { id: selected?.id } }).then(()=> {
            openModal(false)
            setSelected(undefined);
            // refetch()
          })
        }}
        onSubmit={(project) => {
          if(project.id){
            updateEquipment({ variables: {
              id: project.id,
              input: {
                name: project.name
              }
            }}).then(() => {
              openModal(false);
              setSelected(undefined)
              // refetch();
            })
          }else{
            createEquipment({
              variables: {
                input: {
                  name: project.name
                }
              }
            }).then(() => {
              openModal(false);
              setSelected(undefined)
              // refetch();
            })
          }
        }}
        onClose={() => {
          openModal(false)
          setSelected(undefined)
        }} />
      <PlantHeader 
        onCreate={configuration?.create != false && (() => {
          openModal(true);
        })}
        filter={search} onFilterChange={(search) => setSearch(search)} />
      <Paper sx={{flex: 1, display: 'flex', marginTop: '3px'}}>
        <DataTable
          orderBy={property}
          order={direction}
          onSort={(_property) => {
            if(property == _property){
              setDirection(direction == 'asc' ? 'desc' : 'asc')
            }else{
              setProperty(_property)
              setDirection('asc')
            }
          }}
          onClickRow={selectPlant}
      
          columns={listKeys}
          data={listData?.filter(filterEquipment).sort(sortEquipment) || []} />
      </Paper>

      {/* <SortedList 
          orderBy={"ID"}
          alerts={this.state.alerts}
          emergencyAlerts={this.state.emergencyAlerts}
          keys={this.state.listKeys}
          data={this.state.listData}
          onClick={this._selectPlant.bind(this)}
          />  */}
    </Box>
  );

}
