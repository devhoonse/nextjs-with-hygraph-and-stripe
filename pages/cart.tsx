import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {Box, Button, Divider, Flex, Text} from "@chakra-ui/react";
import {Product} from "@/shared/types/product";
import graphql from "@/lib/graphql";
import {getStripe} from "@/lib/stripe";
import CartContext from "@/lib/context/Cart";
import getProductsByIDs from "@/lib/graphql/queries/getProductsByIDs";
import getTotalPrice from "@/utils/cart/getTotalPrice";

/**
 * 페이지 : /cart
 * @constructor
 */
function CartPage() {

  /*
    어플리케이션 전역 장바구니 상태 관련 값들을 읽어옵니다.
   */
  const { items } = useContext(CartContext);

  /*
    현재 장바구니에 담겨 있는 상품들의 종류 정보를 관리합니다.
   */
  const [products, setProducts] = useState<Array<Product>>([]);

  /**
   * 장바구니에 최소 1 종류의 상품이라도 들어 있는지 여부를 확인합니다.
   */
  const hasProducts = Object.keys(items).length > 0;

  /**
   * 결제 API (/api/checkout) 를 호출하여 Stripe 로 결제 요청을 전송합니다.
   */
  const handlePayment = async () => {

    /**
     * Stripe 클라이언트를 불러옵니다.
     */
    const stripe = await getStripe();

    /**
     * POST /api/checkout { items } 요청에 대한 응답입니다.
     */
    const checkoutResponse = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items
      })
    });

    /*
      생성된 Stripe 결제 세션 정보를 읽어옵니다.
     */
    const { stripeSession } = await checkoutResponse.json();

    /*
      결제 세션에 대한 결제 페이지로 이동합니다.
     */
    await stripe?.redirectToCheckout({
      sessionId: stripeSession.id
    });
  };

  /*
    페이지 컴포넌트가 브라우저에 처음 마운트되었을 때 실행할 동작입니다.
    현재 장바구니에 담겨 있는 상품들의 종류 정보들을 요청합니다.
   */
  useEffect(() => {
    // 상품이 한 종류도 담겨 있지 않다면, 요청을 전송하지 않습니다.
    if (!hasProducts) return;

    graphql.request(getProductsByIDs, { ids: Object.keys(items) })
      .then((data: any) => { // fixme: do not use any!
        setProducts(data.products); // 서버로부터 응답 받은 상품 종류 정보들을 받아옵니다.
      })
      .catch((error) => {
        console.error('error occurred while fetching product information. : ', error);
      })
  }, [hasProducts, items]);

  // 페이지 컴포넌트 구조
  return (
    <Box
      p={16}
      w="container.lg"
      rounded="xl"
      boxShadow="2xl"
      bgColor="white"
    >
      <Text
        as="h1"
        fontSize="2xl"
        fontWeight="bold"
        textColor="gray.700"
      >
        Cart
      </Text>
      <Divider my={10} borderColor="gray.500" />
      {JSON.stringify(products)}
      <Box>
        {!hasProducts ? (
          <Text>The Cart is Empty.</Text>
        ) : (
          <>
            {products.map((productInfo) => (
              <Flex
                key={productInfo.id}
                justifyContent="space-between"
                mb={4}
              >
                <Box>
                  <Link passHref href={`/product/${productInfo.slug}`}>
                    <Text
                      fontWeight="bold"
                      textColor="gray.500"
                      _hover={{
                        textDecoration: 'underline',
                        color: 'blue.500'
                      }}
                    >
                      {productInfo.name}
                      <Text
                        as="span"
                        color="gray.500"
                      >
                        {' '}
                        x{items[productInfo.id]}
                      </Text>
                    </Text>
                  </Link>
                </Box>
                <Box textColor="gray.700">
                  €{(productInfo.price * items[productInfo.id] / 100).toFixed(2)}
                </Box>
              </Flex>
            ))}
            <Divider my={10} />
            <Flex
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                textColor="gray.900"
              >
                Total: €
                {getTotalPrice(items, products)}
              </Text>
              <Button
                colorScheme="blue"
                onClick={handlePayment}
              >
                Pay Now
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
}
export default CartPage;
