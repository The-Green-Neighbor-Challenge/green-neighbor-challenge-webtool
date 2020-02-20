import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    }
});

const Inputs = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 4px;
    grid-row-gap: 8px;
`;

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

  export default function UpdateAdminInfo(props) {
    const {username: currentUsername} = useSelector(state => state.user);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const dispatch = useDispatch();

    useEffect(()=>{
        setUsername(currentUsername);
    }, [currentUsername]);

    // Function allows a Logged in Admin to update ONLY their own info.
    const updateAdmin = () => {
        if(password === confirmPass){
            console.log('start updateAdmin');
            dispatch({
                type: 'UPDATE_ADMIN_INFO',
                payload: {
                    username, password
                }
            });
            props.close();
        } else {
            alert("New password and confirmed password do not match!");
        }
    };

    const closeBox = () => {
        setUsername('');
        setPassword('');
        setConfirmPass('');
        props.close();
    }

    return (
        <Dialog 
            aria-labelledby="customized-dialog-title"
            open={props.open}
            onBackdropClick={props.close}
        >
            <form onSubmit={updateAdmin}>
                <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
                    Update your Admin Info
                </DialogTitle>
                <DialogContent dividers>
                    <Inputs>
                        <label htmlFor='new-username'>
                            New Username:
                        </label>
                        <input     
                            id='new-username'
                            type="text"
                            placeholder="New Username"
                            value={username}
                            onChange={e=>setUsername(e.target.value)}
                        />
                        <label htmlFor='new-pass'>
                            New Password:
                        </label>
                        <input
                            id='new-pass'
                            type="password"
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                        />
                        <label htmlFor='confirm-pass'>
                            Confirm Password:
                        </label>
                        <input
                            id='confirm-pass'
                            type="password"
                            value={confirmPass}
                            onChange={e=>setConfirmPass(e.target.value)}
                        />
                    </Inputs>
                </DialogContent>
                <DialogActions>
                    <button
                        className='button-default'
                        type='button'
                        onClick={closeBox}
                    >
                        Cancel
                    </button>
                    <button
                        autoFocus
                        type='submit'
                        className="button-primary"
                    >
                        Save Changes
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    )
  }