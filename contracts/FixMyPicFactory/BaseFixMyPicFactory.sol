// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '../PictureRequest.sol';
import '../RequestSubmission.sol';
import '../RequestComment.sol';

contract BaseFixMyPicFactory is Initializable {
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

  event RequestSubmissionCreated(
    address indexed submissionId,
    address indexed requestId,
    string description,
    uint256 price,
    string freeImageId,
    string watermarkedImageId,
    string encryptedImageId,
    address indexed creator,
    uint256 createdAt
  );

  event CommentCreated(
    address indexed commentId,
    address indexed requestId,
    string text,
    address indexed creator,
    uint256 createdAt
  );

  function initialize() public initializer {}

  function createPictureRequest(
    string calldata _title,
    string calldata _description,
    string calldata _imageId,
    uint256 _budget,
    uint256 _expiresAt
  ) external {
    PictureRequest pictureRequest = new PictureRequest();
    pictureRequest.initialize(_title, _description, _imageId, _budget, msg.sender, _expiresAt);

    emit PictureRequestCreated(
      address(pictureRequest),
      _title,
      _description,
      _imageId,
      _budget,
      msg.sender,
      block.timestamp,
      _expiresAt
    );
  }

  function createRequestSubmission(
    address _requestId,
    string calldata _description,
    uint256 _price,
    string calldata _freeImageId,
    string calldata _watermarkedImageId,
    string calldata _encryptedImageId
  ) external {
    RequestSubmission requestSubmission = new RequestSubmission();
    requestSubmission.initialize(
      _requestId,
      _description,
      _price,
      _freeImageId,
      _watermarkedImageId,
      _encryptedImageId,
      msg.sender
    );

    emit RequestSubmissionCreated(
      address(requestSubmission),
      _requestId,
      _description,
      _price,
      _freeImageId,
      _watermarkedImageId,
      _encryptedImageId,
      msg.sender,
      block.timestamp
    );
  }

  function createRequestComment(address _requestId, string calldata _text) external {
    RequestComment comment = new RequestComment();
    comment.initialize(_requestId, _text, msg.sender);

    emit CommentCreated(address(comment), _requestId, _text, msg.sender, block.timestamp);
  }
}
