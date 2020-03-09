import React, { useState } from "react"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import { Formik, FormikErrors } from "formik"
import Alert from "@material-ui/lab/Alert"
import { CardData } from "../utils/firebase"

interface FormValues {
  title: string
}

function AddCardDialog({
  open,
  onClose,
  addCard,
  allCardTitles
}: {
  open: boolean
  onClose: () => void
  addCard: (added: CardData) => Promise<void>
  allCardTitles: string[]
}) {
  const initialValues: FormValues = { title: "" }
  const [showAlert, setShowAlert] = useState(false)

  const handleClose = () => {
    setShowAlert(false)
    onClose()
  }

  const handleFormSubmit = async (values: FormValues, helpers: any) => {
    try {
      setShowAlert(false)
      await addCard({ type: "rss", order: allCardTitles.length + 1, title: values.title, updateRate: 60 })
      handleClose()
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
              <Button onClick={handleClose} color="primary">
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
