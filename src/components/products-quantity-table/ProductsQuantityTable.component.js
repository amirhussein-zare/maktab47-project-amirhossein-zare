import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from '@material-ui/core';
import { Link } from "react-router-dom"
import axios from "axios"
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
    container:{
        margin:'20px auto 0',
        height:600,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tableHeading:{
        backgroundColor:'var(--light-face)'
    },
    tableRow1:{
        backgroundColor:'#cfba93'
    },
    tableRow2:{
        backgroundColor:'var(--light-face)'
    },
    table: {
        minWidth: 650,
    },
});

export default function QuantityTable() {
    const classes = useStyles();
    const [productsState, setProductsState] = useState([])
    const [pageState, setPageState] = useState({perpage:5,page:1})
    const [pagesCountState, setPagesCount] = useState(null)

    const handleChange = async (event, newPage) => {
        setPageState({...pageState,page:newPage})
    };

    useEffect( async ()=>{
        try {
            const response = await axios.get('http://localhost:3001/products', {params:{_page:1, _limit:5}})
            const products = response.data
            await setProductsState(products)

            const productsCount = response.headers['x-total-count']
            const pagesCount = Math.ceil( productsCount / pageState.perpage )
            console.log(productsCount, response.headers)
            setPagesCount(pagesCount)

        } catch (error) {
            console.log(error)
        }
    }, [])

        
    useEffect( async ()=>{
        const { page } = pageState
        const response = await axios.get('http://localhost:3001/products', {params:{_page:page, _limit:5}})
        setProductsState(response.data)
    }, [pageState])

    return (
        <Grid item lg={8} md={10} sm ={10} xs={10} className={classes.container}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead className={classes.tableHeading}>
                        <TableRow>
                            <TableCell align="right">موجودی</TableCell>
                            <TableCell align="right">قیمت</TableCell>
                            <TableCell align="right">کالا</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productsState.map((row, index) => {
                            const { id, name, price, quantity } = row
                            return (
                                <TableRow className={index%2===0? classes.tableRow1 : classes.tableRow2} key={id}>
                                    <TableCell align="right">{quantity}</TableCell>
                                    <TableCell align="right" component="th" scope="row">{price}</TableCell>
                                    <TableCell align="right">{name}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination hidePrevButton hideNextButton showFirstButton showLastButton count={pagesCountState} page={pageState.page} onChange={handleChange} />
        </Grid>
    );
}

export {QuantityTable}