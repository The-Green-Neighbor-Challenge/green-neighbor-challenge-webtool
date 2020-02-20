import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-flow: column nowrap;
`;

const InputRow = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    margin: 8px;
    height: max-content;
    width: auto;
`;

const FlexRow = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    margin: 0px 4px;
`;

const Input = styled.div`
    white-space: nowrap;
    & > * {
        margin: 0px 4px;
    }
    margin: 4px calc(2px + 1%);
    height: max-content;
    width: max-content;
`;

const InputGrid = styled.form`
    margin: 4px 8px;
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-auto-rows: max-content;
    grid-gap: 4px;
`;

const PercentOptionsGrid = styled.div`
    margin: 4px 8px;
    display: grid;
    grid-template-columns: max-content min-content;
    grid-auto-rows: max-content;
    grid-gap: 4px;
`;

const BlocksTableContainer = styled.div`
    justify-self: flex-end;
`;

const BlocksTable = styled.table`
    min-width: 10rem;
    th, td {
        text-align: center;
    }
    th {
        padding: auto 1rem;
    }
`;

export default function PricingForm(props){
    const dispatch = useDispatch();
    const form = useSelector(state => state.submissionFormReducer);

    const [costKwh, setCostKwh] = useState(form.cost_kwh || '');
    const formCostRange = (form.cost_range && form.cost_range.split('-')) || ['', ''];
    const [costRangeMin, setCostRangeMin] = useState(formCostRange[0]);
    const [costRangeMax, setCostRangeMax] = useState(formCostRange[1]);
    const [costIsRange, setCostIsRange] = useState(form.cost_range ? 1 : 0);
    const [creditYesNo, setCreditYesNo] = useState(form.credit_yn || 'No');
    const [creditKwh, setCreditKwh] = useState(form.credit_kwh || '');
    const [blocksAvailable, setBlocksAvailable] = useState(form.blocks_available || 'No');
    const [blocksAvailableMinMaxValue, setBlocksAvailableMinMaxValue] = useState(2);
    const [
        blockSizes,
        setBlockSizes
    ] = useState((form.block_size_kwh && form.block_size_kwh.split(';')) || []);
    const [
        blockCosts,
        setBlockCosts
    ] = useState((form.block_cost && form.block_cost.split(';')) || []);
    const [newBlockSizeKwh, setNewBlockSizeKwh] = useState('');
    const [newBlockCost, setNewBlockCost] = useState(''); 
    const [
        percentOptionsOrRange,
        setPercentOptionsOrRange
    ] = useState(form.percentage_range ? 'range' : 'options');
    const [
        percentOptions,
        setPercentOptions
    ] = useState((form.percentage_options && form.percentage_options.split(';')) || []);
    const percentageMinMaxes = (form.percentage_range && form.percentage_range.split('-')) || ['',''];
    const [newPercentOption, setNewPercentOption] = useState('');
    const [percentageMin, setPercentageMin] = useState(percentageMinMaxes[0] || '');
    const [percentageMax, setPercentageMax] = useState(percentageMinMaxes[1] || '');

    const asCurrency = str => str.match(/[0-9]*\.?[0-9]{0,2}/)[0] || '';
    const asInteger = str => str.match(/[0-9]*/)[0] || '';

    const updateSubmissionForm = obj => {
        dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: obj});
    }

    const costModelToggle = e => {
        const value = e.target.value;
        setCostIsRange(Number(value));
        if(value){
            updateSubmissionForm({cost_range: undefined});
        } else {
            updateSubmissionForm({cost_kwh: undefined});
        }
    }

    const updateBlocksAvailable = e => {
        let valueToSend = blocksAvailable;
        if(blocksAvailable === 'Min' || blocksAvailable === 'Max'){
            valueToSend += ` ${blocksAvailableMinMaxValue}`;
        }
        updateSubmissionForm({blocks_available: valueToSend});
    }

    const addBlock = e => {
        e.preventDefault();
        console.log(newBlockSizeKwh, newBlockCost);
        if(newBlockSizeKwh === '' || newBlockCost === '') return;
        blockSizes.push(newBlockSizeKwh);
        blockCosts.push(newBlockCost);

        updateSubmissionForm({
            block_size_kwh: blockSizes.join(';'),
            block_cost: blockCosts.join(';')
        });
        setBlockSizes(blockSizes);
        setBlockCosts(blockCosts);
        setNewBlockSizeKwh('');
        setNewBlockCost('');
    }

    const removeBlock = (index) => {
        blockSizes.splice(index, 1);
        blockCosts.splice(index, 1);
        updateSubmissionForm({
            block_size_kwh: blockSizes.join(';'),
            block_cost: blockCosts.join(';')
        })
        setBlockSizes(blockSizes);
        setBlockCosts(blockCosts);
    }

    const addPercentOption = e => {
        e.preventDefault();
        percentOptions.push(newPercentOption);
        updateSubmissionForm({
            percentage_options: percentOptions.join(';'),
            percentage_range: undefined
        });
        setPercentOptions(percentOptions);
        setNewPercentOption('');
    }

    const removePercentOption = i => {
        percentOptions.splice(i, 1);
        updateSubmissionForm({
            percentage_options: percentOptions.join(';'),
            percentage_range: undefined
        });
        setPercentOptions(percentOptions);
    }

    const setPercentRange = e => {
        e.preventDefault();
        updateSubmissionForm({
            percentage_options: undefined,
            percentage_range: `${percentageMin}-${percentageMax}`
        });
    }

    return (
        <Container>
            <InputRow>
                <Input>
                    <label htmlFor='submission-cost-model'>
                        Cost Model:
                    </label>
                    <select
                        id='submission-cost-model'
                        value={costIsRange}
                        onChange={costModelToggle}
                    >
                        <option value={0}>Per kWh</option>
                        <option value={1}>Range</option>
                    </select>
                </Input>
                {costIsRange ?
                    <>
                        <Input>
                            <label htmlFor='submission-cost-min'>Min: </label>
                            <input
                                type="text"
                                onChange={e => setCostRangeMin(asCurrency(e.target.value))}
                                placeholder='5.00'
                                value={costRangeMin}
                                onBlur={()=>updateSubmissionForm({
                                    cost_range: `${costRangeMin}-${costRangeMax}`
                                })}
                            />
                        </Input>
                        <Input>
                            <label htmlFor='submission-cost-max'>Max: </label>
                            <input
                                type="text"
                                placeholder="10.00"
                                value={costRangeMax}
                                onChange={e => setCostRangeMax(asCurrency(e.target.value))}
                                onBlur={()=>updateSubmissionForm({
                                    cost_range: `${costRangeMin}-${costRangeMax}`
                                })}
                            />
                        </Input>
                    </> :
                    <Input> {/* END costIsRange === true, BEGIN costIsRange===false */}
                        <label htmlFor='submission-cost-kwh'>
                            Cost kWh:
                        </label>
                        <input
                            id='submission-cost-kwh'
                            type="text"
                            placeholder="2.00"
                            value={costKwh}
                            onChange={e => setCostKwh(asCurrency(e.target.value))}
                            step="0.01"
                            onBlur={e => updateSubmissionForm({
                                cost_kwh: costKwh, cost_range: undefined
                            })}
                        />
                    </Input>
                }
            </InputRow>
            <InputRow>
                <Input>
                    <label htmlFor='submission-credit-yn'>Credit: </label>
                    <select
                        value={creditYesNo}
                        onChange={e=>setCreditYesNo(e.target.value)}
                        onBlur={e=>updateSubmissionForm({credit_yn: creditYesNo})}
                    >
                        <option value={'No'}>No</option>
                        <option value={'Yes'}>Yes</option>
                        <option value={'Included'}>Included</option>
                    </select>
                </Input>
                {creditYesNo === 'Yes' && 
                    <Input>
                        <label htmlFor='submission-credit-kwh'>Credit / kWh: </label>
                        <input
                            id='submission-credit-kwh'
                            value={creditKwh}
                            type="text"
                            onChange={e => setCreditKwh(asCurrency(e.target.value))}
                            onBlur={e => updateSubmissionForm({credit_kwh: creditKwh})}
                            placeholder='2.99'
                        />
                    </Input>
                }
            </InputRow>
            <InputRow space={blocksAvailable !== 'No' ? 'space-evenly' : 'flex-start'}>
                <Input>
                    <label htmlFor='submission-blocks-available'>Blocks Available: </label>
                    <select
                        id='submission-blocks-available'
                        value={blocksAvailable}
                        onChange={e=>setBlocksAvailable(e.target.value)}
                        onBlur={updateBlocksAvailable}
                    >
                        <option>No</option>
                        <option>Fixed</option>
                        <option>Any</option>
                        <option>Min</option>
                        <option>Max</option>
                    </select>
                </Input>
                {(blocksAvailable === 'Min' || blocksAvailable === 'Max') && 
                    <Input>
                        <label htmlFor='submission-blocks-available-min-max'>
                            {blocksAvailable} Blocks:&nbsp;
                        </label>
                        <input
                            id='submission-blocks-available-min-max'
                            type='text'
                            value={blocksAvailableMinMaxValue}
                            onChange={e=>{
                                setBlocksAvailableMinMaxValue(asInteger(e.target.value));
                            }}
                            onBlur={updateBlocksAvailable}
                        />
                    </Input>
                }
            {blocksAvailable !== 'No' &&
                <FlexRow>
                    <InputGrid onSubmit={addBlock}>
                        <label htmlFor='submission-add-block'>
                            Block Size (kWh):
                        </label>
                        <input
                            id='submission-add-block'
                            type='text'
                            placeholder='100'
                            value={newBlockSizeKwh}
                            onChange={e=> setNewBlockSizeKwh(asInteger(e.target.value))}
                        />
                        <label htmlFor='submission-add-block-cost'>
                            Block Cost:
                        </label>
                        <input
                            id='submission-add-block-cost'
                            type='text'
                            placeholder='5.00'
                            value={newBlockCost}
                            onChange={e=>{
                                setNewBlockCost(asCurrency(e.target.value));
                            }}
                        />
                        <br />
                        <button
                            type='submit'
                            className='button-default half-padding'
                        >
                            Add Block
                        </button>
                    </InputGrid>
                    <BlocksTableContainer>
                        <BlocksTable className='admin-table'>
                            <thead>
                                <tr>
                                    <th>Size (kWh)</th>
                                    <th>Cost</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                            {blockSizes.length ? blockSizes.map((blockSize, i) => 
                                <tr key={i}>
                                    <td>
                                        {blockSize}
                                    </td>
                                    <td>
                                        {blockCosts[i]}
                                    </td>
                                    <td>
                                        <button key={i} onClick={()=>removeBlock(i)} >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ) : <tr><td colSpan={3}>No Blocks Added</td></tr>}
                            </tbody>
                        </BlocksTable>
                    </BlocksTableContainer>
                </FlexRow>
            }
            </InputRow>
            <InputRow>
                <Input>
                    <label htmlFor='submission-percent-model'>
                        Percentage Model:
                    </label>
                    <select
                        value={percentOptionsOrRange}
                        onChange={e => setPercentOptionsOrRange(e.target.value)}
                    >
                        <option value={'options'}>Options</option>
                        <option value={'range'}>Range</option>
                    </select>
                </Input>
                {percentOptionsOrRange === 'options' ?
                    <FlexRow>
                        <InputGrid onSubmit={addPercentOption}>
                            <label htmlFor='submission-percent-block'>
                                Add Option:
                            </label>
                            <input
                                id='submission-percent-block'
                                type='text'
                                placeholder='100'
                                value={newPercentOption}
                                onChange={e=>setNewPercentOption(asInteger(e.target.value))}
                            />
                            <br />
                            <button className='button-default half-padding nowrap'>
                                Add Option
                            </button>
                        </InputGrid>
                        <PercentOptionsGrid>
                            {percentOptions.map((option, i) =>
                                <React.Fragment key={i}>
                                    <div>{option}</div>
                                    <button onClick={()=>removePercentOption(i)}>
                                        Remove
                                    </button>
                                </React.Fragment>
                            )}
                        </PercentOptionsGrid>
                    </FlexRow>
                    : // END percentageOptionsRange
                    <FlexRow>
                        <Input>
                            <label htmlFor='submission-percent-min'>
                                Min:
                            </label>
                            <input
                                id='submission-percent-min'
                                type='text'
                                placeholder='50'
                                value={percentageMin}
                                onChange={e => setPercentageMin(asInteger(e.target.value))}
                                onBlur={setPercentRange}
                            />
                        </Input>
                        <Input>
                            <label htmlFor='submission-percent-max'>
                                Max:
                            </label>
                            <input
                                id='submission-percent-max'
                                type='text'
                                placeholder='100'
                                value={percentageMax}
                                onChange={e => setPercentageMax(asInteger(e.target.value))}
                                onBlur={setPercentRange}
                            />
                        </Input>
                    </FlexRow>
                }
            </InputRow>
        </Container>
    );
}