import React, {
  Component, useState
} from 'react';


// import utils from '../../../utils';
import moment from 'moment';
import { DataTable } from '../../../components/DataTable'
import { Box } from 'grommet';
import { PlantHeader } from './header';
import { useMutation, useQuery } from '@hive-flow/api';
import { useTypeConfiguration } from '../../../context';
import { Equipment, EquipmentModal } from '../../../modals/equipment';


export const EquipmentList: React.FC<any> = (props) => {

  const configuration = useTypeConfiguration('Equipment')

  const [ modalOpen, openModal ] = useState(false);
  const [ selected, setSelected ] = useState<Equipment>()

  const [search, setSearch] = useState<string>('');

  const listKeys = [
    { property: 'displayId', header: 'ID', size: 'small', sortable: true },
    { property: 'name', header: 'Name', sortable: true },
    { property: 'registration', header: 'Registration', sortable: true },
    { property: 'status', header: 'Status', sortable: true },
  ]

  const query = useQuery({
    suspense: false,
    staleWhileRevalidate: true
  });


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

  const listData = query?.equipment || [];

  const [ createEquipment ] = useMutation((mutation, args: {name: string}) => {
    const item = mutation.createEquipment({
      input: {
  
          name: args.name
  
      }
    })
    return {
      item: {
        ...item
      }
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.equipment]
  })

  const [ updateEquipment ] = useMutation((mutation, args: {id: string, name: string}) => {
    if(!args.id) return;
    const item = mutation.updateEquipment({
      id: args.id,
      input: {
        name: args.name,
      }
    })
    return {
      item: { 
        ...item
      }
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.equipment]
  })

  const [ deleteEquipment ] = useMutation((mutation, args: {id: string}) => {
    if(!args.id) return;
    const item = mutation.deleteEquipment({
      id: args.id
    })
    return {
      item: item
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.equipment]
  })

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
      flex
      className="plants-page">
      <EquipmentModal 
        open={modalOpen} 
        selected={selected}
        onDelete={() => {
          deleteEquipment({args: {id: selected?.id}}).then(()=> {
            openModal(false)
            setSelected(undefined);
            // refetch()
          })
        }}
        onSubmit={(project) => {
          if(project.id){
            updateEquipment({args: {
              id: project.id,
              name: project.name,
            }}).then(() => {
              openModal(false);
              setSelected(undefined)
              // refetch();
            })
          }else{
            createEquipment({
              args: {
                name: project.name,
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
      <Box
        round="xsmall"
        overflow="scroll"
        flex
        background="neutral-1"
      >
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
      </Box>

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
