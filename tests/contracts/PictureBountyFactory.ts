import { expect } from 'chai'
import { ethers } from 'ethers'
import { Contract, Provider, Wallet } from 'zksync-ethers'
import { Deployer } from '@matterlabs/hardhat-zksync-deploy'
import * as hre from 'hardhat'

describe('PictureBountyFactory', function () {
  let pictureBountyFactory: Contract
  let owner: Wallet
  let addr1: Wallet
  let addr2: Wallet
  let addrs: Wallet[]

  beforeEach(async function () {
    const artifact = await hre.deployer.loadArtifact('ContractName')
    pictureBountyFactory = await hre.deployer.deploy(artifact, [])
    await pictureBountyFactory.waitForDeployment()
  })

  it('should create a new PictureBounty and emit PictureBountyCreated event', async function () {
    const title = 'Test Bounty'
    const description = 'Test Description'
    const imageId = 'image123'
    const reward = utils.parseEther('1.0')

    await expect(
      pictureBountyFactory
        .connect(addr1)
        .createPictureBounty(title, description, imageId, { value: reward })
    )
      .to.emit(pictureBountyFactory, 'PictureBountyCreated')
      .withArgs(
        ethers.constants.AddressZero, // this will be replaced with any address in the matcher
        title,
        description,
        imageId,
        reward
      )

    const bounties = await pictureBountyFactory.getPictureBounties()
    expect(bounties.length).to.equal(1)

    const bounty = await getContractAt('PictureBounty', bounties[0])
    expect(await bounty.title()).to.equal(title)
    expect(await bounty.description()).to.equal(description)
    expect(await bounty.imageId()).to.equal(imageId)
    expect(await bounty.reward()).to.equal(reward)
  })
})
