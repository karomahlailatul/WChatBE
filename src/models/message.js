const Pool = require("../config/db");

const selectAllUsersID = (UsersID) => {
  return Pool.query(`select  message.id, message.content, message.sender, message.receiver , message.created_on  from message  inner join users on users.id = sender or users.id = receiver  where sender =  '${UsersID}' or receiver = '${UsersID}' `);
};

const insertMessage = (id, content, sender, receiver, created_on) => {
  return Pool.query(`insert into message (  id , sender , receiver , content ,created_on) values ('${id}', '${sender}', '${receiver}', '${content}' , '${created_on}')`);
};

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
  return Pool.query(`select message.id, message.sender, message.receiver, message.content, message.created_on  from message   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset}`);
};

const selectAllSearch = (querysearch) => {
  return Pool.query(`select * from message  ${querysearch} `);
};

const deleteAllMessageSenderIdReceiverId = ({ querySender, queryReceiver }) => {
  return Pool.query(`delete from message  where sender =  '${querySender}' and receiver = '${queryReceiver}' or sender =  '${queryReceiver}' and receiver = '${querySender}'`);
};

module.exports = {
  selectAllUsersID,
  insertMessage,
  selectPagination,
  selectAllSearch,
  deleteAllMessageSenderIdReceiverId,
};
