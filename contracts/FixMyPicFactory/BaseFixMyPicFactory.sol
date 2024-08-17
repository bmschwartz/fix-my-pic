// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '../FixMyPicNFT.sol';
import '../PictureRequest.sol';
import '../RequestSubmission.sol';
import '../RequestComment.sol';
import '../PriceOracle.sol';

contract BaseFixMyPicFactory is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
  event PictureRequestCreated(
    address indexed request,
    string ipfsHash,
    uint256 budget,
    address indexed creator,
    uint256 createdAt,
    uint256 expiresAt
  );

  event RequestSubmissionCreated(
    address indexed submission,
    address indexed request,
    string ipfsHash,
    uint256 price,
    address indexed submitter,
    uint256 createdAt
  );

  event RequestCommentCreated(
    address indexed comment,
    address indexed request,
    string ipfsHash,
    address indexed commenter,
    uint256 createdAt
  );

  event SubmissionPurchased(address indexed submission, address indexed purchaser, uint256 price, uint256 purchaseDate);

  event FixMyPicNFTMinted(
    uint256 indexed tokenId,
    address indexed submission,
    address indexed purchaser,
    string tokenURI,
    uint256 purchasePrice
  );

  error InsufficientPayment(uint256 required, uint256 provided);

  address public priceOracle;
  FixMyPicNFT public nftContract;

  function initialize(address _priceOracle, address _nftContract) public initializer {
    priceOracle = _priceOracle;
    nftContract = FixMyPicNFT(_nftContract);
  }

  function createPictureRequest(string calldata _ipfsHash, uint256 _budget, uint256 _expiresAt) external {
    PictureRequest pictureRequest = new PictureRequest();
    pictureRequest.initialize(_ipfsHash, _budget, msg.sender, _expiresAt);

    emit PictureRequestCreated(address(pictureRequest), _ipfsHash, _budget, msg.sender, block.timestamp, _expiresAt);
  }

  function createRequestSubmission(address _request, string calldata _ipfsHash, uint256 _price) external {
    PictureRequest pictureRequest = PictureRequest(_request);
    uint256 expiresAt = pictureRequest.expiresAt();
    require(expiresAt == 0 || block.timestamp <= expiresAt, 'PictureRequest has expired');

    RequestSubmission requestSubmission = new RequestSubmission();
    requestSubmission.initialize(_request, _ipfsHash, _price, msg.sender, priceOracle);

    emit RequestSubmissionCreated(address(requestSubmission), _request, _ipfsHash, _price, msg.sender, block.timestamp);
  }

  function createRequestComment(address _request, string calldata _ipfsHash) external {
    require(PictureRequest(_request).isPictureRequest(), 'PictureRequest does not exist');

    RequestComment comment = new RequestComment();
    comment.initialize(_request, _ipfsHash, msg.sender);

    emit RequestCommentCreated(address(comment), _request, _ipfsHash, msg.sender, block.timestamp);
  }

  function purchaseSubmission(address _submission) external payable nonReentrant {
    require(_submission != address(0), 'Invalid submission address');

    RequestSubmission requestSubmission = RequestSubmission(_submission);

    uint256 priceInWei = requestSubmission.getPriceInWei();

    if (msg.value < priceInWei) {
      revert InsufficientPayment(priceInWei, msg.value);
    }

    requestSubmission.markAsPurchased(msg.sender);

    (bool success, ) = requestSubmission.submitter().call{value: msg.value}('');
    require(success, 'Payment failed');

    emit SubmissionPurchased(_submission, msg.sender, msg.value, block.timestamp);
  }

  function mintNFTForSubmission(address _purchaser, address _submission, string calldata _tokenURI) external onlyOwner {
    require(_purchaser != address(0), 'Invalid purchaser address');
    require(_submission != address(0), 'Invalid submission address');

    RequestSubmission requestSubmission = RequestSubmission(_submission);
    require(requestSubmission.hasPurchased(_purchaser), 'Submission has not been purchased');

    uint256 purchasePrice = requestSubmission.price();
    uint256 tokenId = nftContract.mintNFT(_purchaser, _tokenURI);

    emit FixMyPicNFTMinted(tokenId, _submission, _purchaser, _tokenURI, purchasePrice);
  }
}
