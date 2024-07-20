// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './PictureRequest.sol';
import './PictureNFT.sol';

contract PictureRequestFactory {
  PictureNFT public pictureNFT;
  PictureRequest[] public pictureRequests;

  event PictureRequestCreated(address indexed pictureRequestAddress);

  constructor() {
    pictureNFT = new PictureNFT();
  }

  function createPictureRequest(
    string memory _title,
    string memory _description,
    string memory _imageId,
    uint256 _budget
  ) public {
    PictureRequest pictureRequest = new PictureRequest(
      _title,
      _description,
      _imageId,
      _budget,
      address(pictureNFT)
    );
    pictureRequests.push(pictureRequest);
    emit PictureRequestCreated(address(pictureRequest));
  }

  function getPictureRequests() public view returns (address[] memory) {
    address[] memory requestAddresses = new address[](pictureRequests.length);
    for (uint i = 0; i < pictureRequests.length; i++) {
      requestAddresses[i] = address(pictureRequests[i]);
    }
    return requestAddresses;
  }
}
