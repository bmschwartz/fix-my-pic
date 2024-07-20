// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './RequestSubmission.sol';

contract PictureRequest {
  string public title;
  string public imageId;
  uint256 public budget;
  string public description;
  RequestSubmission[] public submissions;

  event SubmissionCreated(address indexed requestAddress, address indexed submissionAddress);

  constructor(
    string memory _title,
    string memory _description,
    string memory _imageId,
    uint256 _budget
  ) {
    require(_budget >= 0, 'Budget must be positive or zero');
    title = _title;
    description = _description;
    imageId = _imageId;
    budget = _budget;
  }

  function createSubmission(
    address _submitter,
    string memory _description,
    string memory _watermarkedPictureId,
    string memory _encryptedPictureId,
    string memory _freePictureId,
    uint256 _price,
    bool _isFree
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
      _isFree
    );
    submissions.push(submission);

    emit SubmissionCreated(address(this), address(submission));
  }

  function getSubmissions() public view returns (address[] memory) {
    address[] memory submissionAddresses = new address[](submissions.length);
    for (uint i = 0; i < submissions.length; i++) {
      submissionAddresses[i] = address(submissions[i]);
    }
    return submissionAddresses;
  }
}
