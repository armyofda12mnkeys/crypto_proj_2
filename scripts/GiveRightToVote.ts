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

/*
  const p1 = await ballotContract.proposals(0);
  console.log("p1 is: "+ p1);
  const name   = p1.name;
  const voteCount = p1.voteCount;
  console.log("p1 props are: "+ ethers.utils.parseBytes32String(name) +","+ voteCount);
*/

  

  const targetAddress1 = "0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee";
  const targetAddress2 = "0x71A955dBef69d97116CF6C6807876872468787f2";
  const targetAddress3 = "0xEC1ED1a39d76685dF058F6f09D7Bf796cEb35Ffa"; // to delegate to another voter
  //const chairperson_text = await ballotContract.chairperson();
  //console.log("chairperson_text is: "+ chairperson_text);

  
  
  const tx_giveRightToVoteAddr1 = await ballotContract.giveRightToVote(targetAddress1);
  await tx_giveRightToVoteAddr1.wait();
  console.log(tx_giveRightToVoteAddr1.hash);

  const tx_giveRightToVoteAddr2 = await ballotContract.giveRightToVote(targetAddress2);
  await tx_giveRightToVoteAddr2.wait();
  console.log(tx_giveRightToVoteAddr2.hash);

  const tx_giveRightToVoteAddr3 = await ballotContract.giveRightToVote(targetAddress3);
  await tx_giveRightToVoteAddr3.wait();
  console.log(tx_giveRightToVoteAddr3.hash);

  /*
  const tx_DelegateAddr3 = await ballotContract.connect(targetAddress3).delegate(targetAddress2); //give 2nd accounts right to vote for you
  await tx_DelegateAddr3.wait();
  console.log(tx_DelegateAddr3.hash);
  */


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});