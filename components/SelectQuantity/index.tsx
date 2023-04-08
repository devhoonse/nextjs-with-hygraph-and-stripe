import { Select } from "@chakra-ui/react";

/**
 * 수량 선택 드롭다운 컴포넌트 props 목록
 * * quantities : 선택 가능 수량 최대값
 * * onChange : 드롭다운 선택 변경 시 호출할 함수
 */
type SelectQuantityProps = {
  quantities: number;
  onChange: (value: string) => void;
};

/**
 * 수량 선택 드롭다운 컴포넌트
 * @param quantities
 * @param onChange
 * @constructor
 */
function SelectQuantity({ quantities, onChange }: SelectQuantityProps) {

  /**
   * 드롭다운 내 선택 가능한 숫자 목록입니다. (1 ~ quantities)
   */
  const quantityList = [...Array.from({ length: quantities })];

  // 컴포넌트 구조
  return (
    <Select
      placeholder="Quantity"
      onChange={(event) => onChange(event.target.value)}
      textColor="gray.900"
      borderColor="gray.700"
    >
      {quantityList.map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </Select>
  );
}
export default SelectQuantity;
