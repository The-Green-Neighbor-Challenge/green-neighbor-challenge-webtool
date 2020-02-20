import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

    const styles = theme => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        backButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    const DialogTitle = withStyles(styles)(props => {
        const { children, classes, onClose, ...other } = props;
        return (
          <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
          </MuiDialogTitle>
        );
      });

      const DialogContent = withStyles(theme => ({
        root: {
          padding: theme.spacing(2),
        },
      }))(MuiDialogContent);
      
      const DialogActions = withStyles(theme => ({
        root: {
          margin: 0,
          padding: theme.spacing(1),
        },
      }))(MuiDialogActions);

      
        

export default function ReportThankYou(props) {    
    

    return (
      <div>
        <Dialog  aria-labelledby="customized-dialog-title" open={props.open}>
          <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
            Thanks for helping out!
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              We will work to resolve this issue and let you know when it's been fixed.
            </Typography>
          </DialogContent>
          <DialogActions>
            <button onClick={props.postThenBack} className="button-primary">
              Continue
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
}