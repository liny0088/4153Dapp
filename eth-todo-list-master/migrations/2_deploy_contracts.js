var TodoList = artifacts.require("./TodoList.sol");
var DomainRegistrar = artifacts.require("./DomainRegistrar.sol");

module.exports = function(deployer) {
  deployer.deploy(TodoList);
  //deploy another smart contract if need to be depoyed in order then use deployed.then()
  deployer.deploy(DomainRegistrar);

};
