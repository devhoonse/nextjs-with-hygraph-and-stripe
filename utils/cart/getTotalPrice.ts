import {CartContextValue} from "@/lib/context/Cart";
import {Product} from "@/shared/types/product";

/**
 * 현재 카트에 담긴 상품 목록과 각 상품별 종류 정보를 전달받으면
 * 전체 구매 비용을 계산해 줍니다.
 * @param cart
 * @param products
 */
function getTotalPrice(cart: CartContextValue['items'], products: Array<Product>) {

  /*
    현재 장바구니에 담긴 상품의 종류가 0 개라는 것은,
    장바구니가 비었다는 의미이므로, 0 을 반환합니다.
   */
  if (products.length === 0) return 0;

  // 장바구니에 담긴 상품들의 전체 구매 비용을 계산하여 반환합니다.
  return Object.keys(cart)
    .map((productID) => products.find((productInfo) => productInfo.id === productID))
    .map((productInfo) => productInfo!.price * cart[productInfo!.id] / 100)
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    .toFixed(2);
}
export default getTotalPrice;
