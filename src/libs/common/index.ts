export function stripUndefined(obj: { [key: string]: any }) {
  // 객체 최적화가 안됨
  // node.js V8엔진이 내부적으로 객체들을 최적화해둠 (V8 히든 클래스 캐싱 + 인라인 캐싱)
  // 프로퍼티가 변경되거나, 객체생성이 동적이거나 하는경우에는 최적화를 못함
  const stripped = Object.keys(obj).reduce((acc: { [key: string]: any }, prop) => {
    if (obj[prop] !== undefined) {
      acc[prop] = obj[prop];
    }
    return acc;
  }, {});
  if (Object.keys(stripped).length === 0) {
    return undefined;
  }
  return stripped;
}
