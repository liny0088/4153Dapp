pragma solidity >0.4.2;

import './Bid_Event.sol';

contract DNS {

    struct Domain {
        string  domain_name;
        bool  registered;
        address owner_address;
        uint price; // address type
        }

    event DomainRegistered(
    string domainName,
    address owner
  );

    event DomainUnregistered(
    string domainName,
    address owner
  );

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
        if (_winner == address(0)){
            _winner = msg.sender;
        }

        domains.push(Domain(_name, true,_winner, _price));
        domain_count += 1;
        return true;
        emit DomainRegistered(_name, _winner);
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

    function Search_by_Name ( string memory _name) public view returns (address _add, bool _registered, uint _idx){
        for (uint i = 0; i< domain_count; i++){
            string memory cur_name = domains[i].domain_name;
            if (keccak256(bytes(cur_name)) == keccak256(bytes(_name))){
                _add = domains[i].owner_address;
                _registered = domains[i].registered;
                _idx = i;
                return ( _add,  _registered , _idx) ;
            }
        }
        return ( address(0), false, 0); // when not found
    }

    function Search_Registered ( uint  _index) public view returns (address){
        if(checkIndexExists(_index))
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
    
    function checkIndexExists(uint _index) public view returns(bool _exists){
        return domains[_index].registered;
    }

    function checkNameExists(string memory _name) public view returns(bool _exists){
         ( , _exists, ) = Search_by_Name(_name);
        return _exists; 
    }

    //returns the registered domain information in the array registeredDomains at the index _index
    function getDomain(uint _index) public view
    returns(string memory domainName,address owner){
        domainName = domains[_index].domain_name;
        owner = domains[_index].owner_address;
    }

    //returns the number of registered domains
    function getDomainsLength() public view returns(uint count) {
        return domain_count;
    }

    // function registerDomain(string memory _domainName) public  --->>> function createNewDNSEntry( string memory _name, address _winner, uint _price) 

    function unregisterDomain(string memory _domainName , uint _domainIndex) public {
        ( , bool _exists, ) = Search_by_Name(_domainName);
        require(_exists == true,"domain is not registered");
        require(domains[_domainIndex].owner_address == msg.sender,"not owner of domain");
        // uint idx = Search_by_Name(_domainName)[2];
        domains[_domainIndex].registered = false;
        domains[_domainIndex] = domains[domain_count-1];
        delete domains[domain_count-1];
        domain_count --;
        emit DomainUnregistered(_domainName, msg.sender);
    }

}