// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract BaseRequestComment is Initializable {
  address public request;
  address public commenter;
  string public text;
  uint256 public createdAt;

  function initialize(
    address _request,
    string calldata _text,
    address _commenter
  ) external initializer {
    request = _request;
    text = _text;
    commenter = _commenter;
    createdAt = block.timestamp;
  }
}
