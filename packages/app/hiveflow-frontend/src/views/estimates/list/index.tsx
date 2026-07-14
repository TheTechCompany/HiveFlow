import { Box } from '@mui/material';
import React, {
  useEffect, useState
} from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ESTIMATES, CREATE_ESTIMATE, UPDATE_ESTIMATE, DELETE_ESTIMATE } from '@hive-flow/api';
import { DataTable } from '@hive-flow/ui'
// import utils from '../../utils';
import { QuoteHeader } from './header';
import { useTypeConfiguration } from '../../../context';
import { Estimate, EstimateModal } from '../../../modals/estimate';
import { useNavigate } from 'react-router-dom';
import { Paper, setRef } from '@mui/material';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});


export const EstimateList: React.FC<any> = (props) => {

  const navigate = useNavigate()

  const configuration = useTypeConfiguration('Estimate');

  const [ modalOpen, openModal ] = useState(false)
  const [ modalError, setModalError ] = useState<any>({});

  const [ selected, setSelected ] = useState<Estimate>()

  const [filter, setFiler] = useState<any>({})

  const [direction, setDirection] = useState<"asc" | "desc">('desc')
  const [property, setProperty] = useState<string>('displayId')

  // const [listData, setListData] = useState<any[]>([])

  const listKeys = [
    { property: 'displayId', header: 'Quote ID', sortable: true, size: 'xsmall'},
    { property: 'name', header: 'Quote Name', sortable: true, width: '50%' },
    { property: 'status', header: 'Status', sortable: true, size: 'small'},
    { property: 'price', header: 'Total Value',  render: (row) => formatter.format(row.price), sortable: true, size: 'small', align: 'left' }
  ]

  const { data } = useQuery(GET_ESTIMATES, { fetchPolicy: 'cache-and-network' })

  const listData = ((data as any)?.estimates || []) as any[]
  const users = ((data as any)?.users || []) as any[]

  const statusList = Array.from(new Set((listData || []).map((x: any) => x.status || '')))?.filter((a) => a != '');

  const [ createEstimate ] = useMutation(CREATE_ESTIMATE, { refetchQueries: ['GetEstimates'] })

  const [ updateEstimate ] = useMutation(UPDATE_ESTIMATE, { refetchQueries: ['GetEstimates'] })

  const [ deleteEstimate ] = useMutation(DELETE_ESTIMATE, { refetchQueries: ['GetEstimates'] })

  
  useEffect(() => {
    // utils.quote.getAll().then((quotes) => {
    //   setListData(quotes.map((x: any) => ({ id: `${x?.QuoteID}`,  status: x?.Status, name: x?.Name, price: parseInt(x?.TotalLinePrice?.toFixed(0)) || 0 })))
    // })
  }, [])

  const sortQuotes = (left: any, right: any) => {
    if(property && direction){
      return direction == 'asc' ?
        left[property].localeCompare(right[property], undefined, {numeric: true}) :
        right[property].localeCompare(left[property], undefined, {numeric: true})
    }else{
      return 0;
    }
  }

  const filterQuotes = (item: any) => {
 
    if (property && direction) {
      // if(direction == "asc"){
      //   items = sort(items.slice()).asc((u: any) => parseInt(u[property])) //[{[direction]: u => u[property]}])
      // }else if(direction == "desc"){
      //   items = sort(items.slice()).desc((u: any) => u[property])
      // }


      // items = items?.sort((first, last) => {
      //   let a: any = first;
      //   let b: any = last;

      //   var left = a[property]; //a != null ? a : ALMOST_ZERO;
      //   var right = b[property]; // != null ? b : ALMOST_ZERO;

      //   console.log( (parseInt(left) > parseInt(right)) )

      //   return (direction == 'asc' ?
      //     (a[property] == b[property] ? 0 : (a[property] > b[property] ? 1 : -1))
      //     : (a[property] == b[property] ? 0 : (a[property] < b[property] ? 1 : -1)))
      // })
    }

     if(filter.status && filter.status != "All"){
       return item.status === filter.status;
      //  items = items?.filter((a) => a.status == filter.status)
     }

    if (filter.search) {
        let name = item?.name?.toLowerCase() || ''
        let id = `${item?.displayId}`.toLowerCase() || ''

        let search = filter.search.toLowerCase() || ''


        return name?.indexOf(search) > -1 || id?.indexOf(search) > -1 || `${id} ${name}`.indexOf(search) > -1
    }

    return true;

   // return items.map((x) => ({...x, price: formatter.format(x.price)}))
  }

  const formatQuote = (item: any) => {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    return {
      ...item,
      price: item.price //
    }
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <EstimateModal 
        selected={selected}
        statusList={statusList}
        error={modalError}
        users={users || []}
        onDelete={() => {
          deleteEstimate({ variables: { id: selected?.displayId } }).then(()=> {
            openModal(false)
            setSelected(undefined);
            // refetch()
          })
        }}
        onSubmit={(project) => {
          setModalError({})
          if(project.id){
            updateEstimate({ variables: {
              id: project.displayId,
              input: {
                name: project.name,
                status: project.status,
                managers: project.managers
              }
            }}).then(() => {
              openModal(false);
              setSelected(undefined)
              // refetch();
            })
          }else{
            createEstimate({
              variables: {
                input: {
                  id: project.displayId,
                  name: project.name,
                  status: project.status,
                  managers: project.managers
                }
              }
            }).then(() => {
              openModal(false);
              setSelected(undefined)
              // refetch();
            }).catch((err) => {
              if(err.message == "Duplicate estimate id"){
                setModalError({displayId: project?.displayId})
              }
            })
          }
        }}
        onClose={() => {
          openModal(false)
          setSelected(undefined)
        }}
        open={modalOpen} />
      <QuoteHeader
        onCreate={configuration?.create != false && (() => {
            openModal(true);
        })}
        quotes={listData || []}
        statusList={statusList}
        filter={filter}
        onFilterChange={(filter) => setFiler(filter)}
      />
      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          marginTop: '3px'
        }}>

        <DataTable
          order={direction}
          orderBy={property}
          onSort={(_property) => {
            if(property == _property){
              setDirection(direction == 'asc' ? 'desc' : 'asc')
            }else{
              setProperty(_property)
              setDirection('asc')
            }
          }}
          onEditRow={(row) => {
            setSelected(row);
            openModal(true);
          }}
          onClickRow={(datum) => navigate(`${datum.displayId}/tickets`)}
          // sort={(property && direction) ? {property, external: true, direction} : undefined}
          columns={listKeys}
          data={listData?.filter(filterQuotes).sort(sortQuotes).map(formatQuote)} />
      </Paper>
    </Box>
  );

}

