const Pool = require("../config/db");

const selectAllUsersID = () => {
  return Pool.query(`select
	message_group.id ,
	message_group.sender ,
	message_group.content ,
	message_group.content_type,
	message_group.group_chat_id ,
	group_chat.owner_id ,
	group_chat.group_name ,
	group_chat.group_logo ,
	group_chat.group_member,
	group_chat.created_on ,
	users.email ,
	users.phone ,
	users.username ,
	users.name ,
	users.picture ,
	users.status ,
	users.created_on as users_created_on
	from
	message_group
	inner join users on
	users.id = message_group.sender
	inner join group_chat on
	group_chat.id = message_group.group_chat_id 
	`);
};

const insertMessage = (id, content, sender, group_chat_id, content_type, created_on) => {
  return Pool.query(`insert into message_group (  id , sender , group_chat_id , content ,content_type, created_on) values ('${id}', '${sender}', '${group_chat_id}', '${content}' , '${content_type}' , '${created_on}')`);
};

module.exports = {
  selectAllUsersID,
  insertMessage,
};
