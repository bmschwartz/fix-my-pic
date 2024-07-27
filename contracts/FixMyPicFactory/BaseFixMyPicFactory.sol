// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '../PictureRequest.sol';
import '../RequestSubmission.sol';
import '../RequestComment.sol';

contract BaseFixMyPicFactory is Initializable {
  event PictureRequestCreated(
    address indexed request,
    string title,
    string description,
    string imageId,
    uint256 budget,
    address indexed creator,
    uint256 createdAt,
    uint256 expiresAt
  );

  event RequestSubmissionCreated(
    address indexed submission,
    address indexed request,
    string description,
    uint256 price,
    string freeImageId,
    string watermarkedImageId,
    string encryptedImageId,
    address indexed submitter,
    uint256 createdAt
  );

  event RequestCommentCreated(
    address indexed comment,
    address indexed request,
    string text,
    address indexed commenter,
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
    address _request,
    string calldata _description,
    uint256 _price,
    string calldata _freeImageId,
    string calldata _watermarkedImageId,
    string calldata _encryptedImageId
  ) external {
    PictureRequest pictureRequest = PictureRequest(_request);
    uint256 expiresAt = pictureRequest.expiresAt();
    require(expiresAt == 0 || block.timestamp <= expiresAt, 'PictureRequest has expired');

    RequestSubmission requestSubmission = new RequestSubmission();
    requestSubmission.initialize(
      _request,
      _description,
      _price,
      _freeImageId,
      _watermarkedImageId,
      _encryptedImageId,
      msg.sender
    );

    emit RequestSubmissionCreated(
      address(requestSubmission),
      _request,
      _description,
      _price,
      _freeImageId,
      _watermarkedImageId,
      _encryptedImageId,
      msg.sender,
      block.timestamp
    );
  }

  function createRequestComment(address _request, string calldata _text) external {
    // Verify the _request is a PictureRequest
    require(PictureRequest(_request).isPictureRequest(), 'PictureRequest does not exist');

    RequestComment comment = new RequestComment();
    comment.initialize(_request, _text, msg.sender);

    emit RequestCommentCreated(address(comment), _request, _text, msg.sender, block.timestamp);
  }
}
