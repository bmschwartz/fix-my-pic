// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract BountySubmission {
  bool public isWinner;
  string public imageId;
  string public description;
  address public pictureBounty;
  address payable public submitter;

  constructor(address _submitter, string memory _description, string memory _imageId) {
    submitter = payable(_submitter);
    description = _description;
    imageId = _imageId;
    pictureBounty = msg.sender; // Directly set pictureBounty to the address of the contract that created this submission
  }

  modifier onlyPictureBounty() {
    require(msg.sender == pictureBounty, 'Only the PictureBounty contract can call this function');
    _;
  }

  function setWinner() public onlyPictureBounty {
    isWinner = true;
  }

  receive() external payable {}
}
