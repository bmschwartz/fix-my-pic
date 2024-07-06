// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract PictureBounty {
  address payable public owner;

  string public title;
  string public description;
  string public imageId;
  uint256 public reward;

  mapping(address => string) public submissions;

  event SubmissionCreated(string _title, address _submitter);
  event RewardPaid(address _winner, uint256 _reward);

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can call this function');
    _;
  }

  constructor(string memory _title, string memory _description, string memory _imageId) payable {
    require(msg.value > 0, 'Initial reward must be greater than 0');

    owner = payable(msg.sender);
    title = _title;
    description = _description;
    imageId = _imageId;
    reward = msg.value;
  }

  function createSubmission(string memory _imageId) public {
    submissions[msg.sender] = _imageId;
    emit SubmissionCreated(title, msg.sender);
  }

  function payReward(address _winner) public onlyOwner {
    require(bytes(submissions[_winner]).length != 0, 'No submission from this address');
    require(address(this).balance >= reward, 'Insufficient contract balance');

    (bool success, ) = _winner.call{ value: reward }('');
    require(success, 'Reward payment failed');

    emit RewardPaid(_winner, reward);
  }

  // Fallback function to receive Ether
  receive() external payable {}
}
