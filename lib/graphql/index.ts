import { GraphQLClient } from "graphql-request";

// 환경 변수에 저장한 설정 값들을 읽어 옵니다.
const GRAPHCMS_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
const GRAPHCMS_API_KEY = process.env.GRAPHCMS_API_KEY;

/**
 * GraphCMS 로 API 요청 시
 * HTTP 헤더의 Authorization 에 넣을 인증 토큰입니다.
 */
const authorization = `Bearer ${GRAPHCMS_API_KEY}`;

/**
 * GraphCMS 의 GraphQL API 에 접속하는 클라이언트입니다.
 */
const graphqlClient = new GraphQLClient(GRAPHCMS_ENDPOINT!, {
  headers: {
    ...(GRAPHCMS_API_KEY && {
      authorization
    })
  }
});
export default graphqlClient;
