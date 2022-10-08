const Pool = require('../config/db')

const selectAllSession = () => {
    // return Pool.query(`select * from skill`);
   return Pool.query(`select 
   session.id , 
   session.users_id ,
   session.connection ,
   users.email,
   users.phone,
   users.username,
   users.name,
   users.picture,
   users.status,
   users.created_on,
   users.updated_on 
   from session inner join users on session.users_id = users.id  `);
}
const selectAllSessionId = (sessionID) => {
    // return Pool.query(`select * from skill`);
   return Pool.query(`select 
   session.id , 
   session.users_id ,
   session.connection ,
   users.email,
   users.phone,
   users.username,
   users.name,
   users.picture,
   users.status,
   users.created_on,
   users.updated_on 
   from session inner join users on session.users_id = users.id  where session.id = '${sessionID}' `);
}

const insertSessionAndUsers = (
    id , email , password, username , verify , session_id , users_id ,connection
) => {
    return Pool.query(`insert into users ( id, email ,password, username , verify ) values ('${id}', '${email}', '${password}', '${username}', '${verify}' ); insert into session ( id , users_id ,connection ) values ('${session_id}', '${users_id}', '${connection}')`)
}

const updateSessionConnectionTrue = (sessionID) => {
    return Pool.query(`update session set connection = 'true' WHERE id = '${sessionID}'`)
} 


const updateSessionConnectionFalse = (sessionID) => {
    return Pool.query(`update session set connection = 'false' WHERE id = '${sessionID}'`)
} 

// const selectAllSearch = (querysearch) => {
//     return Pool.query(`select * from skill  ${querysearch} `);
// }

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
    selectAllSession,
    selectAllSessionId,
    insertSessionAndUsers,
    updateSessionConnectionTrue,
    updateSessionConnectionFalse
    // selectAllSearch,
    // selectPagination,
    // selectSkill,
    // insertSkill,
    // updateSkill,
    // deleteSkill,
    // countData
}


