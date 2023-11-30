var CommentList = artifacts.require("./CommentList.sol");

module.exports = function(deployer) {
  deployer.deploy(CommentList);
};
