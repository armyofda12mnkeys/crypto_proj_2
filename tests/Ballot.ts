import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
// https://github.com/dethcrypto/TypeChain
import { Ballot } from "../typechain-types";

const PROPOSALS_STRING = ["vanilla", "cookie", "chocolate", "coffee"];
const PROPOSALS_BYTES32 = ["vanilla", "cookie", "chocolate", "coffee"].map((value)=>ethers.utils.formatBytes32String(value));
// https://mochajs.org/#getting-started
describe("Ballot", function () {
  let ballotContract: Ballot;
  let accounts : SignerWithAddress[]; 
  // https://mochajs.org/#hooks
  beforeEach(async function () {
    accounts = await ethers.getSigners();
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(PROPOSALS_BYTES32) as Ballot;
    await ballotContract.deployed();
  });

  it("has the provided proposals check", async function () {
    const member0  = await ballotContract.proposals(0);
    console.log({member0});
    console.log({name: member0.name});
    console.log({nameAgain: member0[0]});
  });


  it("sets chairperson as init deployer address", async function () {
    const chairperson = await ballotContract.chairperson();
    expect(chairperson).to.equal( accounts[0].address );
  });

});

