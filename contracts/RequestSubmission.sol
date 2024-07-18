// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract RequestSubmission {
  string public imageId;
  string public description;
  uint256 public price;
  address public imageRequest;
  address payable public submitter;

  constructor(
    address _submitter,
    string memory _description,
    string memory _imageId,
    uint256 _price
  ) {
    require(_price >= 0, 'Price must be positive or zero');
    require(_submitter != address(0), 'Submitter address cannot be zero');

    submitter = payable(_submitter);
    description = _description;
    imageId = _imageId;
    price = _price;
    imageRequest = msg.sender;
  }

  receive() external payable {}
}
