// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ImageRequest.sol';

contract ImageRequestFactory {
  ImageRequest[] public imageRequests;

  event ImageRequestCreated(
    address indexed creator,
    address requestAddress,
    string title,
    string description,
    string imageId,
    uint256 budget
  );

  function createImageRequest(
    string memory title,
    string memory description,
    string memory imageId,
    uint256 budget
  ) public {
    require(budget >= 0, 'Budget must be greater than 0');

    ImageRequest imageRequest = new ImageRequest(title, description, imageId, budget, msg.sender);
    imageRequests.push(imageRequest);

    emit ImageRequestCreated(msg.sender, address(imageRequest), title, description, imageId);
  }

  function getImageRequests() public view returns (address[] memory) {
    address[] memory requestAddresses = new address[](imageRequests.length);
    for (uint i = 0; i < imageRequests.length; i++) {
      requestAddresses[i] = address(imageRequests[i]);
    }
    return requestAddresses;
  }
}
