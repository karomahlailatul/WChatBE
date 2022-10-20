const Pool = require('../config/db')

const selectAllUsersID = (UsersID) => {
<<<<<<< HEAD
    return Pool.query(`select  message.id, message.content, message.sender, message.receiver , message.created_on  from message  inner join users on users.id = sender or users.id = receiver  where sender =  '${UsersID}' or receiver = '${UsersID}' `);
}

const insertMessage = (
    id , content, sender, receiver , created_on
=======
    return Pool.query(`select  message.id, message.sender, message.receiver, message.content, message.created_on, users.id as users_id, users.email, users.phone,  users.username,  users.name,  users.picture,  users.status  from message  inner join users on users.id = sender or users.id = receiver  where sender =  '${UsersID}' or receiver = '${UsersID}' `);
}

const insertMessage = (
    id , content, sender, receiver
>>>>>>> 361c1f7d7fdd2b65eee8e1a8b126c6e744dfe22a
) => {
    return Pool.query(`insert into message (  id , sender , receiver , content ,created_on) values ('${id}', '${sender}', '${receiver}', '${content}' , '${created_on}')`)
}

const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
    // return Pool.query(`select message.id, message.sender, message.receiver, message.content, message.created_on, users.id as users_id, users.email, users.phone,  users.username,  users.name,  users.picture,  users.status  from message  inner join users on users.id = sender or users.id = receiver  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset}`);
    return Pool.query(`select message.id, message.sender, message.receiver, message.content, message.created_on  from message   ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset}`);
}

// const selectAll = () => {
//     return Pool.query(`select * from skill`);
// }

const selectAllSearch = (querysearch) => {
    return Pool.query(`select * from message  ${querysearch} `);
}

const deleteAllMessageSenderIdReceiverId = ({querySender,queryReceiver}) => {
    return Pool.query(`delete from message  where sender =  '${querySender}' and receiver = '${queryReceiver}' or sender =  '${queryReceiver}' and receiver = '${querySender}'`)
}

// const selectPagination = ({ limit, offset, sortby, sort, querysearch }) => {
//     return Pool.query(`select * from skill  ${querysearch}  order by ${sortby} ${sort} limit ${limit} offset ${offset} `)
// }
// const selectSkill = (id) => {
//     return Pool.query(`select * from skill where id='${id}'`);
// }

// const insertSkill = (
//     id,
//     name
// ) => {
//     return Pool.query(`insert into skill ( id, name ) values ('${id}', '${name}' )`)
// }

// const updateSkill = (
//     id, name
// ) => {
//     return Pool.query(`update skill set name = '${name}' WHERE id = '${id}'`)
// }

// const deleteSkill = (id) => {
//     return Pool.query(`delete from skill where id='${id}'`)
// }

// const countData = () => {
//     return Pool.query("SELECT COUNT(*) FROM skill");
// };

module.exports = {
    selectAllUsersID,
    insertMessage,
    selectPagination,
    // selectAll,
    selectAllSearch,
    deleteAllMessageSenderIdReceiverId,
    // selectPagination,
    // selectSkill,
    // insertSkill,
    // updateSkill,
    // deleteSkill,
    // countData
}


