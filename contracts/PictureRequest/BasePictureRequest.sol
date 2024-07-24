// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract BasePictureRequest is Initializable {
  event PictureRequestCreated(
    address indexed requestId,
    string title,
    string description,
    string imageId,
    uint256 budget,
    address indexed creator,
    uint256 createdAt,
    uint256 expiresAt
  );

  string public title;
  string public description;
  string public imageId;
  uint256 public budget;
  address public creator;
  uint256 public createdAt;
  uint256 public expiresAt;

  function initialize(
    string calldata _title,
    string calldata _description,
    string calldata _imageId,
    uint256 _budget,
    address _creator,
    uint256 _expiresAt
  ) external initializer {
    title = _title;
    description = _description;
    imageId = _imageId;
    budget = _budget;
    creator = _creator;
    createdAt = block.timestamp;
    expiresAt = _expiresAt;

    emit PictureRequestCreated(
      address(this),
      _title,
      _description,
      _imageId,
      _budget,
      _creator,
      block.timestamp,
      _expiresAt
    );
  }
}
