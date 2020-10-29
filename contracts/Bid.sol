pragma solidity >0.4.2;

contract Bid {

    uint public amount;
    address public bidder ;

    constructor(uint _amount, address _bidder) public {
    amount = _amount;
    bidder = _bidder;
    }

    function GetAmount() public view returns(uint){
        return amount;
    }

}