import type {NextApiHandler} from "next";
import Stripe from "stripe";
import type {Product} from "@/shared/types/product";
import graphql from "@/lib/graphql";
import getProductsByIDs from "@/lib/graphql/queries/getProductsByIDs";

/**
 * Stripe 클라이언트 객체
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15'
});

/**
 * Stripe 세션 생성에 필요한 정보 구조를 확인합니다.
 */
type SessionCreateParams = Parameters<typeof stripe.checkout.sessions.create>[0];
type LineItems = SessionCreateParams['line_items'];
type ShippingAddressCollection = SessionCreateParams['shipping_address_collection'];
type ShippingOptions = SessionCreateParams['shipping_options'];

/**
 * 배송이 가능한 지역 정보입니다.
 */
export const shipping_address_collection: ShippingAddressCollection = {
  allowed_countries: ['KR'],
};

/**
 * 배송 방식별 배송비 정책 정보입니다.
 */
export const shipping_options: ShippingOptions = [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: 0,
        currency: 'EUR',
      },
      display_name: 'Free Shipping',
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 3,
        },
        maximum: {
          unit: 'business_day',
          value: 5,
        },
      },
    },
  },
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: 499,
        currency: 'EUR',
      },
      display_name: 'Next day air',
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 1,
        },
        maximum: {
          unit: 'business_day',
          value: 1,
        },
      },
    },
  },
];

/**
 * API : /api/checkout
 *
 * 구매하려는 상품 목록들을 구매하기 위한 Stripe 결제 세션을 생성하고,
 * 생성된 결제 세션 정보를 클라이언트로 응답합니다.
 * @param request
 * @param response
 */
const handler: NextApiHandler = async (request, response) => {

  /*
    요청 본문에서 items 값을 읽어옵니다.
   */
  const { items } = request.body;

  /*
    읽어온 items 값으로 GraphQL API 에 질의를 보냅니다.
   */
  const { products } = await graphql.request(getProductsByIDs, {
    ids: Object.keys(items)
  }) as {
    products: Array<Product>;
  };

  /**
   * 구매 처리할 모든 상품들의 정보입니다.
   */
  const line_items: LineItems = products.map((productInfo) => ({
    quantity: items[productInfo.id],
    adjustable_quantity: {
      enabled: true,
      minimum: 1
    },
    price_data: {
      currency: 'EUR',
      unit_amount: productInfo.price,
      product_data: {
        name: productInfo.name,
        images: productInfo.images.map((image) => image.url)
      }
    },
  }));

  /**
   * Stripe 결제 세션을 요청합니다.
   */
  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'sepa_debit'],
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/cancel`,
    line_items,
    shipping_options,
    shipping_address_collection
  });

  // Stripe 결제 세션 정보를 응답합니다.
  response.status(201).json({ stripeSession });
};
export default handler;
