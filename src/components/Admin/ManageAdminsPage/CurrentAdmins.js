import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import UpdateAdminInfo from '../ManageAdminsPage/UpdateAdminInfo';
import styled from 'styled-components';

const Container = styled.div`
    width: max-content;
    height: min-content;
    display: block;
    justify-content: center;
    background-color: var(--color-bkg-container);
    border-radius: 16px;
    padding: 16px;
    box-sizing: border-box;
    box-shadow: 0 4px 4px -2px var(--color-shadow);
    margin: 50px 25px;
    label {
        padding: 10px;
    }
    input {
        margin: 10px 10px 10px 0px;
        width: 100%
    }
    div {
        justify-content: center;
        align-text: center;
    }
    h1 {
        text-align: center; 
    }
    button {
        text-align: center;
        align: left;
    }
    td, th {
        text-align: center;
    }
    td {
        padding: 16px;
    }
`;

export default function CurrentAdmin() {
    const dispatch = useDispatch(); 
    const adminUsers = useSelector(state => state.adminUsers );
    const currentUser = useSelector(state => state.user);
    const {usernames} = useParams();
    const [open, setOpen] = useState(false);
    // const [close, setClose] = useState(true);

    const editButton  = () => {
        console.log('hitting edit button');
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        };

    useEffect(() =>  {
        console.log('Getting all users', usernames);
        dispatch({ type: 'GET_ADMIN_USERS' });
    }, [usernames, dispatch] );

    // Function to Delete Users --- Admins cannot update other admin's info.
    // Delete only shows for logged in admins

    const deleteAdmin = (id) => {
        console.log('start deleteAdmin');
        dispatch({ type: 'DELETE_ADMIN', payload: id});
    };

    const EditButton = () => {
        return (
            <button onClick={() => editButton()}>Update User Info</button>
        );
    };

    const RemoveButton = ({user}) => {
        return (
            <button onClick={() => deleteAdmin(user.id)} >Remove</button>
        );
    };

    return(
        <Container>
            <h1> Current Admins</h1>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {adminUsers.map((user, i) => 
                        <tr key={i}>
                            <td>{user.username}</td>
                            <td>
                                {user.id === currentUser.id ? <EditButton /> : <RemoveButton user={user} />}
                            </td> 
                        </tr>
                    )}
                </tbody>
            </table>
            <UpdateAdminInfo open={open} close={handleClose} />
        </Container>
    )
}