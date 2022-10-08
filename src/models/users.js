const Pool = require("../config/db");

const findEmail = (email) => {
  return Pool.query(`SELECT COUNT(*) FROM users WHERE email='${email}'`);
};

const findUsername = (username) => {
  return Pool.query(`select COUNT(*) from users where username='${username}'`);
};

const findId = (id) => {
  return Pool.query(`select COUNT(*) from users where id='${id}'`);
};

const create = (id, email, passwordHash, name, role, phone, verify) => {
  return Pool.query(`insert into users ( id , email , password , name , role , phone , verify ) values ( '${id}' , '${email}' , '${passwordHash}' , '${name}' , '${role}' , '${phone}' ,'${verify}') `);
};

const createUsersVerification = (id, users_id, token) => {
  return Pool.query(`insert into users_verification ( id , users_id , token ) values ( '${id}' , '${users_id}' , '${token}' )`);
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

const updateAccount = (email, name, gender, phone, date_of_birth, picture, job_desk, domicile, location, description, role) => {
  return Pool.query(
    `update users set name='${name}',  gender='${gender}', phone='${phone}', date_of_birth='${date_of_birth}', picture='${picture}', job_desk = '${job_desk}',  domicile = '${domicile}',  location = '${location}',  description = '${description}', role='${role}' where email='${email}'`
  );
};

const updateNoPict = (email, name, gender, phone, date_of_birth, job_desk, domicile, location, description, role) => {
  return Pool.query(
    `update users set name='${name}',  gender='${gender}', phone='${phone}', date_of_birth='${date_of_birth}', job_desk = '${job_desk}',  domicile = '${domicile}',  location = '${location}',  description = '${description}', role='${role}' where email='${email}'`
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

const createRecruiterOnRegister = (recruiter_id, users_id, position, company) => {
  return Pool.query(`insert into recruiter ( id, users_id , position, company )  values ( '${recruiter_id}' , '${users_id}' , '${position}', '${company}' ) `);
};

module.exports = {
  findEmail,
  findUsername,
  findId,
  create,
  createUsersVerification,
  checkUsersVerification,
  deleteUsersVerification,
  updateAccountVerification,
  updateAccount,
  updateNoPict,
  changeEmailAccount,
  changePassword,
  deleteAccount,
  createRecruiterOnRegister,
};
