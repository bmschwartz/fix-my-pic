// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './PictureRequest.sol';

contract PictureRequestFactory {
  PictureRequest[] public pictureRequests;

  event PictureRequestCreated(
    address indexed creator,
    address requestAddress,
    string title,
    string description,
    string imageId,
    uint256 budget
  );

  function createPictureRequest(
    string memory title,
    string memory description,
    string memory imageId,
    uint256 budget
  ) public {
    require(budget >= 0, 'Budget must be positive or zero');

    PictureRequest pictureRequest = new PictureRequest(title, description, imageId, budget);
    pictureRequests.push(pictureRequest);

    emit PictureRequestCreated(
      msg.sender,
      address(pictureRequest),
      title,
      description,
      imageId,
      budget
    );
  }

  function getPictureRequests() public view returns (address[] memory) {
    address[] memory requestAddresses = new address[](pictureRequests.length);
    for (uint i = 0; i < pictureRequests.length; i++) {
      requestAddresses[i] = address(pictureRequests[i]);
    }
    return requestAddresses;
  }
}
