pragma solidity ^0.5.0;

contract DomainRegistrar {

  Domain[] registeredDomains;

  struct Domain {
    string domainName;
    address owner;
  }

  mapping(string => bool) public domains;

  event DomainRegistered(
    string domainName,
    address owner
  );

  event DomainUnregistered(
    string domainName,
    address owner
  );

  constructor() public {
  }

  function registerDomain(string memory _domainName) public {
    require(domains[_domainName] == false,"domain already registered");
    domains[_domainName] = true;
    registeredDomains.push(Domain(_domainName,msg.sender));
    emit DomainRegistered(_domainName,msg.sender);
  }
  function unregisterDomain(string memory _domainName , uint _domainIndex) public {
    require(domains[_domainName] == true,"domain is not registered");
    require(registeredDomains[_domainIndex].owner == msg.sender,"not owner of domain");
    //swap the array element at _index with the last element and then remove the last element(which used to be at _index)
    domains[_domainName] = false;
    registeredDomains[_domainIndex] = registeredDomains[registeredDomains.length-1];
    delete registeredDomains[registeredDomains.length-1];
    registeredDomains.length--;
    emit DomainUnregistered(_domainName,msg.sender);
  }

  //returns the registered domain information in the array registeredDomains at the index _index
    function getDomain(uint _index) public view
    returns(string memory domainName,address owner){
        domainName = registeredDomains[_index].domainName;
        owner = registeredDomains[_index].owner;
    }
    //returns the number of registered domains
    function getDomainsLength() public view returns(uint count) {
        return registeredDomains.length;
    }
}
