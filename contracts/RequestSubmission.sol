// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract RequestSubmission {
  string public watermarkedPictureUrl;
  string public encryptedPictureUrl;
  string public description;
  uint256 public price;
  address public pictureRequest;
  address public submitter;

  event RequestCreated(
    address indexed submitter,
    string description,
    uint256 price,
    string watermarkedPictureUrl,
    string encryptedPictureUrl
  );

  constructor(
    uint256 _price,
    address _submitter,
    string memory _description,
    string memory _watermarkedPictureUrl,
    string memory _encryptedPictureUrl
  ) {
    require(_price >= 0, 'Price must be positive or zero');
    require(_submitter != address(0), 'Submitter address cannot be zero');

    submitter = _submitter;
    description = _description;
    price = _price;
    watermarkedPictureUrl = _watermarkedPictureUrl;
    encryptedPictureUrl = _encryptedPictureUrl;
    pictureRequest = msg.sender;

    emit RequestCreated(
      _submitter,
      _description,
      _price,
      _watermarkedPictureUrl,
      _encryptedPictureUrl
    );
  }
}
