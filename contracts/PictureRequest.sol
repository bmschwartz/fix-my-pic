// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './RequestSubmission.sol';
import './PictureRequestFactory.sol';

contract PictureRequest {
  string public title;
  string public imageId;
  uint256 public budget;
  string public description;
  address[] public submissions;
  PictureNFT public pictureNFT;
  PictureRequestFactory public factory;

  event SubmissionCreated(address indexed requestAddress, address indexed submissionAddress);

  constructor(
    string memory _title,
    string memory _description,
    string memory _imageId,
    uint256 _budget,
    address _factoryAddress,
    address _pictureNFTAddress
  ) {
    require(_budget >= 0, 'Budget must be positive or zero');
    require(_factoryAddress != address(0), 'Invalid factory contract address');
    require(_pictureNFTAddress != address(0), 'Invalid NFT contract address');

    title = _title;
    description = _description;
    imageId = _imageId;
    budget = _budget;
    factory = PictureRequestFactory(_factoryAddress);
    pictureNFT = PictureNFT(_pictureNFTAddress);
  }

  function createSubmission(
    address _submitter,
    string memory _description,
    string memory _watermarkedPictureId,
    string memory _encryptedPictureId,
    string memory _freePictureId,
    uint256 _price
  ) public {
    require(_price >= 0, 'Price must be positive or zero');
    require(_submitter != address(0), 'Submitter address cannot be zero');

    RequestSubmission submission = new RequestSubmission(
      _submitter,
      _description,
      _watermarkedPictureId,
      _encryptedPictureId,
      _freePictureId,
      _price,
      address(pictureNFT)
    );

    submissions.push(address(submission));
    emit SubmissionCreated(address(this), address(submission));

    factory.addRequestSubmissionAsMinter(address(submission));
  }

  function getSubmissions() public view returns (address[] memory) {
    return submissions;
  }
}
