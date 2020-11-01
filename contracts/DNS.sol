pragma solidity >0.4.2;

import './Bid_Event.sol';

contract DNS {

    struct Domain {
        string  domain_name;
        bool  registered;
        address owner_address;
        uint price; // address type
        }

    // mapping(string => Domain) public domains;
    uint public domain_count = 0;

    Domain[] domains;

    mapping(string => Bid_Event) public bid_events;
    uint public event_count = 0;

    constructor() public {
        address yuling = 0xc0ffee254729296a45a3885639AC7E10F9d54979;
        createNewDNSEntry( "yl.ntu" , yuling, 88); // Address = 0x001d3f1ef827552ae1114027bd3ecf1f086ba0f9   address owner = 0xc0ffee254729296a45a3885639AC7E10F9d54979
        // Bid[] memory bids;
        // bid_events[event_count] = Bid_Event( 1, 200, false, "yl_address" , 0 , new Bid[](0));
    }

    //  every Name has a Bid map containig all bids for the map
    //  mapping (bytes32 => BidContainer) bidContainerMap;

 

        function createNewDNSEntry( string memory _name, address _winner, uint _price) private returns (bool _created)
        {
        // domains[_name].domain_name = _name;
        // domains[_name].owner_address = _winner;
        // domains[_name].registered = true;
        // domains[_name].price = _price;
        domains.push(Domain(_name, true,_winner, _price));
    domain_count += 1;
    return true;
    }

    function Start_Bid (uint _price, string memory _domain_name) public {
        Bid_Event _event = new Bid_Event( _price, _domain_name);
        bid_events[_domain_name] = _event;
        event_count += 1;
    }

    // function Search_Bid_Event(string _domain_name) public{
        // return index
    // }

    function Insert_Bid(uint _amount, string memory _domain_name) public{  // later change to address the _bidder
        bid_events[_domain_name].addBid(_amount, msg.sender);
    }

    function End_Bid ( string memory _domain_name) public{
        address winner = bid_events[_domain_name].endBidGetWinner();
        uint price = bid_events[_domain_name].getWinnerPrice(); // need ?
        createNewDNSEntry( _domain_name, winner, price);
    }

     function getTotalEtherHeldInContract() public view returns (uint) {
         return address(this).balance;
     }

    function Search_Registered ( uint  _index) public view returns (address){
        if(checkNameExists(_index))
        {address owner = domains[_index].owner_address ;
        return owner;}
        else
        {return address(0);}
    }

    function Search_bid_Time ( string memory _domain_name) public view returns (uint startTime){
        if(bid_events[_domain_name].ongoing())
        { startTime = bid_events[_domain_name].getTime() ;
        return startTime;}
        else
        {return uint(0);}
    }

    // struct Buyer{
    //     uint ip;
    //     uint price;
    //     string name;
    // }
    
    function checkNameExists(uint _index) public view returns(bool _exists){
        return domains[_index].registered;
    }
}