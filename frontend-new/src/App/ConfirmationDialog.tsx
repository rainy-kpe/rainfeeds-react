import React from "react"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"

export interface ConfirmationDialogProps {
  title: string
  open: boolean
  onClose: (confirmed: boolean) => void
  children: React.ReactNode
}

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { onClose, open, title, children } = props

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onClose(true)} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
