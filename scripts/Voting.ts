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
  

  const targetAddress1 = "0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee";
  const targetAddress2 = "0x71A955dBef69d97116CF6C6807876872468787f2";
  //const targetAddress3 = "0xEC1ED1a39d76685dF058F6f09D7Bf796cEb35Ffa"; // to delegate to another voter

  let voter1_wallet = new ethers.Wallet(process.env.MM_VOTER1_PRIVATE_KEY ?? "");
  const voter1_signer = voter1_wallet.connect(provider);

  let voter2_wallet = new ethers.Wallet(process.env.MM_VOTER2_PRIVATE_KEY ?? "");
  const voter2_signer = voter2_wallet.connect(provider);

  //let voter3_wallet = new ethers.Wallet(process.env.MM_VOTER3_PRIVATE_KEY ?? "");
  //const voter3_signer = voter3_wallet.connect(provider);
  
  //vote:
  const vote_tx_chairperson = await ballotContract.vote(0);
  await vote_tx_chairperson.wait();
  console.log(vote_tx_chairperson.hash);

  const vote_tx_addr1 = await ballotContract.connect(voter1_signer).vote(1);
  await vote_tx_addr1.wait();
  console.log(vote_tx_addr1.hash);
  
  const vote_tx_addr2 = await ballotContract.connect(voter2_signer).vote(2);
  await vote_tx_addr2.wait();
  console.log(vote_tx_addr2.hash);

  //3rd person doesn't need to vote since they gave their weight to 2nd person
  //Proposal 3 should get 2 votes vs others which have 1 vote

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});