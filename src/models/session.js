const Pool = require("../config/db");

const selectAllSession = () => {
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
};
const selectAllSessionId = (sessionID) => {
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
};

const insertSessionAndUsers = (id, email, password, username, verify, session_id, users_id, connection) => {
  return Pool.query(
    `insert into users ( id, email ,password, username , verify ) values ('${id}', '${email}', '${password}', '${username}', '${verify}' ); insert into session ( id , users_id ,connection ) values ('${session_id}', '${users_id}', '${connection}')`
  );
};

const updateSessionConnectionTrue = (sessionID) => {
  return Pool.query(`update session set connection = 'true' WHERE id = '${sessionID}'`);
};

const updateSessionConnectionFalse = (sessionID) => {
  return Pool.query(`update session set connection = 'false' WHERE id = '${sessionID}'`);
};

module.exports = {
  selectAllSession,
  selectAllSessionId,
  insertSessionAndUsers,
  updateSessionConnectionTrue,
  updateSessionConnectionFalse,
};
