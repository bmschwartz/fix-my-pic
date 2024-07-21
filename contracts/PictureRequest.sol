// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import './RequestSubmission.sol';

/**
 * @title PictureRequest
 * @dev Manages picture requests and their submissions.
 */
contract PictureRequest is Initializable {
  string public title;
  string public imageId;
  string public description;
  uint256 public budget;
  address[] public submissions;

  /**
   * @dev Emitted when a new submission is created.
   * @param requestAddress The address of the picture request.
   * @param submissionAddress The address of the submission.
   */
  event SubmissionCreated(address indexed requestAddress, address indexed submissionAddress);

  /**
   * @dev Initializer for PictureRequest.
   * @param _title The title of the picture request.
   * @param _description The description of the picture request.
   * @param _imageId The image ID for the picture request.
   * @param _budget The budget for the picture request.
   */
  function initialize(
    string memory _title,
    string memory _description,
    string memory _imageId,
    uint256 _budget
  ) public initializer {
    require(_budget >= 0, 'Budget must be positive or zero');

    title = _title;
    description = _description;
    imageId = _imageId;
    budget = _budget;
  }

  /**
   * @dev Creates a new submission for the picture request.
   * @param _submitter The address of the submitter.
   * @param _description The description of the submission.
   * @param _watermarkedPictureId The ID of the watermarked picture.
   * @param _encryptedPictureId The ID of the encrypted picture.
   * @param _freePictureId The ID of the free picture.
   * @param _price The price of the submission.
   */
  function createSubmission(
    address _submitter,
    string memory _description,
    string memory _watermarkedPictureId,
    string memory _encryptedPictureId,
    string memory _freePictureId,
    uint256 _price
  ) public {
    require(_price >= 0, 'Price must be positive or zero');
    require(_submitter != address(0), 'Submitter address cannot be zero');

    RequestSubmission submission = new RequestSubmission();
    submission.initialize(
      _submitter,
      _description,
      _watermarkedPictureId,
      _encryptedPictureId,
      _freePictureId,
      _price
    );

    submissions.push(address(submission));
    emit SubmissionCreated(address(this), address(submission));
  }

  /**
   * @dev Gets the addresses of all submissions.
   * @return An array of submission addresses.
   */
  function getSubmissions() public view returns (address[] memory) {
    return submissions;
  }
}
