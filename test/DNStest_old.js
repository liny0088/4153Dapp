// var DNS = artifacts.require("./DNS.sol");

// contract("DNS", function(accounts) {
//     var dnsInstance;

// it("initializes with two domains", function() {
//     return DNS.deployed().then(function(instance) {
//       return instance.domain_count();
//     }).then(function(count) {
//       assert.equal(count, 2);
//     });
//   });

// it("Bid started", function() {
//     return DNS.deployed().then(function(instance) {
//         dnsInstance = instance;
//         dnsInstance.Start_Bid(1);
//       return dnsInstance.bid_events(1);
//     }).then(function(event) {
//       assert.equal(event[0], 1, "contains the correct domainid");
//       assert.equal(event[1], 0, "contains the correct cur highest price");
//     assert.equal(event[2], true, "is ongoing");
//       assert.equal(event[3], "999", "has correct winner addr");
//     });
//   });

// it("New bid inserted", function() {
//     return DNS.deployed().then(function(instance) {
//         dnsInstance = instance;
//         dnsInstance.Start_Bid(1);
//         dnsInstance.Insert_Bid(250, 23333, 1);
//         return dnsInstance.bid_events(1);
//         }).then(function(event) {
//             assert.equal(event[4], 1, "contains the correct bid count");
//             // assert.equal(event[5][0].GetAmount(), 250, "contains the correct cur highest price");
//             console.log("===== 36 ", event[5]);
//             return event[5];
//         }).then(function (array) {
//             console.log("====== 39 ", array);
//             assert.equal(array[0].GetAmount(), 250, "contains the correct cur highest price");
//         })
//     });

// });




