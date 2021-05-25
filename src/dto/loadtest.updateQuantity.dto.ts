import { IsNotEmpty } from 'class-validator';

export class LoadtestUpdateQuantityDto {

  @IsNotEmpty()
  documentIds: string;

  @IsNotEmpty()
  ean11: string;

  batch?: string;

  @IsNotEmpty()
  quantity: string;

  updatedBy?: string;

}
