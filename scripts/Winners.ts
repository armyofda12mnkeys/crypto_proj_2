import { Signer } from "ethers";
//import { ethers } from "hardhat";
import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config();

//const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY, etherscan: process.env.ETHERSCAN_API_KEY});
  //let wallet = ethers.Wallet.createRandom();
  //let wallet = ethers.Wallet.fromMnemonic(process.env.MM_MNEMONIC ?? "");
  let wallet = new ethers.Wallet(process.env.MM_PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  console.log('signer.address: '+ signer.address); // should be: 0xA63E08155Bf2D2c0b467D2B19e44d7608Fc73bA5
  const balance = await signer.getBalance();
  if(balance.eq(0)){ throw new Error("0 balance :("); }
  console.log('balance: '+ balance); // + " or "+ (balance.toNumber()/(10**18)) +" eth" );
  console.log("Attach previous deployment...");


  //why below? in case want to deploy with 2nd or 3rd account?
  const ballotContractFactory = new Ballot__factory(signer);
  //const ballotContractFactory = await ethers.getContractFactory("Ballot");

  const contractAddress = "0xAE7B5cf05Ebe812449487c4E7eb451054D8d46Fb"; //"0x5fa9971Dc17FB1A826C049B0DeA77A9d2509989a";
  //if want to just attach existing contract
  const ballotContract = ballotContractFactory.attach(
    contractAddress
  );




  //results:
  const winningProposal = await ballotContract.winningProposal();
  console.log("winningProposal:"+ winningProposal);

  const winnerName = await ballotContract.winnerName();
  console.log("winnerName:"+ ethers.utils.parseBytes32String(winnerName));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});