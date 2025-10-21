import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateWebServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsString()
  loginUsername: string;

  @IsNotEmpty()
  @IsString()
  loginPassword: string;
}

export class WebServiceResponseDto {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  // Note: loginUsername and loginPassword are encrypted and not returned
}
