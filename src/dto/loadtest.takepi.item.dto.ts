import { IsNotEmpty } from 'class-validator';

export class LoadtestTakepiItemDto {
  @IsNotEmpty()
  sapDocNum: string;

  @IsNotEmpty()
  documentId: string;

  @IsNotEmpty()
  stockType: string;
}