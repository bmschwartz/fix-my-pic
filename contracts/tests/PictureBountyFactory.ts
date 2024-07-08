import '@nomicfoundation/hardhat-chai-matchers'
import { expect } from 'chai'
import { ContractTransactionReceipt, ethers, EventLog, Log } from 'ethers'
import { Contract, Wallet } from 'zksync-ethers'
import { getWallet, LOCAL_RICH_WALLETS, deployContract } from '../utils'

describe('PictureBountyFactory', function () {
  let bountyFactory: Contract
  let owner: Wallet
  let addr1: Wallet

  beforeEach(async function () {
    owner = getWallet(LOCAL_RICH_WALLETS[0].privateKey)
    addr1 = getWallet(LOCAL_RICH_WALLETS[1].privateKey)

    bountyFactory = await deployContract('PictureBountyFactory', [], {
      wallet: owner,
      silent: true,
    })
  })
  it('should reject reward of 0', async () => {
    await expect(
      (bountyFactory.connect(addr1) as Contract).createPictureBounty('A title', 'Desc', 'some-id')
    ).to.be.revertedWith('Reward must be greater than 0')
  })

  it('should maintain a list of PictureBounties', async () => {
    const bountyCount = 5
    const rewardInWei = ethers.parseEther('1').toString()

    for (let i = 0; i < bountyCount; i++) {
      await (bountyFactory.connect(addr1) as Contract).createPictureBounty(
        'Title1',
        'Desc1',
        'SomeId',
        {
          value: rewardInWei,
        }
      )
    }

    const bounties = await (bountyFactory.connect(owner) as Contract).getPictureBounties()
    expect(bounties.length).to.equal(bountyCount)
  })

  it('should emit PictureBountyCreated event when bounty is created', async function () {
    const rewardInWei = ethers.parseEther('1')
    const tx = await (bountyFactory.connect(addr1) as Contract).createPictureBounty(
      'A title',
      'Desc',
      'some-id',
      {
        value: rewardInWei,
      }
    )

    // Wait for the transaction to be mined
    const receipt: ContractTransactionReceipt = await tx.wait()

    // Find the event in the receipt logs
    const event = receipt.logs.find((log: EventLog | Log) => {
      if (log instanceof EventLog) {
        return log.fragment.name === 'PictureBountyCreated'
      }
      return false
    })

    if (!event) {
      throw new Error('Event not emitted')
    }

    // Decode the event log to extract the arguments
    const eventArgs = bountyFactory.interface.decodeEventLog(
      'PictureBountyCreated',
      event.data,
      event.topics
    )

    // Extract the address of the newly created bounty from the event arguments
    const bountyAddress = eventArgs.bountyAddress

    // Ensure the event is found and the address is captured
    expect(event).to.not.be.undefined
    expect(bountyAddress).to.not.be.undefined

    await expect(tx)
      .to.emit(bountyFactory, 'PictureBountyCreated')
      .withArgs(bountyAddress, 'A title', 'Desc', 'some-id', rewardInWei)
  })
})
