import React, { useState } from "react"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import { Formik, FieldArray } from "formik"
import Alert from "@material-ui/lab/Alert"
import { upsertCard, createDataResource, CardData } from "../utils/firebase"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  container: {
    "& > div": {
      marginBottom: "20px"
    }
  },
  urlContainer: {
    display: "flex"
  },
  url: {
    flex: "1"
  }
}))

function SettingsDialog({
  open,
  onClose,
  card
}: {
  open: boolean
  onClose: (accepted: boolean) => void
  card: CardData
}) {
  const classes = useStyles()
  const [showAlert, setShowAlert] = useState(false)
  const handleClose = (accepted: boolean) => {
    setShowAlert(false)
    onClose(accepted)
  }
  const handleFormSubmit = async (values: CardData, helpers: any) => {
    try {
      setShowAlert(false)
      // resource.update({ ...card, ...values })
      // await upsertCard(resource.get(card.title)!)
      handleClose(true)
    } catch (error) {
      console.error(error)
      setShowAlert(true)
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <Dialog disableBackdropClick disableEscapeKeyDown maxWidth="sm" aria-labelledby="settings-dialog-title" open={open}>
      <DialogTitle id="settings-dialog-title">{`${card.title} Settings`}</DialogTitle>

      <Formik
        initialValues={{ ...card, urls: [...(card.urls || [])] }}
        validate={values => {
          const errors: any = {}
          if (values.updateRate <= 0) {
            errors.updateRate = "Must be greater than 0"
          }
          errors.urls = []
          for (const url of values.urls) {
            errors.urls.push(url.trim() === "" ? "Cannot be empty" : "")
          }
          if (!errors.urls.some((url: string) => url !== "")) {
            delete errors.urls
          }
          return errors
        }}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers className={classes.container}>
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Feed type</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type"
                  fullWidth
                  value={values.type}
                  onChange={handleChange("type")}
                  onBlur={handleBlur("type")}
                >
                  <MenuItem value="rss">RSS</MenuItem>
                  <MenuItem value="hackernews">HackerNews</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="updateRate"
                label="Update rate"
                type="number"
                fullWidth
                error={!!errors.updateRate && touched.updateRate}
                helperText={errors.updateRate}
                value={values.updateRate}
                onChange={handleChange}
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {values.type === "rss" && (
                <FieldArray name="urls">
                  {arrayHelpers => (
                    <div>
                      {values.urls.map((url, index) => (
                        <div key={index} className={classes.urlContainer}>
                          <TextField
                            id={`urls.${index}`}
                            className={classes.url}
                            fullWidth
                            label="Url"
                            value={url}
                            error={!!errors.urls && !!errors.urls[index] && !!touched.urls}
                            helperText={!!errors.urls && errors.urls[index]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <IconButton onClick={() => arrayHelpers.remove(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      ))}
                      <IconButton onClick={() => arrayHelpers.push("")}>
                        <AddIcon />
                      </IconButton>
                    </div>
                  )}
                </FieldArray>
              )}
              {showAlert && <Alert severity="error">Failed to update the card</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)} color="primary">
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                disabled={
                  isSubmitting ||
                  !!errors.updateRate ||
                  !!errors.urls ||
                  (!touched.urls && !touched.type && !touched.updateRate)
                }
              >
                OK
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  )
}

export default SettingsDialog
