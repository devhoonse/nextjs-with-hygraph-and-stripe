import type {Dispatch, SetStateAction} from "react";
import {createContext} from "react";

/**
 * 장바구니 컨텍스트의 상태 데이터 구조
 * * items :
 * * setItems :
 */
export type CartContextValue = {
  items: Record<string, number>;
  setItems: Dispatch<SetStateAction<CartContextValue['items']>>;
};

/**
 * 장바구니 컨텍스트의 초기값
 */
export const cartContextInitial: CartContextValue = {
  items: {},
  setItems: () => {}
};

/**
 * 장바구니 컨텍스트 객체
 */
const CartContext = createContext<CartContextValue>(cartContextInitial);
export default CartContext;
