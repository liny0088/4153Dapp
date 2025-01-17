App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    // const todoList = await $.getJSON('TodoList.json')
    // App.contracts.TodoList = TruffleContract(todoList)
    // App.contracts.TodoList.setProvider(App.web3Provider)

    // // Hydrate the smart contract with values from the blockchain
    // App.todoList = await App.contracts.TodoList.deployed()

    // const domainRegistrar = await $.getJSON('DomainRegistrar.json')
    // App.contracts.DomainRegistrar = TruffleContract(domainRegistrar)
    // App.contracts.DomainRegistrar.setProvider(App.web3Provider)

    // // Hydrate the smart contract with values from the blockchain
    // App.domainRegistrar = await App.contracts.DomainRegistrar.deployed()

    const dns = await $.getJSON('DNS.json')
    App.contracts.DNS = TruffleContract(dns)
    App.contracts.DNS.setProvider(App.web3Provider)
    // Hydrate the smart contract with values from the blockchain
    App.dns = await App.contracts.DNS.deployed()

  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html("Account: " + App.account)

    // Render Tasks
    //await App.renderTasks()
    await App.renderDomains()
    // Update loading state
    App.setLoading(false)
  },
  renderDomains: async () => {
    $('#regDomainList').html("")
    $('#yourDomainList').html("")
    // Load the total task count from the blockchain
    let domainCount = await App.dns.getDomainsLength()
    const $domainTemplate = $('.domainTemplate')
    domainCount = domainCount.toNumber()
    console.log(domainCount)
    // Render out each task with a new task template
    for (var i = 0; i < domainCount; i++) {
      // Fetch the task data from the blockchain
      const domain = await App.dns.getDomain(i)
      console.log(domain)
      const domainName = domain[0] + ".ntu"
      const owner = domain[1]

      // Create the html for the task
      const $newTaskTemplate = $domainTemplate.clone()
      $newTaskTemplate.find('.content').html(domainName + " Owner: " + owner)
      

      // Put the task in the correct list
      if (App.account == owner) {
        $yournewTaskTemplate = $newTaskTemplate.clone()
        $yournewTaskTemplate.append(`<button domainid="${domain[0]}" index=${0} type="button" onClick="App.unregisterDomain(event); return false;" class="btn btn-danger" >UnRegister</button>`)
        
        $('#yourDomainList').append($yournewTaskTemplate)
        $yournewTaskTemplate.show()
      }
      $('#regDomainList').append($newTaskTemplate)

      // Show the task
      $newTaskTemplate.show()
    }
  },

  // renderTasks: async () => {
  //   // Load the total task count from the blockchain
  //   const taskCount = await App.todoList.taskCount()
  //   const $taskTemplate = $('.taskTemplate')

  //   // Render out each task with a new task template
  //   for (var i = 1; i <= taskCount; i++) {
  //     // Fetch the task data from the blockchain
  //     const task = await App.todoList.tasks(i)
  //     const taskId = task[0].toNumber()
  //     const taskContent = task[1]
  //     const taskCompleted = task[2]

  //     // Create the html for the task
  //     const $newTaskTemplate = $taskTemplate.clone()
  //     $newTaskTemplate.find('.content').html(taskContent)
  //     $newTaskTemplate.find('input')
  //                     .prop('name', taskId)
  //                     .prop('checked', taskCompleted)
  //                     .on('click', App.toggleCompleted)

  //     // Put the task in the correct list
  //     if (taskCompleted) {
  //       $('#completedTaskList').append($newTaskTemplate)
  //     } else {
  //       $('#taskList').append($newTaskTemplate)
  //     }

  //     // Show the task
  //     $newTaskTemplate.show()
  //   }
  // },

  createTask: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    await App.todoList.createTask(content)
    window.location.reload()
  },

  searchDomain: async () => {
    App.setLoading(true)
    $('#regButton').hide()
    const content = $('#searchDomain').val()
    if(content.indexOf(' ') >= 0){
      const reg = $('#registerStatus')
      reg.text("Domain name invalid")
    }
    else{
      App.domainSearched = content
      const registeredStatus = await App.dns.checkNameExists(content) // content is the domain name entered by user in UI
      const reg = $('#registerStatus')
      if(registeredStatus == false)
      {
       $('#regButton').show()
      }
      reg.text(registeredStatus?"Registered status: Domain is taken":"Registered status: Domain is not taken")
    }
    
    App.setLoading(false)
    App.render();
  },

  registerDomain: async () => {
    App.setLoading(true)
    await App.dns.createNewDNSEntry(App.domainSearched, '0x0000000000000000000000000000000000000000', 0)
    $('#regButton').hide()
    alert(App.domainSearched + "domain registered")
    App.setLoading(false)
    App.render();
  },

  unregisterDomain: async (e) => {
    e.preventDefault()
    App.setLoading(true)
    console.log(e)
    const index = e.target.getAttribute('index')
    const domainName = e.target.getAttribute('domainid')
    console.log(domainName)
    await App.dns.unregisterDomain(domainName, parseInt(index))
    App.setLoading(false)
    App.render();
  },
  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
ethereum.on('accountsChanged', function (accounts) {
  // Time to reload your interface with accounts[0]!
  if(App.account != undefined)
  {
    window.location.reload()
  }
})