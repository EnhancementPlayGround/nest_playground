// 단위 테스트에서는 트랜잭션을 테스트 할 수 없기 때문에 Transactional decorator 를 dummy decorator 로 변경한다.
jest.mock('./src/libs/transactional', () => ({
  ...jest.requireActual('./src/libs/transactional'),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Transactional: () => () => {},
}));
