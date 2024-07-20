// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

contract RequestSubmission {
  string public watermarkedPictureId;
  string public encryptedPictureId;
  string public freePictureId;
  string public description;
  uint256 public price;
  address public pictureRequest;
  address public submitter;
  bool public isFree;

  event RequestCreated(
    address indexed submitter,
    string description,
    uint256 price,
    string watermarkedPictureId,
    string encryptedPictureId,
    string freePictureId,
    bool isFree
  );

  constructor(
    address _submitter,
    string memory _description,
    string memory _watermarkedPictureId,
    string memory _encryptedPictureId,
    string memory _freePictureId,
    uint256 _price,
    bool _isFree
  ) {
    require(_price >= 0, 'Price must be positive or zero');
    require(_submitter != address(0), 'Submitter address cannot be zero');

    submitter = _submitter;
    description = _description;
    price = _price;
    watermarkedPictureId = _watermarkedPictureId;
    encryptedPictureId = _encryptedPictureId;
    freePictureId = _freePictureId;
    pictureRequest = msg.sender;
    isFree = _isFree;

    emit RequestCreated(
      _submitter,
      _description,
      _price,
      _watermarkedPictureId,
      _encryptedPictureId,
      _freePictureId,
      _isFree
    );
  }
}
