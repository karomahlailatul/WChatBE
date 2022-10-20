const Pool = require("../config/db");

const findEmail = (email) => {
  return Pool.query(`SELECT * FROM users WHERE email='${email}'`);
};


const findUsername = (username) => {
  return Pool.query(`select * from users where username='${username}'`);
};

const findId = (id) => {
  return Pool.query(`select * from users where id='${id}'`);
};

const findEmailSession = (email) => {
  return Pool.query(`select users.id  ,  users.email  ,  users.password  ,  users.phone  ,  users.username  ,  users.name  ,  users.picture  , users.status , users.verify , users.created_on , users.updated_on ,  session.id as session_id  , session.connection  from users  inner join session on users.id = session.users_id where email='${email}'`);
};

const findUsernameSession = (username) => {
  return Pool.query(`select users.id  ,  users.email  ,  users.password  ,  users.phone  ,  users.username  ,  users.name  ,  users.picture  , users.status , users.verify , users.created_on , users.updated_on ,  session.id as session_id  , session.connection  from users  inner join session on users.id = session.users_id where username='${username}'`);
};

const findIdSession = (id) => {
  return Pool.query(`select users.id  ,  users.email  ,  users.password  ,  users.phone  ,  users.username  ,  users.name  ,  users.picture  , users.status , users.verify , users.created_on , users.updated_on ,  session.id as session_id  , session.connection  from users  inner join session on users.id = session.users_id where id='${id}'`);
};


const createUsers = (id, email, passwordHash, verify) => {
  return Pool.query(`insert into users ( id , email , password , verify ) values ( '${id}' , '${email}' , '${passwordHash}' ,'${verify}') `);
};

const createUsersVerification = (users_verification_id, users_id, token) => {
  return Pool.query(`insert into users_verification ( id , users_id , token ) values ( '${users_verification_id}' , '${users_id}' , '${token}' )`);
};

const createSession = (session_id, users_id, connection) => {
  return Pool.query(`insert into session ( id , users_id ,connection ) values ('${session_id}', '${users_id}', '${connection}')`);
};

const checkUsersVerification = (queryUsersId, queryToken) => {
  return Pool.query(`select * from users_verification where users_id='${queryUsersId}' and token = '${queryToken}' `);
};

const deleteUsersVerification = (queryUsersId, queryToken) => {
  return Pool.query(`delete from users_verification  where users_id='${queryUsersId}' and token = '${queryToken}' `);
};

const updateAccountVerification = (queryUsersId) => {
  return Pool.query(`update users set verify='true' where id='${queryUsersId}' `);
};

const updateAccount = (email, name,  phone, status, picture,username) => {
  return Pool.query(
    `update users set name='${name}',  status='${status}', phone='${phone}' , picture='${picture}' , username='${username}' where email='${email}'`
  );
};

const updateNoPict = (email, name,  phone, status , username) => {
  return Pool.query(
    `update users set name='${name}',  status='${status}', phone='${phone}' , username='${username}' where email='${email}'`
  );
};

const changeEmailAccount = (email, emailBody) => {
  return Pool.query(`update users set email='${emailBody}' where email='${email}'`);
};

const changePassword = (email, passwordNewHash) => {
  return Pool.query(`update users set password='${passwordNewHash}' where email='${email}'`);
};

const deleteAccount = (email) => {
  return Pool.query(`delete from users where email='${email}'`);
};





module.exports = {
  findEmail,
  findUsername,
  findId,
  findEmailSession,
  findUsernameSession,
  findIdSession,
  createUsers,
  createUsersVerification,
  createSession,
  checkUsersVerification,
  deleteUsersVerification,
  updateAccountVerification,
  updateAccount,
  updateNoPict,
  changeEmailAccount,
  changePassword,
  deleteAccount,
};
