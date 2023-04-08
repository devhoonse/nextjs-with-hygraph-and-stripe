import Link from "next/link";
import {useContext} from "react";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {MdShoppingCart} from "react-icons/md";
import CartContext from "@/lib/context/Cart";

/**
 * 어플리케이션 상단 내비게이션 바 컴포넌트
 * @constructor
 */
function NavBar() {

  /*
    어플리케이션 전역 장바구니 상태 관련 값들을 읽어옵니다.
   */
  const { items } = useContext(CartContext);

  /**
   * 현재 장바구니에 담겨 있는 상품의 총 수량을 계산합니다.
   */
  const itemCount = Object.values(items)
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

  // 컴포넌트 구조
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="full"
      bgColor="white"
      boxShadow="md"
    >
      <Flex
        m="auto"
        p={5}
        width="container.xl"
        justifyContent="space-between"
      >
        <Link passHref href="/">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            textColor="blue.800"
          >
            My e-Commerce
          </Text>
        </Link>
        <Box>
          <Link passHref href="/cart">
            <Button textColor="black">
              <MdShoppingCart />
              <Text ml={3}>{itemCount}</Text>
            </Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}
export default NavBar;
