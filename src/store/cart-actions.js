import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";
import { firebaseUrl } from "../local";

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(firebaseUrl);
      console.log('response: ', response)
      if (!response.ok) {
        throw new Error("Could not fetch cart data");
      }
      const data = await response.json();
      console.log('data: ', data)
      return data;
    };

    try {
      const cartData = await fetchData();
      console.log('cartData: ', cartData)
     if(cartData && cartData.items) dispatch(cartActions.replaceCart(cartData));
     if(cartData && !cartData.items) dispatch(cartActions.replaceCart({items: [], totalQuantity: 0}))
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Fetching cart data failed  " + error,
        })
      );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(firebaseUrl, {
        method: "PUT",
        body: JSON.stringify(
            {
          items: cart.items,
          totalQuantity: cart.totalQuantity,
        }
        ),
      });
      if (!response.ok) {
        throw new Error("Sending cart data failed");
      }
    };
    try {
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed  " + error,
        })
      );
    }
  };
};
