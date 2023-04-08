import {GetStaticPaths, GetStaticProps} from "next";
import {useContext, useState} from "react";
import {Box, Button, Divider, Flex, Grid, Image, Text} from "@chakra-ui/react";
import type {Product} from "@/shared/types/product";
import graphql from "@/lib/graphql";
import getAllProducts from "@/lib/graphql/queries/getAllProducts";
import getProductDetail from "@/lib/graphql/queries/getProductsBySlug";
import CartContext from "@/lib/context/Cart";
import SelectQuantity from "@/components/SelectQuantity";

/**
 * 개별 상품 페이지 컴포넌트 props 목록
 * * product : 개별 상품 상세 정보
 */
type ProductPageProps = {
  product: Product;
};

/**
 * (SSG + ISR 방식 사용)
 * * 개별 상품 페이지를 미리 생성해 두어야 할 상품 목록을 정의합니다.
 * * Next.js 빌드 시점에 생성하지 않은 페이지에 접근하려 하면, 404 페이지를 표시하도록 설정합니다.
 */
export const getStaticPaths: GetStaticPaths = async () => {

  /*
    GraphCMS 의 GraphQL API 로 전체 상품 목록을 요청합니다.
   */
  const { products } = await graphql.request(getAllProducts) as {
    products: Array<Product>;
  };

  /**
   * 개별 상품 페이지를 미리 생성해 두어야 할 상품 목록들 (전체 다 만듭니다.)
   */
  const paths: Awaited<ReturnType<GetStaticPaths>>['paths'] = products.map((product) => ({
    params: {
      slug: product.slug
    }
  }));

  /*
    Next.js 로 정적 페이지 설정을 전달합니다.
   */
  return {
    paths,
    fallback: false // 404 페이지 응답 설정
  };
};

/**
 * (SSG + ISR 방식 사용)
 * 빌드 시점에 정적 페이지를 렌더링하기 전에 실행할 함수입니다.
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {

  /*
    GraphCMS 의 GraphQL API 로 현재 상품의 상세 정보를 요청합니다.
   */
  const { products } = await graphql.request(getProductDetail, { slug: params!.slug }) as {
    products: Array<Product>;
  };

  // 메인 페이지 컴포넌트로 넘겨줄 props 를 반환합니다.
  return {
    props: {
      product: products[0]
    }
  };
};

/**
 * 페이지 : /product/${slug}
 * @constructor
 */
function ProductPage({ product }: ProductPageProps) {

  /*
    어플리케이션 전역 장바구니 상태 관련 값들을 읽어옵니다.
   */
  const { items, setItems } = useContext(CartContext);

  /*
    현재 상품 페이지에서 선택한 수량 값 상태를 관리합니다.
   */
  const [quantity, setQuantity] = useState(0);

  /**
   * 현재 상품의 ID 값이 장바구니에 담겨 있는지 여부를 확인합니다.
   */
  const alreadyInCart = product.id in items;

  /**
   * 현재 상품을 설정된 수량만큼 장바구니에 담습니다.
   */
  const addToCart = () => {
    setItems(prevState => ({
      ...prevState,
      [product.id]: quantity
    }));
  };

  // 페이지 컴포넌트 구조
  return (
    <Flex
      w="full"
      p={16}
      bgColor="white"
      rounded="xl"
      boxShadow="2xl"
    >
      <Image
        height={96}
        width={96}
        alt={product.name}
        src={product.images[0].url}
      />
      <Box
        ml={12}
        width="container.xs"
      >
        <Text
          as="h1"
          fontSize="4xl"
          fontWeight="bold"
          textColor="black"
        >
          {product.name}
        </Text>
        <Text
          my={3}
          lineHeight="none"
          fontSize="xl"
          fontWeight="bold"
          textColor="blue.500"
        >
          €{product.price/100}
        </Text>
        <Text
          maxW={96}
          textAlign="justify"
          fontSize="sm"
          textColor="gray.700"
        >
          {product.description}
        </Text>
        <Divider my={6} />
        <Grid
          gap={5}
          alignItems="center"
          gridTemplateColumns="2fr 1fr"
        >
          <SelectQuantity
            quantities={10}
            onChange={(value) => setQuantity(parseInt(value))}
          />
          <Button
            colorScheme="blue"
            onClick={addToCart}
          >
            {alreadyInCart ? 'Update' : 'Add to Cart'}
          </Button>
        </Grid>
      </Box>
    </Flex>
  );
}
export default ProductPage;
