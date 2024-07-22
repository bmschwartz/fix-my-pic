// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import './RequestSubmission.sol';

/**
 * @title PurchaseManager
 * @dev Manages purchases of request submissions.
 */
contract PurchaseManager is Initializable, ReentrancyGuardUpgradeable {
  struct Purchase {
    address buyer;
    uint256 price;
    address submissionAddress;
  }

  mapping(address => Purchase[]) public purchasesByUser;

  event SubmissionPurchased(
    address indexed buyer,
    address indexed submissionAddress,
    uint256 price
  );

  function initialize() public initializer {
    // Initialize any state variables if needed
  }

  function purchaseSubmission(address submissionAddress) public payable nonReentrant {
    IRequestSubmission submission = IRequestSubmission(submissionAddress);
    uint256 price = submission.getPrice();

    require(msg.value == price, 'Incorrect payment amount');

    purchasesByUser[msg.sender].push(
      Purchase({ buyer: msg.sender, submissionAddress: submissionAddress, price: price })
    );

    submission.addBuyer(msg.sender);

    // Transfer payment to the submitter
    address submitter = submission.getSubmitter();
    if (price > 0) {
      (bool success, ) = submitter.call{ value: msg.value }('');
      require(success, 'Transfer failed');
    }

    emit SubmissionPurchased(msg.sender, submissionAddress, price);
  }

  function getPurchases(address user) public view returns (Purchase[] memory) {
    return purchasesByUser[user];
  }
}
