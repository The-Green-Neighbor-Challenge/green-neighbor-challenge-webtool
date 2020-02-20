import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {MainTableBody} from '../AdminUI';
import styled from 'styled-components';
import DetailsModal from './DetailsModal';

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

const DetailsParagraph = styled.p`
    margin: 0px 0px 8px 0px;
`;

function Details({ticket}){
    const {email, comments} = ticket;
    return(
        <tr>
            <td colSpan={6}>
                <DetailsParagraph>Comments: {comments}</DetailsParagraph>
                <DetailsParagraph>
                    <a href={`mailto:${email}`} >{email}</a>
                </DetailsParagraph>
            </td>
        </tr>
    )
}

function Ticket({ticket}){
    const {
        id, resolved, zip, utility_name, program_name, date_submitted
    } = ticket;
    const [resolvedChecked, setResolvedChecked] = useState(!!resolved);
    const dispatch = useDispatch();
    const showDetails = useSelector(state => state.adminTicketsDisplayDetails);

    const onResolvedClicked = e => {
        const value = !resolvedChecked;
        dispatch({
            type: 'SET_TICKET_RESOLVE',
            payload: {id, value}
        });
        setResolvedChecked(value);
    }

    const openModal = e => {
        dispatch({type: 'SET_TICKET_MODAL_OPEN', payload: true});
        dispatch({type: 'SET_TICKET_MODAL_TICKET', payload: ticket});
    }

    const date = new Date(date_submitted);
    return(
        <>
            <tr>
                <td>{date.toLocaleDateString()}</td>
                <td>{zip}</td>
                <td>{utility_name}</td>
                <td>{program_name}</td>
                <td>
                    <Resolved
                        resolved={resolvedChecked}
                        onClick={onResolvedClicked}
                    >
                        {resolvedChecked ? 'Resolved' : 'Active'}
                    </Resolved>
                </td>
                <td>
                    <button
                        onClick={openModal}
                    >
                        Details
                    </button>
                </td>
            </tr>
            {showDetails && <Details ticket={ticket} />}
        </>
    )
}

let key = 0;

export default function TicketsList(props){
    const tickets = useSelector(state => state.tickets.tickets);
    const showDetails = useSelector(state => state.adminTicketsDisplayDetails);
    return tickets ? (
        <MainTableBody hoverable={!showDetails} doubleLines={showDetails}>
            <DetailsModal />
            {tickets.map((ticket, i) =>{
                ticket.index = i;
                return(
                    <Ticket
                        index={i}
                        ticket={ticket}
                        key={key++}
                    />
                )
            })}
        </MainTableBody>
    ) : null;
}