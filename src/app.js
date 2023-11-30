App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
    web3.eth.defaultAccount = App.account;

  },

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
    const commentList = await $.getJSON('CommentList.json')
    App.contracts.CommentList = TruffleContract(commentList)
    App.contracts.CommentList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.commentList = await App.contracts.CommentList.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderComment()

    // Update loading state
    App.setLoading(false)
  },

  renderComment: async () => {
    
    const commentCount = await App.commentList.taskCount()
    const $commentTemplate = $('.taskTemplate')

    
    for (var i = 1; i <= commentCount; i++) {
     
      const comment = await App.commentList.comments(i)
      const commentId = comment[0].toNumber()
      const commentContent = comment[1]
      const commentDeleted = comment[2]

   
      const $newCommentTemplate= $commentTemplate.clone()
      $newCommentTemplate.find('.content').html(commentContent)
      $newCommentTemplate.find('input')
                      .prop('name', commentId)
                      .prop('checked', commentDeleted)
                      .on('click', App.toggleDeleted)

      if (!commentDeleted) {
        $('#comment').append($newTaskTemplate)
      } 
 
      $newCommentTemplate.show()
    }
  },

  addComment: async () => {
    App.setLoading(true)
    const content = $('#newComment').val()
    await App.commentList.addComment(content)
    window.location.reload()
  },

  toggleDeleted: async (e) => {
    App.setLoading(true)
    const commentId = e.target.name
    await App.commentList.toggleDeleted(commentId)
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
