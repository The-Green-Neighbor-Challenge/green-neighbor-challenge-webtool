import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import {Modal} from '@material-ui/core';

const Resolved = styled.button`
    color: ${props=>(props.resolved? 'var(--color-primary)' : '#A53535')};
    background-color: rgba(0, 0, 0, 0);
    border: none;
    outline: none;
    font-size: 1rem;
    transition: all .2s;
    &:hover {
        color: ${props=>(props.resolved? 'var(--color-primary-bright)' : '#333')};
        transform: scale(1.05);
        cursor: pointer;
    }
`;

const ModalBody = styled.div`
    position: absolute;
    max-width: 32rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    :focus {
        outline: none;
    }
    p {
        margin: 0px;
    }
`;

const MarginLeft = styled.div`
    margin-left: 4px;
`;

const TicketInfo = styled.div`
    display: grid;
    grid-template-columns: max-content 1fr;
    p {
        padding: 4px;
        margin: 0px;
        background-color: #EEEEEE;
        border-bottom: 1px solid #CCCCCC
    }
    p:nth-child(4n){
        background-color: #FFFFFF;
    }
    p:nth-child(4n-1){
        background-color: #FFFFFF;
    }
`;

const ButtonRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
`;

export default function DetailsModal(props){
    const history = useHistory();
    const dispatch = useDispatch();
    const open = useSelector(state => state.adminTicketsModalOpen);
    const ticket = useSelector(state => state.adminTicketsModalTicket);
    ticket.date_submitted = new Date(ticket.date_submitted);
    const [resolved, setResolved] = useState(ticket.resolved);

    useEffect(() => {
        setResolved(ticket.resolved);
    }, [ticket.resolved]);

    const closeModal = e => {
        dispatch({type: 'SET_TICKET_MODAL_OPEN', payload: false});
    }

    const onEditClick = () => {
        if(ticket.type === 0){
            dispatch({
                type: 'SET_SUBMISSION_FORM',
                payload: {
                    zips: [ticket.zip],
                    utility_name: ticket.utility_name,
                    state: ticket.state
                }
            })
            history.push('/admin/submit/create/utility');
        }
        else if(ticket.type === 1){
            dispatch({
                type: 'SET_SUBMISSION_FORM',
                payload: {
                    eia_state: ticket.eia_state,
                    utility_name: ticket.utility_name || '',
                    eiaid: ticket.eia_state.match(/[0-9]*/)[0],
                    state: ticket.state || ticket.eia_state.match(/[a-zA-Z]+/)[0],
                    program_name: ticket.program_name
                }
            });
            history.push('/admin/submit/create/program');
        }
        else if(ticket.type === 2){
            dispatch({
                type: 'GET_PROGRAM_SUBMISSION_FORM_DATA',
                payload: {
                    history: history,
                    id: ticket.gpp_id
                }
            });
        }
    }

    const onResolvedClicked = e => {
        const value = !resolved;
        dispatch({
            type: 'SET_TICKET_RESOLVE',
            payload: {id: ticket.id, value}
        });
        setResolved(value);
    }

    const buttonText = ['Create Utility', 'Create Program', `Edit ${ticket.program_name}`]

    return(
        <Modal
            aria-labelledby='admin-tickets-details-modal'
            open={open}
            onBackdropClick={closeModal}
        >
            <ModalBody
                className='container'
                id='admin-tickets-details-modal'
            >
                <MarginLeft>
                    <h2>Ticket Details</h2>
                    <p>
                        <Resolved
                            resolved={resolved}
                            onClick={onResolvedClicked}
                        >
                            {resolved ? 'Resolved' : 'Active'}
                        </Resolved>
                    </p>
                </MarginLeft>
                <TicketInfo>
                    <p>Submitted:</p>
                    <p>{ticket.date_submitted && 
                        ticket.date_submitted.toLocaleDateString()}
                    </p>
                    <p>Zip:</p><p>{ticket.zip}</p>
                    {(ticket.eia_state && 
                        <>
                            <p>EIAID - State:</p>
                            <p>{ticket.eia_state.match(/[0-9]*/)[0]} - {ticket.eia_state.match(/[a-zA-Z]+/)[0]}</p>
                        </>
                    ) || (ticket.state && 
                        <>
                            <p>State:</p>
                            <p>{ticket.state}</p>
                        </>
                    )}
                    <p>Utility:</p><p>{ticket.utility_name}</p>
                    {ticket.program_name &&
                        <>
                            <p>Program:</p><p>{ticket.program_name}</p>
                        </>
                    }
                </TicketInfo>
                {ticket.comments && ticket.comments !== '' &&
                    <>
                        <p>Comment:</p>
                        <p>{ticket.comments}</p>
                    </>
                }
                <ButtonRow>
                    <button
                        onClick={onEditClick}
                        className='button-default'
                    >
                        {buttonText[ticket.type]}
                    </button>
                    <button
                        onClick={closeModal}
                        className='button-default'
                    >Close</button>
                </ButtonRow>
            </ModalBody>
        </Modal>
    )
}