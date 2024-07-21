// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './PictureRequest.sol';
import './PictureNFT.sol';

contract PictureRequestFactory is Ownable {
  PictureNFT public pictureNFT;
  PictureRequest[] public pictureRequests;
  mapping(address => bool) public validPictureRequests;

  event PictureRequestCreated(address indexed pictureRequestAddress);
  event RequestSubmissionCreated(address indexed requestSubmissionAddress);

  constructor() {
    pictureNFT = new PictureNFT();
  }

  modifier onlyValidPictureRequest() {
    require(validPictureRequests[msg.sender], 'Caller is not a valid PictureRequest');
    _;
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
      address(this),
      address(pictureNFT)
    );
    validPictureRequests[address(pictureRequest)] = true;
    pictureRequests.push(pictureRequest);
    emit PictureRequestCreated(address(pictureRequest));
  }

  function addRequestSubmissionAsMinter(address submission) external onlyValidPictureRequest {
    pictureNFT.addMinter(submission);
    emit RequestSubmissionCreated(submission);
  }

  function getPictureRequests() public view returns (address[] memory) {
    address[] memory requestAddresses = new address[](pictureRequests.length);
    for (uint i = 0; i < pictureRequests.length; i++) {
      requestAddresses[i] = address(pictureRequests[i]);
    }
    return requestAddresses;
  }
}
