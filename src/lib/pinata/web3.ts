import { PinataSDK } from "pinata-web3";

const pinataWeb3 = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export default pinataWeb3;