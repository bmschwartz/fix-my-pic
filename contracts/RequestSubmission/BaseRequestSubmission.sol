// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '../PriceOracle.sol';

contract BaseRequestSubmission is Initializable, ReentrancyGuardUpgradeable {
  address public request;
  address public submitter;
  uint256 public price;
  string public ipfsHash;
  uint256 public createdAt;
  mapping(address => bool) public submissionPurchasers;

  PriceOracle internal priceOracle;

  error AlreadyPurchased(address submission, address sender);
  error InsufficientPayment(uint256 required, uint256 provided);

  function initialize(
    address _request,
    string calldata _ipfsHash,
    uint256 _price,
    address _submitter,
    address _priceOracle
  ) external initializer {
    __ReentrancyGuard_init();

    request = _request;
    ipfsHash = _ipfsHash;
    price = _price;
    submitter = _submitter;
    createdAt = block.timestamp;
    priceOracle = PriceOracle(_priceOracle);
  }

  function getPriceInWei() public view returns (uint256) {
    uint256 ethPriceInUsd = priceOracle.getLatestETHPrice();
    require(ethPriceInUsd > 0, 'ETH price is not available');

    uint256 priceInWei = (price * 1e18 * 1e8) / (ethPriceInUsd * 100);
    require(priceInWei > 0, 'Price in Wei is not available');
    return priceInWei;
  }

  function markAsPurchased(address purchaser) external nonReentrant {
    require(!submissionPurchasers[purchaser], 'Already purchased');
    submissionPurchasers[purchaser] = true;
  }

  function hasPurchased(address _user) external view returns (bool) {
    return submissionPurchasers[_user];
  }
}
