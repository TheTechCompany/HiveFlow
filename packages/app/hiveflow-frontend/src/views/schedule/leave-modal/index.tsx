import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"

export const LeaveModal = (props: any) => {
    return (
        <Dialog 
            fullWidth
            open={props.open} 
            onClose={props.onClose}>
            <DialogTitle>Leave</DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <DateTimePicker format="DD/MM/YYYY" />
                <DateTimePicker format="DD/MM/YYYY" />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    Cancel
                </Button>
                <Button variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}