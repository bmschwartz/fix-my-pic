// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract BaseRequestComment is Initializable {
  event CommentCreated(
    address indexed commentId,
    address indexed requestId,
    string text,
    address indexed creator,
    uint256 createdAt
  );

  address public requestId;
  string public text;
  address public creator;
  uint256 public createdAt;

  function initialize(
    address _requestId,
    string calldata _text,
    address _creator
  ) external initializer {
    requestId = _requestId;
    text = _text;
    creator = _creator;
    createdAt = block.timestamp;

    emit CommentCreated(address(this), _requestId, _text, _creator, block.timestamp);
  }
}
