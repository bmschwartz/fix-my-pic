// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract BasePictureRequest is Initializable {
  string public ipfsHash;
  uint256 public budget;
  address public creator;
  uint256 public createdAt;
  uint256 public expiresAt;

  function initialize(
    string calldata _ipfsHash,
    uint256 _budget,
    address _creator,
    uint256 _expiresAt
  ) external initializer {
    ipfsHash = _ipfsHash;
    budget = _budget;
    creator = _creator;
    createdAt = block.timestamp;
    expiresAt = _expiresAt;
  }

  function isPictureRequest() external pure returns (bool) {
    return true;
  }
}
