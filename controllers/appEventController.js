const customerController = require('./customerController')

module.exports = async (req,res,next) => {

    const { payload } = req.body;

    //handle subscribe events
    SubscribeEvents(payload);
    
    console.log("============= Shopping ================");
    console.log(payload);
    res.json(payload);

    async function SubscribeEvents(payload){
    
        console.log('Triggering.... Customer Events')

        //payload = JSON.parse(payload)

        const { event, data } =  payload;

        //const { userId, product, order, qty } = data;

        const {_id} = data

        switch(event){
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId,product)
                break;
            case 'ADD_TO_CART':
                //this.ManageCart(userId,product, qty, false);
                customerController.addToCart(payload)
                console.log('product added to cart _id');
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product,qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId,order);
                break;
            case 'testing_event':
                console.log('just testing');
            default:
                break;
        }
    
    }
};
