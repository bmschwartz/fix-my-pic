// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract BountySubmission {
  address payable public owner;

  string public description;
  string public imageId;
  bool public isWinner;

  constructor(string memory _description, string memory _imageId) {
    owner = payable(msg.sender);
    description = _description;
    imageId = _imageId;
    isWinner = false;
  }

  // Fallback function to receive Ether
  receive() external payable {}

  function setWinner(bool _isWinner) public {
    require(msg.sender == owner, 'Only the PictureBounty contract can set the winner status');
    isWinner = _isWinner;
  }
}
