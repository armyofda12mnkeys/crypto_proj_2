import { Signer } from "ethers";
//import { ethers } from "hardhat";
import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config();


const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  //const accounts = await ethers.getSigners();
  /*
  process.argv.slice(2).forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });
  */
  const PROPOSALS_FROM_CMD = process.argv.slice(2);
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS_FROM_CMD.forEach((element, index) => {
    console.log(`Proposal #${index + 1}: ${element}`);
  });
  console.log( process.env.MNEMONIC ? process.env.MNEMONIC.length + " chars for MetaMask key" : "");
  //connect to real testnet blockchain and use real wallet
  
  
  const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY, etherscan: process.env.ETHERSCAN_API_KEY});
  //let wallet = ethers.Wallet.createRandom();
  //let wallet = ethers.Wallet.fromMnemonic(process.env.MM_MNEMONIC ?? "");
  let wallet = new ethers.Wallet(process.env.MM_PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  console.log('signer.address:'+ signer.address);
  const balance = await signer.getBalance();
  if(balance.eq(0)){ throw new Error("0 balance :("); }
  console.log('balance:'+ balance); // + " or "+ (balance.toNumber()/(10**18)) +" eth" );
  console.log("try to deploy...");


  //why below? in case want to deploy with 2nd or 3rd account?
  const ballotContractFactory = new Ballot__factory(signer);
  //const ballotContractFactory = await ethers.getContractFactory("Ballot");

  //*
  //deploy 1st time:
  const ballotContract = await ballotContractFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS_FROM_CMD)
  );
  await ballotContract.deployed();
  console.log(`The ballot smart contract was deployed at ${ballotContract.address}`)
  //*/

  const chairperson_text = await ballotContract.chairperson();
  console.log("chairperson_text is: "+ chairperson_text);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});