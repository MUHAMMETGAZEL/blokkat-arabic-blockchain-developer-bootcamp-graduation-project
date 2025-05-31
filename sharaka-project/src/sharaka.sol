// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title عقد شراكة إسلامي
 * @notice يسمح بجمع الاستثمارات وتوزيع الأرباح حسب الشريعة الإسلامية
 * @dev يستخدم نمط Ownable ونمط Pull Payments لأمان أفضل
 */
contract Sharaka {
    address private _owner;
    mapping(address => uint256) public profits;
    bool private _locked;
    
    struct Investor {
        uint256 investment;
        bool exists;
    }
    
    mapping(address => Investor) public investors;
    address[] public investorAddresses;
    uint256 public totalInvestments;
    uint256 public constant OWNER_SHARE_PERCENT = 30;
    
    event InvestmentReceived(address indexed investor, uint256 amount);
    event ProfitDistributed(address indexed investor, uint256 amount);
    event ProfitWithdrawn(address indexed investor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == _owner, "Not contract owner");
        _;
    }
    
    modifier nonReentrant() {
        require(!_locked, "No reentrancy");
        _locked = true;
        _;
        _locked = false;
    }

    constructor() {
        _owner = msg.sender;
    }
    

    function invest() external payable {
        require(msg.value > 0, "Investment must be greater than 0");
        
        Investor storage investor = investors[msg.sender];
        
        if (!investor.exists) {
            investor.exists = true;
            investorAddresses.push(msg.sender);
        }
        
        investor.investment += msg.value;
        totalInvestments += msg.value;
        emit InvestmentReceived(msg.sender, msg.value);
    }

    function distributeProfits() external payable onlyOwner {
        require(totalInvestments > 0, "No investments yet");
        require(msg.value > 0, "No profits to distribute");
        
        uint256 ownerShare = (msg.value * OWNER_SHARE_PERCENT) / 100;
        uint256 investorsShare = msg.value - ownerShare;
        
        payable(_owner).transfer(ownerShare);
        
        for (uint256 i = 0; i < investorAddresses.length; i++) {
            address investor = investorAddresses[i];
            uint256 share = (investorsShare * investors[investor].investment) / totalInvestments;
            profits[investor] += share;
            emit ProfitDistributed(investor, share);
        }
    }

    function withdrawProfits() external nonReentrant {
        uint256 amount = profits[msg.sender];
        require(amount > 0, "No profits to withdraw");
        
        profits[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit ProfitWithdrawn(msg.sender, amount);
    }

    function getInvestorCount() external view returns (uint256) {
        return investorAddresses.length;
    }
}