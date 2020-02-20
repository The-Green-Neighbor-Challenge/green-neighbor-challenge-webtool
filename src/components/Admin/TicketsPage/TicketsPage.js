import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useHistory} from 'react-router-dom';
import writeQueries from '../../../modules/writeQueries';
import parseQueries from '../../../modules/parseQueries';
import styled from 'styled-components';
import {Container, ManageBox, SearchBox, FilterBox,
        FilterOption, MainBox, MainHeader, MainTable,
        PageButton, PageBar, MainTableHead
    } from '../AdminUI';

import TicketsList from './TicketsList';

const DetailsDisplayButton = styled.button`
    border-radius: 4px;
    outline: none;
    font-size: 1rem;
    transition: all .2s;
    color: black;
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }
`;

const OrderByOptions = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 8px 0px;
`;

export default function TicketsPage() {

    const history = useHistory();
    const {search} = useLocation();
    const {
        zip, program, utility, resolved,
        fromCompanies, fromUtility, fromProgram, offset, comments,
    } = parseQueries(search);
    const [zipSearch, setZipSearch] = useState(zip || '');
    const [utilitySearch, setUtilitySearch] = useState(utility || '');
    const [programSearch, setProgramSearch] = useState(program || '');
    const [showResolved, setShowResolved] = useState(resolved);
    // Use of == is intentional: catches boolean values and string values of 'true' and 'false'
    const [showFromCompanies, setShowFromCompanies] = useState(fromCompanies == false ? false : true);
    const [showFromUtility, setShowFromUtility] = useState(fromUtility == false ? false : true);
    const [showFromProgram, setShowFromProgram] = useState(fromProgram == false ? false : true);
    const [commentSearch, setCommentSearch] = useState(comments || '');
    const [orderBy, setOrderBy] = useState(search.orderBy);
    const [order, setOrder] = useState(search.order);
    const dispatch = useCallback(useDispatch(), []);

    const ticketCount = useSelector(state=>state.tickets.count);
    const showDetails = useSelector(state => state.adminTicketsDisplayDetails);
    const ticketsUpdateFlag = useSelector(state => state.ticketsUpdateFlag);

    const hasMounted = useRef(false);

    const clickPage = (page) => {
        const current = parseQueries(search);
        current.offset = page * 100;
        history.push(`/admin/tickets${writeQueries(current)}`)
    }

    // Returns the page selector buttons
    const renderPages = () => {
        const pageList = [];
        const pageMax = Math.ceil(ticketCount / 100);
        if(pageMax <= 1) return null;

        const page = (offset / 100) || 0;
        const pageButton = (index, goto, text) => {
            return <PageButton
                        key={index}
                        index={index}
                        page={page}
                        onClick = {() => clickPage(goto)}
                    >{text}</PageButton>
        }
        if(page > 5){
            pageList.push(pageButton(-1, 0, '<<'));
        }

        if(page >= pageMax - 5) {
            for(let i = Math.max(pageMax - 10, 0); i < pageMax; i++){
                pageList.push(pageButton(i, i, i+1))
            }
        } else {
            const min = Math.max(page - 4, 0);
            for(let i = min; i < min + 10; i++){
                pageList.push(pageButton(i, i, i+1));
            }
        }

        if(page < pageMax - 6){
            pageList.push(pageButton(pageMax, pageMax - 1, '>>'));
        }

        return pageList;
    }

    // on initial render, fetch tickets that we should be displaying
    // based on what's in the URL
    useEffect(()=>{
        dispatch({
            type: 'GET_TICKETS',
            payload: {
                zip, resolved, program_name: program,
                utility_name: utility, offset, comments,
                fromCompanies, fromUtility,
                fromProgram, orderBy, order
            }
        });
    }, [dispatch, zip, program, utility, resolved,
        fromCompanies, fromUtility, fromProgram,
        offset, comments, ticketsUpdateFlag
    ]);

    

    // if a filter changes, update the search
    useEffect(()=>{
        if(hasMounted.current){
            onSearch();
        } else hasMounted.current = true;
    }, [showFromCompanies, showFromUtility,
        showFromProgram, showResolved]
    );

    // ensure modal is closed on page up
    useEffect(() => {
        dispatch({
            type: 'SET_TICKET_MODAL_OPEN', payload: false
        });
        dispatch({
            type: 'SET_TICKETS_DISPLAY', payload: false
        });
    }, [dispatch]);

    // push current search to url
    function onSearch(e) {
      if(e) e.preventDefault();
      history.push(`/admin/tickets${writeQueries({
          zip: zipSearch, program: programSearch, utility: utilitySearch,
          resolved: showResolved, fromCompanies: showFromCompanies,
          fromUtility: showFromUtility, fromProgram: showFromProgram,
          comments: commentSearch, orderBy, order
      })}`);
    }

    

    

    const toggleShowDetails = e => {
        dispatch({type: 'SET_TICKETS_DISPLAY', payload: !showDetails});
    }

    return(
        <Container>
            <h1>Tickets Management</h1>
            <ManageBox>
                <SearchBox onSubmit={onSearch} aria-label="search box">
                    <form onSubmit={onSearch}>
                        <input
                            placeholder='Zip Code'
                            value={zipSearch}
                            type='number'
                            onChange={e => setZipSearch(e.target.value)}
                        />
                        <input
                            placeholder='Utility'
                            value={utilitySearch}
                            onChange={e => setUtilitySearch(e.target.value)}
                        />
                        <input
                            placeholder='Program'
                            value={programSearch}
                            onChange={e => setProgramSearch(e.target.value)}
                        />
                        <input
                            placeholder='Comment Text'
                            value={commentSearch}
                            onChange={e => setCommentSearch(e.target.value)}
                        />
                        <OrderByOptions>
                            <label htmlFor='admin-tickets-order-by'>Order By: </label>
                            <div>
                                <select
                                    id='admin-tickets-order-by'
                                    value={orderBy}
                                    onChange={e=>setOrderBy(e.target.value)}
                                >
                                    <option value='date_submitted'>Date Submitted</option>
                                    <option value='zip'>Zip Code</option>
                                    <option value='utility_name'>Utility Name</option>
                                    <option value='program_name'>Program Name</option>
                                </select>
                                <select
                                    value={order}
                                    onChange={e=>setOrder(e.target.value)}
                                >
                                    <option value='DESC'>Descending</option>
                                    <option value='ASC'>Ascending</option>
                                </select>
                            </div>
                        </OrderByOptions>
                        <button
                            type='submit'
                            className='button-default'
                        >Search</button>
                    </form>
                </SearchBox>
                <FilterBox>
                    <FilterOption>
                        <input
                            type="checkbox"
                            checked={showFromCompanies}
                            onChange={()=>setShowFromCompanies(!showFromCompanies)}
                        />
                        <label>Missing Companies</label>
                    </FilterOption>
                    <FilterOption>
                        <input
                            type="checkbox"
                            checked={showFromUtility}
                            onChange={()=>setShowFromUtility(!showFromUtility)}
                        />
                        <label>Missing Programs</label>
                    </FilterOption>
                    <FilterOption>
                        <input
                            type="checkbox"
                            checked={showFromProgram}
                            onChange={()=>setShowFromProgram(!showFromProgram)}
                        />
                        <label>Program Errors</label>
                    </FilterOption>
                    <FilterOption>
                        <select
                            value={showResolved}
                            onChange={e=>{
                                setShowResolved(e.target.value !== '' ? e.target.value : undefined)
                            }}
                        >
                            <option value=''>Show All</option>
                            <option value={true}>Show Resolved</option>
                            <option value={false}>Show Unresolved</option>
                        </select>
                    </FilterOption>
                </FilterBox>
                <MainHeader>
                    <p>Page {offset/100 + 1 || 1} of {Math.ceil(ticketCount / 100) || 1}</p>
                    <PageBar>{renderPages()}</PageBar>
                </MainHeader>
                <MainBox>
                    <MainTable>
                        <MainTableHead>
                            <tr>
                                <th>Date</th>
                                <th>Zip</th>
                                <th>Company</th>
                                <th>Program</th>
                                <th style={{minWidth: '5rem'}}>Status</th>
                                <th>
                                    <DetailsDisplayButton
                                        active={showDetails}
                                        onClick={toggleShowDetails}
                                    >
                                        {showDetails ? 'Hide':'Show'} Detailed View
                                    </DetailsDisplayButton>
                                </th>
                            </tr>
                        </MainTableHead>
                        <TicketsList/>
                    </MainTable>
                </MainBox>
            </ManageBox>
        </Container>
    )
}