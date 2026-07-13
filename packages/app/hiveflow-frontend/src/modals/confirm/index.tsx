import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"

export const ConfirmModal = (props: any) => {
    return (
        <Dialog fullWidth open={props.open} onClose={props.onReject}>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <Typography>{props.message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onReject}>No</Button>
                <Button onClick={props.onConfirm} variant="contained" color="error">Yes</Button>
            </DialogActions>
        </Dialog>
    )
}