const Pool = require('../config/db')

const selectAllUsersID = (UsersID) => {
    return Pool.query(`select * from message where sender =  '${UsersID}' or receiver = '${UsersID}' `);
}

const insertMessage = (
    id , sender , receiver , content
) => {
    return Pool.query(`insert into message (  id , sender , receiver , content ) values ('${id}', '${sender}', '${receiver}', '${content}')`)
}


// const selectAll = () => {
//     return Pool.query(`select * from skill`);
// }

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
    selectAllUsersID,
    insertMessage,
    // selectAll,
    // selectAllSearch,
    // selectPagination,
    // selectSkill,
    // insertSkill,
    // updateSkill,
    // deleteSkill,
    // countData
}


