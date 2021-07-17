import {Header} from "../../../layouts/index"
import {Typography, Grid} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import DoneIcon from '@material-ui/icons/Done';
import {useEffect} from 'react'
import {emptyUserCart} from "../../../redux/actions/user.action"
import {connect} from "react-redux"
import order from "../../../model/orders.model"
import {getProduct, patchProduct} from "../../../model/products.model"
import product from "../../../model/products.model"

const useStyles = makeStyles((theme) => ({
    header:{
        width:'70%',
        margin:'30px auto',
        textAlign:'right',
    },
    container:{
        display:'flex',
        width:'50%',
        justifyContent: 'center',
        margin:'auto',
        flexDirection:'row-reverse',
        alignItems: 'center'
    },
    paymentIcon:{
        position:'relative',
        width:'100px', 
        height:'100px',
        borderRadius:'50%',
        backgroundColor:'green',
        marginLeft:'40px'
    },
    paymentIconItem:{
        fill: '#ffff',
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontSize: 'xxx-large',
        transform: 'translate(-50%, -50%)'
    }
}));


function PaymentSuccess(props){

    const classes = useStyles();
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get('order'))

    useEffect(async ()=>{
        try {
            const response = await order.patch(urlParams.get('order'), null, { pay:true })    
            const {products} = response.data
            products.forEach(async product => {
                const response = await product.get(product.id)
                await product.patch(product.id, null, { quantity: +response.data.quantity - +product.count })    
            })
            props.emptyUserCart()
            localStorage.cart = '[]'
        } catch (error) {
            console.log(error)            
        }
    }, [])

    useEffect(async ()=>{
        localStorage.cart = JSON.stringify(props.userCart)
    }, [props.userCart])

    return (
        <div>
            <Header/>
            <Typography variant="h4" className={classes.header}>نتیجه ی پرداخت</Typography>
            <Grid item lg={8} md={10} sm ={10} xs={10} className={classes.container}>
                <div className={classes.paymentIcon}><DoneIcon className={classes.paymentIconItem} /></div>
                <Typography dir="rtl" variant="p" component="p" >با تشکر از پرداخت شما. سفارش شما ثبت شده و جهت هماهنگی ارسال با شما تماس گرفته خواهد شد.</Typography>
            </Grid>
        </div>
    )
}

const mapStateToProps = ({user:{cart}}) => ({userCart:cart})
const mapDispatchToProps = (dispatch) => ({ emptyUserCart:dispatch(emptyUserCart()) })

const PaymentSuccessPage = connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess)
export {PaymentSuccessPage}