import React from 'react';

export default ({ comments }) => {
  const renderedComments = comments.map(comment => {
    let content;
    content = comment.content;
    
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
