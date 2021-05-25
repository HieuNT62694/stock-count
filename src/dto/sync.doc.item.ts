import {IsNotEmpty} from "class-validator";

export class SyncDocItem {
  @IsNotEmpty()
  sapDocNum: string;
}