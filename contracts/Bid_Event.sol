pragma solidity >0.4.2;

import './Bid.sol';

contract Bid_Event {

    string public domain_name;
    uint public cur_highest_price;
    bool public ongoing;
    address public cur_highest_address;
    uint public createTime;
    uint public overbid_count = 0;

    mapping(address => Bid) public bids;  // Address = 0x001d3f1ef827552ae1114027bd3ecf1f086ba0f9   address owner = 0xc0ffee254729296a45a3885639AC7E10F9d54979
    
    uint public bit_count;

    constructor(uint _cur_highest_price, string memory _domain_name) public {
        cur_highest_price = _cur_highest_price;
        cur_highest_address = msg.sender;
        domain_name = _domain_name; 
        createTime = block.timestamp;
        ongoing = true;
        bit_count += 1;
    }

    function addBid(uint _price, address _bidder) public returns(bool added) {
        Bid bid = new Bid(_price, _bidder);
        bids[_bidder] = bid;
        // add price it to sender balanace
        // update the currentPrice
        if (cur_highest_price < _price){
            cur_highest_price = _price;
            cur_highest_address = _bidder;
            overbid_count += 1;
        }
        bit_count += 1;
        return true;
    }

    function getBidAmount(address _sender) public view returns(uint amount) {
     Bid bid = bids[_sender];
     return bid.amount();
    }
    
    function endBidGetWinner() public returns( address highest_address){
        ongoing = false;
        return cur_highest_address; 
    }

    function getWinnerPrice() public view returns (uint amount){
        return cur_highest_price;
    }

    function getTime() public view returns (uint amount){
        return createTime;
    }
    function over_bid_count() public view returns (uint amount){
        return overbid_count;
    }
}