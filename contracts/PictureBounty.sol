// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import './BountySubmission.sol';

contract PictureBounty {
  enum State {
    NEW
  }

  address payable public owner;

  string public title;
  string public description;
  string public imageId;
  uint256 public reward;
  State public currentState;
  BountySubmission[] public submissions;

  event RewardPaid(address _winner, uint256 _reward);
  event SubmissionCreated(address _bountyAddress, address _submissionAddress);

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
    currentState = State.NEW;
  }

  function createSubmission(string memory _description, string memory _imageId) public {
    BountySubmission submission = new BountySubmission(_description, _imageId);
    submissions.push(submission);

    emit SubmissionCreated(address(this), address(submission));
  }

  function setState(State _state) public {
    currentState = _state;
  }

  // function payReward(address _winner) public onlyOwner {
  //   require(bytes(submissions[_winner]).length != 0, 'No submission from this address');
  //   require(address(this).balance >= reward, 'Insufficient contract balance');

  //   (bool success, ) = _winner.call{ value: reward }('');
  //   require(success, 'Reward payment failed');

  //   emit RewardPaid(_winner, reward);
  // }

  // // Fallback function to receive Ether
  receive() external payable {}
}
