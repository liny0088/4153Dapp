var DNS = artifacts.require("./DNS.sol");

contract("DNS", function(accounts) {
    var dnsInstance;

it("initializes with 1 domain", function() {
    return DNS.deployed().then(function(instance) {
    return instance.domain_count();
    //   assert.equal(instance.checkNameExists("yl.ntu"), true);
    }).then(function(count) {
        assert.equal(count, 1);
      });
  });

it("initializes with the domain yl.ntu, checkNameExists works", function() {
    return DNS.deployed().then(function(instance) {
    return instance.checkNameExists.call('yl.ntu')
    .then(function(registered) {
      assert.equal(registered, true, 'yl.ntu is registered');
    });
    })
  });

  it("initialized, checkNameExists gives false for non-existent names", function() {
    return DNS.deployed().then(function(instance) {
    return instance.checkNameExists.call('yyyyllll.ntu')
    .then(function(registered) {
      assert.equal(registered, false, 'yyyyllll.ntu is NOT registered');
    });
    //   assert.equal(instance.checkNameExists("yl.ntu"), true);
    })
  });

it("initializes with yl.ntu and registered is true", function() {
    return DNS.deployed().then(function(instance) {
      return instance.getDomain.call(0);
    }).then(function(Domain) {
        assert.equal(Domain[1], true);
        assert.equal(Domain[0], "yl.ntu");
        console.log("address of added domain yl.ntu, is ", Domain[2]);
        assert.equal(Domain[3], 88);

      });
    
  });

it("Bid started with yuling111.ntu, ended with winner", function() {
    return DNS.deployed().then(function(instance) {
        dnsInstance = instance;
        dnsInstance.Start_Bid(120, "yuling111.ntu");
        dnsInstance.End_Bid("yuling111.ntu");
        return instance.getDomain.call(1);
     }).then(function(Domain) {
        assert.equal(Domain[1], true);
        assert.equal(Domain[0], "yuling111.ntu");
        console.log("address of added domain yuling111.ntu, is ", Domain[2]);
        assert.equal(Domain[3], 120);
      });
  });

  it("Bid started with yuling111.ntu, with 1 more bid, the price is right", function() {
    return DNS.deployed().then(function(instance) {
        dnsInstance = instance;
        dnsInstance.Start_Bid(120, "yuling111.ntu");
        dnsInstance.Insert_Bid(200, "yuling111.ntu") 
        dnsInstance.End_Bid("yuling111.ntu");
        return instance.getDomain.call(1);
     }).then(function(Domain) {
        assert.equal(Domain[1], true);
        assert.equal(Domain[0], "yuling111.ntu");
        console.log("address of added domain yuling111.ntu, is ", Domain[2]);
        assert.equal(Domain[3], 200);
      });
  });

  it("Search registered address gives the result", function() {
    return DNS.deployed().then(function(instance) {
    dnsInstance = instance;
    dnsInstance.Start_Bid(120, "yuling111.ntu");
    dnsInstance.Insert_Bid(200, "yuling111.ntu") 
    dnsInstance.End_Bid("yuling111.ntu");    
    return instance.Search_by_Name.call('yuling111.ntu')
    .then(function(domain) {
      console.log("address is :", domain[0]);
      assert.notEqual(domain[0], '0x0000000000000000000000000000000000000000');
    });
    })
  });

  it("Search non-registered address gives address 0", function() {
    return DNS.deployed().then(function(instance) {
    dnsInstance = instance;
    dnsInstance.Start_Bid(120, "yuling111.ntu");
    dnsInstance.Insert_Bid(200, "yuling111.ntu"); 
    dnsInstance.End_Bid("yuling111.ntu");    
    return instance.Search_by_Name.call('blockchain.ntu')
    .then(function(domain) {
      assert.equal(domain[0], '0x0000000000000000000000000000000000000000');
    });
    })
  });

it("Search non-ongoing bids, returns 0 time", function() {
    return DNS.deployed().then(function(instance) {
    dnsInstance = instance;
    dnsInstance.Start_Bid(120, "yuling111.ntu"); 
    console.log(instance.Search_bid_Time.call("yuling111.ntu"));
    return instance.Search_bid_Time.call("blablah.ntu")
    .then(function(time) {
      assert.equal(time, 0);
    });
    })
  });

//   it("Bid started with yuling111.ntu, with 1 more bid, the price is right", function() {
//     return DNS.deployed().then(function(instance) {
//         dnsInstance = instance;
//         dnsInstance.Start_Bid(120, "yuling111.ntu");
//         
//       return dnsInstance.bid_events("yuling111.ntu");
//     }).then(function(event_instance) {
//       return event_instance.cur_highest_price()
//       .then(function(price){
//         assert.equal(price, 120);
//         });
//     });
//     });



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

});




