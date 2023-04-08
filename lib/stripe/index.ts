import { loadStripe } from "@stripe/stripe-js";

/**
 * Stripe 계정에 발급된 공유 키를 읽어옵니다.
 */
const key = process.env.NEXT_PUBLIC_STRIPE_SHARABLE_KEY || 'if-not-found';

let stripePromise: ReturnType<typeof loadStripe>;

/**
 * Stripe 를 불러오거나, 기존에 이미 불러온 Stripe 의 참조를 반환합니다.
 * 장바구니 페이지를 여러 번 방문하더라도, Stripe 를 딱 한 번만 불러오도록 설계되었습니다.
 */
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
