import { Box, ColumnConfig, DataTable } from 'grommet';
import React, {
  useEffect, useState
} from 'react';
import { useMutation, useQuery } from '@hive-flow/api';

// import utils from '../../utils';
import { QuoteHeader } from './header';
import { useTypeConfiguration } from '../../context';
import { Estimate, EstimateModal } from '../../modals/estimate';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});


const Quotes: React.FC<any> = (props) => {

  const configuration = useTypeConfiguration('Estimate');

  const [ modalOpen, openModal ] = useState(false)
  const [ selected, setSelected ] = useState<Estimate>()

  const [filter, setFiler] = useState<any>({})

  const [direction, setDirection] = useState<"asc" | "desc">()
  const [property, setProperty] = useState<string>()

  // const [listData, setListData] = useState<any[]>([])

  const listKeys : ColumnConfig<{id: string; name: any; price: any;}>[] = [
    { property: 'id', header: 'Quote ID', sortable: true, size: 'small', primary: true },
    { property: 'name', header: 'Quote Name', sortable: true, size: 'large' },
    { property: 'status', header: 'Status', sortable: true, size: 'small'},
    { property: 'price', header: 'Total Value',  render: (row) => formatter.format(row.price), sortable: true, size: 'small', align: 'start' }
  ]

  const query = useQuery({
    suspense: false,
    staleWhileRevalidate: true
  })

  const listData = query.estimates()

  const [ createEstimate ] = useMutation((mutation, args: {name: string}) => {
    const item = mutation.updateHiveOrganisations({
      update: {
        estimates: [{
          create: [{
            node: {
              name: args.name
            }
          }]
        }]
      }
    })
    return {
      item: {
        ...item.hiveOrganisations?.[0]
      }
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.estimates()]
  })

  const [ updateEstimate ] = useMutation((mutation, args: {id: string, name: string}) => {
    if(!args.id) return;
    const item = mutation.updateEstimates({
      where: {id: args.id},
      update: {
        name: args.name,
      }
    })
    return {
      item: { 
        ...item.estimates?.[0]
      }
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.estimates()]
  })

  const [ deleteEstimate ] = useMutation((mutation, args: {id: string}) => {
    if(!args.id) return;
    const item = mutation.deleteEstimates({
      where: {id: args.id}
    })
    return {
      item: item.nodesDeleted
    }
  }, {
    awaitRefetchQueries: true,
    refetchQueries: [query.estimates()]
  })

  
  useEffect(() => {
    // utils.quote.getAll().then((quotes) => {
    //   setListData(quotes.map((x: any) => ({ id: `${x?.QuoteID}`,  status: x?.Status, name: x?.Name, price: parseInt(x?.TotalLinePrice?.toFixed(0)) || 0 })))
    // })
  }, [])

  const sortQuotes = (left: any, right: any) => {
    if(property && direction){
      return (direction == 'asc' ?
          (left[property] == right[property] ? 0 : (left[property] > right[property] ? 1 : -1))
          : (left[property] == right[property] ? 0 : (left[property] < right[property] ? 1 : -1)))
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
        let id = `${item?.id}`.toLowerCase() || ''

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
      direction="column"
      flex>
      <EstimateModal 
        selected={selected}
        onDelete={() => {
          deleteEstimate({args: {id: selected?.id}}).then(()=> {
            openModal(false)
            setSelected(undefined);
            // refetch()
          })
        }}
        onSubmit={(project) => {
          if(project.id){
            updateEstimate({args: {
              id: project.id,
              name: project.name,
            }}).then(() => {
              openModal(false);
              setSelected(undefined)
              // refetch();
            })
          }else{
            createEstimate({
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
        }}
        open={modalOpen} />
      <QuoteHeader
        onCreate={configuration?.create != false && (() => {
            openModal(true);
        })}
        quotes={listData || []}
        filter={filter}
        onFilterChange={(filter) => setFiler(filter)}
      />
      <Box
        flex
        overflow={{ vertical: 'auto' }}
        round="xsmall"
        background="neutral-1">

        <DataTable
          pin
          onSort={({ property, direction }) => {
            setProperty(property)
            setDirection(direction)
          }}
          sort={(property && direction) ? {property, external: true, direction} : undefined}
          columns={listKeys}
          data={listData?.filter(filterQuotes).sort(sortQuotes).map(formatQuote)} />
      </Box>
    </Box>
  );

}

export default Quotes;