import type { AppProps } from 'next/app'
import {useState} from "react";
import {ChakraProvider, Flex, Box} from "@chakra-ui/react";
import CartContext, {cartContextInitial, CartContextValue} from "@/lib/context/Cart";
import NavBar from "@/components/NavBar";
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {

  /*
    어플리케이션 전역 장바구니 상태를 관리합니다.
   */
  const [items, setItems] = useState<CartContextValue['items']>(cartContextInitial.items);

  // 전역 어플리케이션 컴포넌트 구조
  return (
    <ChakraProvider>
      <CartContext.Provider value={{ items, setItems }} >
        <Flex w="full" minH="100vh" bgColor="gray.100">
          <NavBar />
          <Box maxW="70vw" m="auto">
            <Component {...pageProps} />
          </Box>
        </Flex>
      </CartContext.Provider>
    </ChakraProvider>
  );
}
