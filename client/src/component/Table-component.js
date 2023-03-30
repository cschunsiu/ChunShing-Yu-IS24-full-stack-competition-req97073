import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useContext} from "react";
import {GlobalContext} from '../util/global-context';
import {ACTION_TYPE} from "../util/constant";
import {isEmpty} from "lodash";

export default function DataTable(props) {
    const { setSelection, setShowOverlayState } = props;
    const { data = []} = useContext(GlobalContext);

    // table row click event handling to activate form component
    const rowOnClick = (id) => {
        setShowOverlayState(true);
        data.map(product => {
            if (product.productId === id) {
                setSelection({
                    type: ACTION_TYPE.EDIT,
                    product
                });
            }
        })
    }

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 700 }} aria-label="simple table">
                <TableHead>
                    {isEmpty(data) ?
                        <TableRow></TableRow>
                        :
                        <TableRow>
                            <TableCell style={{fontWeight: 'bold', fontSize: 15}}>Number</TableCell>
                            <TableCell style={{fontWeight: 'bold', fontSize: 15}}>Name</TableCell>
                            <TableCell style={{fontWeight: 'bold', fontSize: 15}}>Product Owner</TableCell>
                            <TableCell style={{fontWeight: 'bold', fontSize: 15}}>Developers</TableCell>
                            <TableCell style={{fontWeight: 'bold', fontSize: 15}}>Scrum Master</TableCell>
                            <TableCell style={{fontWeight: 'bold', fontSize: 15}}>Start Date</TableCell>
                            <TableCell style={{fontWeight: 'bold', fontSize: 15}}>Methodology</TableCell>
                        </TableRow>
                    }
                </TableHead>
                <TableBody>
                    {isEmpty(data) &&
                        <TableRow><TableCell align='center'>No Data</TableCell></TableRow>
                    }
                    {data.map((row) => (
                        <TableRow
                            hover={true}
                            onClick={() => rowOnClick(row.productId)}
                            key={row.productId}
                        >
                            <TableCell>{row.productId}</TableCell>
                            <TableCell component="th" scope="row">
                                {row.productName}
                            </TableCell>
                            <TableCell>{row.productOwnerName}</TableCell>
                            <TableCell>
                                <div>
                                    {row.developers && row.developers.map((dev, index) => (
                                        <div key={dev}>{index+1}. {dev}</div>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>{row.scrumMasterName}</TableCell>
                            <TableCell>{row.startDate}</TableCell>
                            <TableCell>{row.methodology}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}