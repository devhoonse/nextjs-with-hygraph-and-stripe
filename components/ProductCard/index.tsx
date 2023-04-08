import Link from 'next/link';
import { Box, Text, Image, Divider } from "@chakra-ui/react";
import type {Product} from "@/shared/types/product";

/**
 * 상품 목록 내 개별 상품 정보 카드 컴포넌트
 * @constructor
 */
function ProductCard({ name, slug, price, images }: Product) {

  // 컴포넌트 구조
  return (
    <Link passHref href={`/product/${slug}`}>
      <Box
        border="1px"
        borderColor="gray.200"
        px={10}
        py={5}
        rounded="lg"
        boxShadow="lg"
        bgColor="white"
        transition="ease 0.2s"
        _hover={{
          boxShadow: 'xl',
          transform: 'scale(1.02)'
        }}
      >
        <Image
          src={images[0]?.url}
          alt={name}
        />
        <Divider my={3} />
        <Box>
          <Text
            fontSize="lg"
            fontWeight="bold"
            textColor="purple"
          >
            {name}
          </Text>
          <Text textColor="gray.700">
            €{price/100}
          </Text>
        </Box>
      </Box>
    </Link>
  );
}
export default ProductCard;
