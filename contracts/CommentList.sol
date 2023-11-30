pragma solidity ^0.5.0;

contract CommentList {
  uint public commentCount = 0;

  struct Comment {
    uint id;
    string content;
    bool deleted;
  }

  mapping(uint => Comment) public comments;

  event CommentCreated(
    uint id,
    string content,
    bool deleted
  );

  event CommentDeleted(
    uint id,
    bool deleted
  );

  constructor() public {
    createComment("created Comment");
  }

  function createComment(string memory _content) public {
    commentCount ++;
    comments[commentCount] = Comment(commentCount, _content, false);
    emit CommentCreated(commentCount, _content, false);
  }

  function toggleDeleted(uint _id) public {
    Comment memory _comment = comments[_id];
    _comment.deleted = !_comment.deleted;
    comments[_id] = _comment;
    emit CommentDeleted(_id, _comment.deleted);
  }
}
