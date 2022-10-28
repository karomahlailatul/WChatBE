const Pool = require("../config/db");

const selectAllUsersID = (UsersID) => {
  return Pool.query(`select
	group_chat.id ,
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
    from group_chat  
    inner join users on users.id = owner_id `);
  // where   '${UsersID}' = ANY(group_member)  `);
};

const checkMemberGroupChat = (id) => {
  return Pool.query(`
	select * 
	from  group_chat
    where id = '${id}'`);
};

const insertMember = (id, group_chat_id) => {
  return Pool.query(`update group_chat set group_member = array_append(group_member, '${id}') where id = '${group_chat_id}';`);
};

const updateMemberLeave = (id, group_chat_id) => {
  return Pool.query(`update group_chat set group_member = array_remove(group_member, '${id}') where id = '${group_chat_id}';`);
};

const updateMemberLeaveAdmin = (group_member, group_chat_id) => {
  return Pool.query(`update group_chat set group_member = '{${group_member}}' where id = '${group_chat_id}';`);
};

const insertGroupChatLogo = (id, owner_id, group_name, group_member, group_logo) => {
 
  return Pool.query(`insert into group_chat 
	  (  id , owner_id, group_name,  group_logo , group_member   )
	   values 
	   ( '${id}', '${owner_id}', '${group_name}', '${group_logo}', '{${group_member}}' ) 
	   returning id , owner_id , group_name, group_logo , group_member , created_on `);
};

const insertGroupChatNoLogo = (id, owner_id, group_name, group_member) => {
  return Pool.query(
    `insert into group_chat ( id , owner_id, group_name, group_member, group_logo ) values ('${id}', '${owner_id}', '${group_name}', '{${group_member}}' , null ) returning id , owner_id, group_name, group_logo , group_member , created_on `
  );
};

const updateGroupChatLogo = (id, owner_id, group_name, group_member, group_logo) => {
  return Pool.query(
    `update group_chat set 
	owner_id = '${owner_id}' , 
	group_name = '${group_name}' , 
	group_member = '{${group_member}}',
	group_logo= '${group_logo}'
	WHERE id = '${id}'
	returning id , owner_id, group_name, group_logo , group_member , created_on `
  );
};

const updateGroupChatNoLogo = (id, owner_id, group_name, group_member) => {
  return Pool.query(
    `update group_chat set 
	 owner_id = '${owner_id}' , 
	 group_name = '${group_name}' ,
	 group_member = '{${group_member}}'
	 where id = '${id}'
	 returning id , owner_id, group_name, group_logo , group_member , created_on`
  );
};

const selectUsers = (id) => {
  return Pool.query(`select count(*) from users where id='${id}'`);
};

const selectGroupChat = (id) => {
  return Pool.query(`select count(*) from group_chat where id='${id}'`);
};

const deleteGroupChat = (id) => {
  return Pool.query(`delete from group_chat where id='${id}'`);
};

module.exports = {
  selectAllUsersID,
  checkMemberGroupChat,
  insertMember,
  updateMemberLeave,
  insertGroupChatLogo,
  insertGroupChatNoLogo,
  selectUsers,
  selectGroupChat,
  deleteGroupChat,
  updateGroupChatLogo,
  updateGroupChatNoLogo,
  updateMemberLeaveAdmin,
  // insertMessage,
  // selectPagination,
  // selectAllSearch,
  // deleteAllMessageSenderIdReceiverId
};
