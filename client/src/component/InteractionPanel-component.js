import * as React from 'react';
import {useState, useContext} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from "styled-components";
import { GlobalContext } from "../util/global-context";
import {ACTION_TYPE, MSG_TYPE} from "../util/constant";
import {FormControlLabel, FormGroup, Radio, RadioGroup} from "@mui/material";
import { ApiService } from '../service/api-service';

export default function InteractionPanel(props) {
    const { setShowOverlayState, setSelection } = props;
    const { data, setData, setMsg } = useContext(GlobalContext);
    const [searchType, setSearchType] = useState('scrumMasterName');
    const [searchTerm, setSearchTerm] = useState('');

    // search event submission handling
    const searchSubmit = async () => {
        try {
            const products = await ApiService.searchProduct({type: searchType, term: searchTerm});
            setData(products);
        } catch (err) {
            setMsg({
                type: MSG_TYPE.ERROR,
                value: err.message
            });
        }
    };

    return (
        <MainContainer>
            <div>Total Records: {data.length}</div>
            <SearchContainer>
                <TextField id="outlined-basic" label="Search" variant="outlined" onChange={(e) => setSearchTerm(e.target.value)}/>
                By
                <FormGroup>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={searchType}
                        name="radio-buttons-group"
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <FormControlLabel value="scrumMasterName" control={<Radio />} label="Scrum Master" />
                        <FormControlLabel value="developers" control={<Radio />} label="Developer" />
                    </RadioGroup>
                </FormGroup>
                <Button variant="contained" onClick={searchSubmit}>Search</Button>
            </SearchContainer>
            <div>
                <Button variant="contained" onClick={() => {
                    setShowOverlayState(true);
                    setSelection({
                        type: ACTION_TYPE.CREATE,
                        product: {}
                    });
                }}>Add</Button>
            </div>
        </MainContainer>
    )
}

const MainContainer = styled.div`
    height: 10%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SearchContainer = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
`;