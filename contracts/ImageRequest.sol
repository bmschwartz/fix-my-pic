// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import './RequestSubmission.sol';

contract ImageRequest {
  string public title;
  string public imageId;
  uint256 public budget;
  string public description;
  RequestSubmission[] public submissions;

  event SubmissionCreated(address _requestAddress, address _submissionAddress);

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can call this function');
    _;
  }

  constructor(
    string memory _title,
    string memory _description,
    string memory _imageId,
    uint256 _budget,
    address _owner
  ) {
    require(budget >= 0, 'Budget must be positive or zero');
    require(_owner != address(0), 'Owner address cannot be zero');

    title = _title;
    description = _description;
    imageId = _imageId;
    budget = _budget;
  }

  function createSubmission(
    address _submitter,
    string memory _description,
    string memory _imageId,
    uint256 _price,
  ) public {
    require(_submitter != address(0), 'Submitter address cannot be zero');

    RequestSubmission submission = new RequestSubmission(_submitter, _description, _imageId, _price);
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
