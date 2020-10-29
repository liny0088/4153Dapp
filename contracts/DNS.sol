pragma solidity >0.4.2;

import './Bid.sol';

contract DNS {

    // store candidate, read candidiat, constructor

    // string public candidate;
    // uint public votes;
    struct Domain {
        uint  id;
        string  domain_name;
        bool  registered;
        string  owner_address; // address type
        }

    struct Bid_Event{
        uint domain_id;
        uint cur_highest_price;
        bool ongoing;
        string  cur_higehst_address;  // address type
        uint bit_count;
        Bid[] bids;
    }

    mapping(uint => Domain) public domains;
    uint public domain_count = 0;

    mapping(uint => Bid_Event) public bid_events;
    uint public event_count = 0;

    constructor () public {
        domains[0] = Domain(0, "yl.ntu", false, "0");
        domains[1] = Domain(1, "ct.ntu", false, "0");
        domain_count = 2;
        // Bid[] memory bids;
        bid_events[event_count] = Bid_Event( 1, 200, false, "yl_address" , 0 , new Bid[](0));
        event_count += 1;
    }

    function Start_Bid (uint _domainid) public{
        bid_events[event_count] = Bid_Event( _domainid, 0, true, "999" , 0 , new Bid[](10));
        event_count += 1;
    }

    // function Search_Bid_Event(string _domain_name) public{
        // return index
    // }

    function Insert_Bid(uint _amount, uint _bidder, uint _index) public{  // later change to address the _bidder
        Bid _bid = new Bid(_amount, address(_bidder)); 
        bid_events[_index].bids.push(_bid);
        bid_events[_index].bit_count += 1;
    }

    function End_Bid (uint _index) public{
        bid_events[_index].ongoing = false;
        domains[bid_events[_index].domain_id].owner_address = bid_events[_index].cur_higehst_address;
        // transcation ??
    }



    // struct Buyer{
    //     uint ip;
    //     uint price;
    //     string name;
    // }




}