import { Box } from 'grommet';
import React, {
  Component
} from 'react';

import {TransferList} from '@hexhive/ui';

export interface PlantTabProps {
  onChange?: (items: any[]) => void;
  selected?: any[];

  assigned?: any[];
  options?: any[];
  labelKey?: string;
}

export const EquipmentTab : React.FC<PlantTabProps> = ({
  onChange,
  selected = [],
  assigned = [],
  options = [],
  labelKey
}) => {


  const not = (a?: any[], b?: any[]) => {
    return a?.filter(value => b?.indexOf(value) === -1);
  }
  
  const onAdd = (items: any[]) => {
    let add = selected?.slice();
    onChange?.(add.concat(items));
  }

  const onRemove = (items: any[]) => {
    let remove = selected?.slice();
    onChange?.(not(remove, items));
  }

    return (
      <Box height="100%">
        <TransferList
          assignedKey={labelKey}
          assignedList={assigned}
          labelKey={labelKey}
          options={options.filter((x: any) => x.name).sort((a: any, b: any) => {
             return a.name.localeCompare(b.name, 'en', { numeric: true }) 
          })}
          selected={selected} 
          onAdd={onAdd}
          onRemove={onRemove}/>
      </Box>
    );
}
