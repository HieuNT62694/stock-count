import { IsNotEmpty } from 'class-validator';

export class CountQuantityDto {
  @IsNotEmpty()
  sapDocNum: string;
  @IsNotEmpty()
  itemId: string;
  @IsNotEmpty()
  quantity: number;
}