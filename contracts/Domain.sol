pragma solidity >0.4.2;

contract Domain {

    uint public id;
    string public domain_name;
    bool public registered;
    string public owner_address;

    constructor (string memory _domain_name) public {
        registered = false;
        owner_address = '';
        domain_name = _domain_name;
    }


    function Assign (string memory  _address) public {
        owner_address = _address;
    }

    function Register()public{
        registered = true;
    }

    function GetOwner() public view returns(string memory){
        return owner_address;
    }

}