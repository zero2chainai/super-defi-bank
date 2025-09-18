// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Bank — simple ETH bank hardened with OpenZeppelin
/// @author Zero2ChainAI
/// @notice Minimal bank that accepts deposits, withdrawals and internal transfers.
/// @dev Uses Ownable, Pausable and ReentrancyGuard for basic hardening. Also includes rescue helpers.

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bank is Ownable, Pausable, ReentrancyGuard {
    /* ========== ERRORS ========== */
    error InsufficientBalance();
    error InvalidAddress();
    error TransferFailed();
    error ZeroDeposit();

    /* ========== STATE ========== */
    uint256 private interestRatePerYear = 10;
    mapping(address => uint256) private balances;
    mapping(address => uint256) private lastUpdated;

    /* ========== EVENTS ========== */
    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed from, uint256 amount);
    event TransferInternal(address indexed from, address indexed to, uint256 amount);
    event EmergencyWithdraw(address indexed owner, uint256 amount);
    event ERC20Rescued(address indexed token, address indexed to, uint256 amount);

    /* ========== CONSTRUCTOR ========== */
    constructor() Ownable(msg.sender) {}


    /* ========== PUBLIC / EXTERNAL ========== */

    /// @notice Set interest rate per year
    function _applyInterest(address _user) internal whenNotPaused {
        if (lastUpdated[_user] == 0) {
            lastUpdated[_user] = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - lastUpdated[_user];
        if (timeElapsed > 0 && balances[_user] > 0) {
            unchecked {
                uint256 interest = (balances[_user] * interestRatePerYear * timeElapsed) / (100 * 365 * 24 * 60 * 60);
                balances[_user] += interest;
            }
            lastUpdated[_user] = block.timestamp;
        }
    }

    /// @notice Deposit ETH into your balance
    /// @dev `receive()` and `fallback()` forward to this so direct transfers count.
    function deposit() public payable whenNotPaused {
        if (msg.value == 0) revert ZeroDeposit();
        _applyInterest(msg.sender);

        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Withdraw `amount` of ETH from your balance
    /// @dev Uses checks-effects-interactions and nonReentrant
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        _applyInterest(msg.sender);
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        // effects
        balances[msg.sender] -= amount;

        // interaction
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        if (!sent) {
            // revert and restore state is automatic because we already changed balances in the same call
            // but to be explicit and safe for future modifications, revert with error
            revert TransferFailed();
        }

        emit Withdraw(msg.sender, amount);
    }

    /// @notice Internal transfer of balance between two user accounts inside the contract
    /// @param to Destination address
    /// @param amount Amount in wei
    function transfer(address to, uint256 amount) external whenNotPaused {
        _applyInterest(msg.sender);
        _applyInterest(to);

        if (to == address(0)) revert InvalidAddress();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        // effects
        unchecked {
            balances[msg.sender] -= amount;
        }
        balances[to] += amount;

        emit TransferInternal(msg.sender, to, amount);
    }

    /* ========== VIEW HELPERS ========== */

    /// @notice Returns stored balance for a user (internal accounting)
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    /// @notice Returns contract ETH balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Simple version tag to help with upgrades/diagnostics
    function version() external pure returns (string memory) {
        return "Bank v1.0.0";
    }

    /* ========== OWNER / ADMIN ========== */

    /// @notice Pause the contract (stops deposits/withdraws/transfers)
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Emergency owner withdraw of ETH from the contract
    /// @dev Only owner can call. Use with caution.
    function emergencyWithdraw(uint256 amount, address payable to) external onlyOwner nonReentrant {
        if (to == address(0)) revert InvalidAddress();
        uint256 contractBal = address(this).balance;
        if (contractBal < amount) revert InsufficientBalance();

        (bool sent, ) = to.call{value: amount}("");
        if (!sent) revert TransferFailed();

        emit EmergencyWithdraw(to, amount);
    }

    /// @notice Rescue accidentally sent ERC20 tokens
    /// @param token ERC20 token contract address
    /// @param to Destination address for rescued tokens
    /// @param amount Amount of tokens to rescue
    function rescueERC20(address token, address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert InvalidAddress();
        IERC20(token).transfer(to, amount);
        emit ERC20Rescued(token, to, amount);
    }

    /* ========== FALLBACKS ========== */

    /// @notice Accept ETH sent directly and treat it as deposit()
    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }
}