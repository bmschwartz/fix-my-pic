// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './PictureBounty.sol';

contract PictureBountyFactory {
  PictureBounty[] public pictureBounties;

  event PictureBountyCreated(
    address bountyAddress,
    string title,
    string description,
    string imageId,
    uint256 reward
  );

  function createPictureBounty(
    string memory title,
    string memory description,
    string memory imageId
  ) public payable {
    require(msg.value > 0, 'Reward must be greater than 0');

    PictureBounty pictureBounty = (new PictureBounty){ value: msg.value }(
      title,
      description,
      imageId
    );
    pictureBounties.push(pictureBounty);

    emit PictureBountyCreated(address(pictureBounty), title, description, imageId, msg.value);
  }

  function getPictureBounties() public view returns (address[] memory) {
    address[] memory bountyAddresses = new address[](pictureBounties.length);
    for (uint i = 0; i < pictureBounties.length; i++) {
      bountyAddresses[i] = address(pictureBounties[i]);
    }
    return bountyAddresses;
  }
}
