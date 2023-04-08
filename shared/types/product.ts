/**
 * 상품 이미지 정보 구조
 * * id : 상품 이미지 ID
 * * url : 상품 이미지 URL
 */
type ProductImage = {
  id: string;
  url: string;
};

/**
 * 상품 정보 구조
 * * id : 상품 ID
 * * name : 상품 이름
 * * slug : 상품 이름 slug
 * * price : 상품 가격
 * * images : 상품 이미지 목록
 */
export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: Array<ProductImage>;
};
