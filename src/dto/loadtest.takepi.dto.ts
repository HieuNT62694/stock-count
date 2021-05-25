import { IsNotEmpty } from 'class-validator';
import { LoadtestTakepiItemDto } from './loadtest.takepi.item.dto';

export class LoadtestTakepiDto {
  @IsNotEmpty()
  documentData: Array<LoadtestTakepiItemDto>;

  @IsNotEmpty()
  userId: string;

}