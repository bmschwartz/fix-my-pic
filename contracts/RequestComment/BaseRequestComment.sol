// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract BaseRequestComment is Initializable {
  address public request;
  address public commenter;
  uint256 public createdAt;

  // Comment text is stored in IPFS
  string public ipfsHash;

  function initialize(address _request, string calldata _ipfsHash, address _commenter) external initializer {
    request = _request;
    ipfsHash = _ipfsHash;
    commenter = _commenter;
    createdAt = block.timestamp;
  }
}
