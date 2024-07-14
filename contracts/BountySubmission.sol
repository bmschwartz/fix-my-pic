// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract BountySubmission {
  address payable public owner;

  bool public isWinner;
  string public imageId;
  string public description;
  address public bountyOwner;

  constructor(string memory _description, string memory _imageId, address _bountyOwner) {
    owner = payable(msg.sender);
    description = _description;
    imageId = _imageId;
    isWinner = false;
    bountyOwner = _bountyOwner;
  }

  // Fallback function to receive Ether
  receive() external payable {}

  function setWinner(bool _isWinner) public {
    require(msg.sender == bountyOwner, 'Only the PictureBounty owner can set the winner status');
    isWinner = _isWinner;
  }
}
