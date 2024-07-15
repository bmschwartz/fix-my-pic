// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import './BountySubmission.sol';

contract PictureBounty {
  enum State {
    ACTIVE,
    COMPLETED,
    CANCELLED
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
  event BountyCancelled(address _bountyAddress, uint256 _refund);

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can call this function');
    _;
  }

  constructor(
    string memory _title,
    string memory _description,
    string memory _imageId,
    address _owner
  ) payable {
    require(msg.value > 0, 'Initial reward must be greater than 0');
    require(_owner != address(0), 'Owner address cannot be zero');

    owner = payable(_owner);
    title = _title;
    description = _description;
    imageId = _imageId;
    reward = msg.value;
    currentState = State.ACTIVE;
  }

  function createSubmission(
    address _submitter,
    string memory _description,
    string memory _imageId
  ) public {
    require(currentState == State.ACTIVE, 'Submissions are not being accepted');
    BountySubmission submission = new BountySubmission(_submitter, _description, _imageId);
    submissions.push(submission);

    emit SubmissionCreated(address(this), address(submission));
  }

  function setState(State _state) public onlyOwner {
    currentState = _state;
  }

  function getSubmissions() public view returns (address[] memory) {
    address[] memory submissionAddresses = new address[](submissions.length);
    for (uint i = 0; i < submissions.length; i++) {
      submissionAddresses[i] = address(submissions[i]);
    }
    return submissionAddresses;
  }

  function payOutReward(address _submissionAddress) public onlyOwner {
    require(currentState == State.ACTIVE, 'Bounty is not active');

    BountySubmission submission = BountySubmission(_submissionAddress);
    require(!submission.isWinner(), 'Submission has already been rewarded');

    // Update state before transferring funds to prevent reentrancy attacks
    currentState = State.COMPLETED;
    reward = 0;

    (bool success, ) = submission.submitter().call{ value: reward }('');
    require(success, 'Transfer failed.');

    submission.setWinner(); // Mark the submission as a winner

    emit RewardPaid(submission.submitter(), reward);
  }

  function cancelBounty() public onlyOwner {
    require(currentState == State.ACTIVE, 'Bounty cannot be cancelled in its current state');

    uint256 refundAmount = reward;
    reward = 0;
    currentState = State.CANCELLED;

    (bool success, ) = owner.call{ value: refundAmount }('');
    require(success, 'Refund transfer failed.');

    emit BountyCancelled(address(this), refundAmount);
  }
}
