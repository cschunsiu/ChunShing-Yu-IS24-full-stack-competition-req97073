import * as React from 'react';
import {useState, useContext, useEffect} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styled from "styled-components";
import { GlobalContext } from "../util/global-context";
import { cloneDeep, isEmpty } from 'lodash';
import CloseIcon from '@mui/icons-material/Close';
import {ACTION_TYPE, MSG_TYPE} from "../util/constant";
import { ApiService } from '../service/api-service';

export default function Form(props) {
    const { setShowOverlayState, selection = {}} = props;
    const { type, product = {}} = selection;
    const [formInput, setFormInput] = useState({
        productOwnerName: '',
        productName: '',
        developers: [],
        scrumMasterName: '',
        startDate: '',
        methodology: '',
        ...product
    });
    const [disableSave, setDisableSave] = useState(true);
    const { setData, setMsg } = useContext(GlobalContext);

    //execute when formInput change
    useEffect(() => {
        // check if form has fields that is unfilled
        let hasEmptyField = false;
        Object.keys(formInput).forEach(key => {
            if (key !== 'productId' && isEmpty(formInput[key])) {
                hasEmptyField = true
            }
        });
        // if formInput is blank, disable save button
        if (isEmpty(formInput)) {
            hasEmptyField = true;
        }
        setDisableSave(hasEmptyField);
    }, [formInput]);

    // text field input event handling and set formInput
    const handleInput = evt => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setFormInput({ ...formInput, [name]: newValue });
    };

    // handle enter key press when developer name is entered
    const handleKey = e => {
        const newValue = e.target.value;
        if(e.key === 'Enter') {
            const devArr = isEmpty(formInput.developers) ? [] : cloneDeep(formInput.developers);
            devArr.push(newValue);
            setFormInput({ ...formInput, developers: devArr});
            e.target.value = '';
        }
    }

    // when developer name is clicked, remove it
    const tagOnClick = index => {
        const devArr = cloneDeep(formInput.developers);
        devArr.splice(index, 1);
        setFormInput({ ...formInput, developers: devArr});
    }

    // form submission for Update or Create
    const handleSubmit = async () => {
        try {
            if (type === ACTION_TYPE.EDIT) {
                await ApiService.editProduct(formInput);
            }
            if (type === ACTION_TYPE.CREATE) {
                await ApiService.addProduct(formInput);
            }
            // after updated or created, refresh list of products
            const products = await ApiService.getProducts();
            setData(products);
            // send in message to notify user
            setMsg({
                type: MSG_TYPE.SUCCESS,
                value: type === ACTION_TYPE.EDIT ? 'Product Updated!' : 'Product Created!'
            });
        } catch (err) {
            setMsg({
                type: MSG_TYPE.ERROR,
                value: err.message
            });
        } finally {
            setShowOverlayState(false);
        }
    };

    // delete button click event
    const deleteClicked = async () => {
        try {
            await ApiService.deleteProduct(formInput);
            const products = await ApiService.getProducts();
            setData(products);
            setMsg({
                type: MSG_TYPE.SUCCESS,
                value: 'Product Deleted'
            });
        } catch (err) {
            setMsg({
                type: MSG_TYPE.ERROR,
                value: err.message
            });
        } finally {
            setShowOverlayState(false);
        }
    }

    return (
        <MainContainer>
            <SubContainer>
                <h3 style={{ paddingInline: '20px'}}>{type === ACTION_TYPE.EDIT ? 'Edit' : 'Create'}</h3>
                <Content onSubmit={handleSubmit}>
                    <div style={{ columnGap: '20px', display: 'flex', flex: 1}}>
                        <TextField
                            error={isEmpty(formInput.productName)}
                            label="Product Name"
                            name="productName"
                            defaultValue={formInput.productName}
                            onChange={handleInput}
                            style={{ width: '100%'}}
                        />
                        <TextField
                            error={isEmpty(formInput.productOwnerName)}
                            label="Product Owner Name"
                            name="productOwnerName"
                            defaultValue={formInput.productOwnerName}
                            onChange={handleInput}
                            style={{ width: '100%'}}
                        />
                    </div>
                    <div style={{ columnGap: '20px', display: 'flex', flex: 1}}>
                        <TextField
                            error={isEmpty(formInput.scrumMasterName)}
                            label="Scrum Master Name"
                            name="scrumMasterName"
                            defaultValue={formInput.scrumMasterName}
                            onChange={handleInput}
                            style={{ width: '100%'}}
                        />
                        <TextField
                            error={isEmpty(formInput.startDate)}
                            label="Start Date"
                            name="startDate"
                            defaultValue={formInput.startDate}
                            helperText="e.g. YYYY/MM/DD"
                            onChange={handleInput}
                            style={{ width: '100%'}}
                        />
                    </div>
                    <div style={{ columnGap: '20px', display: 'flex', flex: 1}}>
                        <TextField
                            error={isEmpty(formInput.methodology)}
                            label="Methodology"
                            name="methodology"
                            defaultValue={formInput.methodology}
                            onChange={handleInput}
                            style={{ width: '100%'}}
                        />
                        <div style={{ width: '100%'}}/>
                    </div>
                    <div style={{ columnGap: '20px', display: 'flex', flex: 1}}>
                        <TextField
                            disabled={(formInput.developers && formInput.developers.length >= 5)}
                            label="Developers"
                            name="developers"
                            helperText={(formInput.developers && formInput.developers.length >= 5 ? "Maximum Developers are 5" : "Please enter Developer name and press enter")}
                            onKeyDown={handleKey}
                            style={{ width: '100%'}}
                        />
                        <TagContainer>
                            {formInput.developers && formInput.developers.map((dev, index) => {
                                return(
                                    <Tag key={dev} onClick={() => tagOnClick(index)}>{dev} <CloseIcon /></Tag>
                                )
                            })}
                        </TagContainer>
                    </div>
                </Content>
                <Footer>
                    <Button variant="contained" color="success" onClick={handleSubmit} disabled={disableSave}>Save</Button>
                    <Button variant="contained" onClick={() => setShowOverlayState(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={deleteClicked} disabled={type === ACTION_TYPE.CREATE}>Delete</Button>
                </Footer>
            </SubContainer>
        </MainContainer>
    )
}

const MainContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const SubContainer = styled.div`
    width: 60%;
    height: 60%;
    background-color: white;
    display: flex;
    justify-content: center;
    border-radius: 30px;
    flex-direction: column;
`;

const Footer = styled.div`
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

const Content = styled.form`
    flex: 8;
    display: flex;
    flex-direction: column;
    padding-inline: 20px;
`;

const TagContainer = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    column-gap: 10px;
`;

const Tag = styled.div`
    background: #1976d2;
    color: white;
    height: fit-content;
    padding-inline: 7px;
    padding-block: 5px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    display: flex;
`;