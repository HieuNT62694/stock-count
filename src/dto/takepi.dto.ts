import {IsNotEmpty} from "class-validator";

export class TakepiDto {
  @IsNotEmpty()
  sapDocNum: string;

}