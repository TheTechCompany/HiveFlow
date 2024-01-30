import { BaseModal, FormControl, FormInput } from '@hexhive/ui';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createFilterOptions } from '@mui/material/Autocomplete';

export interface Estimate {
    id?: string;
    displayId?: string;
    name?: string;
    status?: string;
}

interface EstimateStatusOption {
    text: string;
    inputValue?: string;
}

export interface EstimateModalProps {
    open: boolean;

    error?: any;

    statusList?: string[];

    selected?: Estimate;
    onSubmit?: (estimate: Estimate) => void;
    onDelete?: () => void;
    onClose?: () => void;
}

const filter = createFilterOptions<EstimateStatusOption>()


export const EstimateModal: React.FC<EstimateModalProps> = (props) => {

    const [estimate, setEstimate] = useState<Estimate>({})

    const [estimateStatusList, setEstimateStatusList] = useState<EstimateStatusOption[]>((props.statusList || []).map((x) => ({text: x})));

    useEffect(() => {
        //...(projectStatusList.map((x) => x.text)),
        setEstimateStatusList((projectStatusList) => 
            Array.from(new Set([  ...(props.statusList || []) ])).map((x) => ({text: x}))
        )
    }, [props.statusList])

    const submit = () => {
        props.onSubmit?.(estimate)
    }

    useEffect(() => {
        setEstimate({ ...props.selected })
    }, [props.selected])

    return (
        <Dialog 
            fullWidth
            open={props.open} 
            onClose={props.onClose}>
            <DialogTitle>{props.selected ? `Update` : 'Create'} Estimate</DialogTitle>
            <DialogContent>
                <Box sx={{ marginTop: '6px' }}>

                    <TextField
                        error={(props.error?.displayId && props.error?.displayId == estimate?.displayId)}
                        helperText={(props.error?.displayId && props.error?.displayId == estimate?.displayId) ? "Duplicate Estimate ID" : null}
                        sx={{marginBottom: '6px'}}
                        disabled={props.selected?.id != null}
                        size="small"
                        fullWidth
                        label="ID"
                        value={estimate?.displayId}
                        onChange={(e) => setEstimate({ ...estimate, displayId: e.target.value })} />

                    <TextField
                        sx={{marginBottom: '6px'}}

                        fullWidth
                        value={estimate.name}
                        size="small"
                        onChange={(e) => setEstimate({ ...estimate, name: e.target.value })}
                        label='Name' />

                    <Autocomplete
                        sx={{ marginBottom: '6px' }}
                        options={estimateStatusList}
                        // freeSolo
                        onChange={(ev, newValue) => {
                            console.log({newValue})
                            if (typeof newValue === 'string') {
                                setEstimate({ ...estimate, status: newValue })
                            } else if (newValue && newValue.inputValue) {
                                setEstimateStatusList([...estimateStatusList, {text: newValue.inputValue}])
                                setEstimate({...estimate, status: newValue.inputValue})
                            } else {
                                setEstimate({ ...estimate, status: newValue?.text })
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            if (params.inputValue !== '' && filtered.map((x) => x.text.toLowerCase() == params.inputValue.toLowerCase()).indexOf(true) < 0) {
                                filtered.push({
                                    inputValue: params.inputValue,
                                    text: `Add "${params.inputValue}"`,
                                });
                            }

                            return filtered;
                        }}
                        getOptionLabel={(option) => {
                            // e.g. value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option;
                            }
                            // if (option.inputValue) {
                            //     return option.inputValue;
                            // }
                            return option.text;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        value={estimateStatusList?.find((a) => a.text == estimate?.status) || null}
                        renderInput={(params) => <TextField {...params} size="small" label="Status" />}
                    />
                
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: props.selected ? 'space-between' : 'flex-end' }}>
                {props.selected ? <Button onClick={props.onDelete} color="error">Delete</Button> : null}
                <Box sx={{ display: 'flex' }}>
                    <Button onClick={props.onClose}>Close</Button>
                    <Button onClick={submit} color="primary" variant="contained">{props.selected ? "Save" : "Create"}</Button>
                </Box>
            </DialogActions>

        </Dialog>
    )
}