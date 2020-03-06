import React, { useState, useContext } from "react"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import { Formik, FormikErrors } from "formik"
import Alert from "@material-ui/lab/Alert"
import { upsertCard } from "../utils/firebase"
import DataContext from "./DataContext"

interface FormValues {
  title: string
}

function AddCardDialog({
  open,
  onClose,
  allCardTitles
}: {
  open: boolean
  onClose: (accepted: boolean) => void
  allCardTitles: string[]
}) {
  const initialValues: FormValues = { title: "" }
  const { cards } = useContext(DataContext)
  const [showAlert, setShowAlert] = useState(false)
  const handleClose = (accepted: boolean) => {
    setShowAlert(false)
    onClose(accepted)
  }
  const handleFormSubmit = async (values: FormValues, helpers: any) => {
    try {
      setShowAlert(false)
      cards.add(values.title)
      await upsertCard(cards.get(values.title)!)
      handleClose(true)
    } catch (error) {
      console.error(error)
      setShowAlert(true)
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <Dialog disableBackdropClick disableEscapeKeyDown maxWidth="xs" aria-labelledby="add-card-dialog-title" open={open}>
      <DialogTitle id="add-card-dialog-title">Add Card</DialogTitle>

      <Formik
        initialValues={initialValues}
        validate={values => {
          const errors: FormikErrors<FormValues> = {}
          if (!values.title) {
            errors.title = "Required"
          } else if (allCardTitles.includes(values.title.toLowerCase())) {
            errors.title = "Card title must be unique"
          }
          return errors
        }}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <div>Give unique title for the card</div>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Card Title"
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                error={!!errors.title && touched.title}
                helperText={errors.title}
              />
              {showAlert && <Alert severity="error">Failed to add the card</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting || !!errors.title || !touched.title}>
                OK
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  )
}

export default AddCardDialog
