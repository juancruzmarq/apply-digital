export class PercentageNonDeletedResponseDto {
  name: string;
  description: string;
  percentage: number;
}

export class PercentageDeletedResponseDto {
  name: string;
  description: string;
  percentage: number;
}

export class OutOfStockPercentageResponseDto {
  name: string;
  description: string;
  percentage: number;
}

export class AllReportsResponseDto {
  percentageDeleted: PercentageDeletedResponseDto;
  percentageNonDeleted: PercentageNonDeletedResponseDto;
  outOfStockPercentage: OutOfStockPercentageResponseDto;
}
