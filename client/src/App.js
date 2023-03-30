import './App.css';
import WebFont from 'webfontloader';
import {useEffect, useState} from "react";
import styled from 'styled-components';
import { ApiService } from './service/api-service';
import InteractionPanel from "./component/InteractionPanel-component";
import DataTable from "./component/Table-component";
import {GlobalContext} from "./util/global-context";
import Form from "./component/Form-component";
import * as React from "react";
import {Alert} from "@mui/material";
import {isEmpty} from "lodash";
import {MSG_TYPE} from "./util/constant";

function App() {
    const [data, setData] = useState([]);
    const [msg, setMsg] = useState({});
    const [showOverlayState, setShowOverlayState] = useState(false);
    const [selection, setSelection] = useState();

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Droid Sans']
            }
        });
    }, []);

    useEffect(() => {
        // fetch product list when app init
        async function fetchData() {
            const response = await ApiService.getProducts();
            setData(response);
        }
        fetchData();
    }, []);

    return (
        <GlobalContext.Provider value={{
            data,
            setData,
            msg,
            setMsg
        }}>
            <MainContainer>
                <SubContainer>
                    {!isEmpty(msg) &&
                        <AlertContainer>
                            {
                                msg.type === MSG_TYPE.SUCCESS ?
                                <Alert severity="success" onClose={() => setMsg({})}>{msg.value}</Alert>
                                :
                                <Alert severity="error" onClose={() => setMsg({})}>{msg.value}</Alert>
                            }
                        </AlertContainer>
                    }
                    {showOverlayState === true &&
                        <Form
                            selection={selection}
                            setShowOverlayState={setShowOverlayState}
                        />
                    }
                    <h1>Product Catalog</h1>
                    <InteractionPanel
                        setSelection={setSelection}
                        setShowOverlayState={setShowOverlayState}/>
                    <div>**Please click on the row to edit**</div>
                    <DataTable
                        setSelection={(obj) => setSelection(obj)}
                        setShowOverlayState={(value) => setShowOverlayState(value)}/>
                </SubContainer>
            </MainContainer>
        </GlobalContext.Provider>
    );
}

const MainContainer = styled.div`
    flex: 1;
    display: flex;
    font-family: "Droid Sans";
    background-color: rgb(238,242,247);
    padding: 3%;
`;

const SubContainer = styled.div`
    flex: 1;
    background-color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 30px;
`;

const AlertContainer = styled.div`
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

export default App;
