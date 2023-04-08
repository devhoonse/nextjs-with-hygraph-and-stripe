import type { GetStaticProps } from "next";
import { Grid } from "@chakra-ui/react";
import type {Product} from "@/shared/types/product";
import graphql from "@/lib/graphql";
import getAllProducts from "@/lib/graphql/queries/getAllProducts";
import ProductCard from "@/components/ProductCard";

/**
 * 메인 페이지 컴포넌트 props 목록
 * * products : 전체 상품 목록
 */
type HomeProps = {
  products: Array<Product>;
};

/**
 * (SSG + ISR 방식 사용)
 * 빌드 시점에 정적 페이지를 렌더링하기 전에 실행할 함수입니다.
 */
export const getStaticProps: GetStaticProps = async () => {

  /*
    GraphCMS 의 GraphQL API 로 전체 상품 목록을 요청합니다.
   */
  const { products } = await graphql.request(getAllProducts) as HomeProps;

  // 메인 페이지 컴포넌트로 넘겨줄 props 를 반환합니다.
  return {
    revalidate: 60, // 60 초마다 페이지를 재빌드 합니다. (ISR 설정)
    props: {
      products
    }
  }
};

/**
 * 페이지 : /
 * @constructor
 */
export default function Home({ products }: HomeProps) {
  return (
    <Grid
      gap={5}
      gridTemplateColumns="repeat(4, 1fr)"
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </Grid>
  )
}
