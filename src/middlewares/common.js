/* eslint-disable */
const createError = require('http-errors')

const validateRegister = (req, res, next) => {
  const { username, email, password, name } = req.body
  const checkInputUsername = new RegExp(/^[a-zA-Z0-9_-]{5,8}$/)
  const checkInputEmail = new RegExp(/^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)
  const checkInputPassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/)
  const checkInputName = new RegExp(/^[A-Za-z\s]{3,100}$/)
  try {
    if (username === '') throw ('Username must filled')
    if (!checkInputUsername.test(username)) throw ('Username minimum five characters and maximum eight characters, minimum at least one letter and one number')
    if (email === '') throw ('Email must filled')
    if (!checkInputEmail.test(email)) throw ('Email had not valid for register')
    if (password === '') throw ('Password must filled')
    if (!checkInputPassword.test(password)) throw ('Password minimum eight characters and maximum twelve characters, minimum at least one letter, one number, and one special character')
    if (name === '') throw ('Name must filled')
    if (!checkInputName.test(name)) throw ('Name only used characters')

  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const validateLogin = (req, res, next) => {
  const { email, password, } = req.body
  const checkInputEmail = new RegExp(/^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)
  const checkInputPassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/)
  try {

    if (email === '') throw ('Email must filled')
    if (password === '') throw ('Password must filled')
    if (!checkInputPassword.test(password)) throw ('Password minimum eight characters and maximum twelve characters, minimum at least one letter, one number, and one special character')
    if (email === '') throw ('Email must filled')
    if (!checkInputEmail.test(email)) throw ('Email had not valid for register')

  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const validateUpdateProfile = (req, res, next) => {
  const { username, name, gender, phone, date_of_birth, picture, role } = req.body
  const checkInputUsername = new RegExp(/^[a-zA-Z0-9_-]{5,8}$/)
  const checkInputName = new RegExp(/^[A-Za-z\s]{3,100}$/)
  const checkInputPhone = new RegExp(/^[0-9+-]{8,15}$/)
  const checkInputDate = new RegExp(/^(\d{4})[-](0?[1-9]|[1][012])[-](0?[1-9]|[1-2][0-9]|[3][01])$/)
  const checkGender = new RegExp(/^(?:|men|women)$/)
  const checkRole = new RegExp(/^(?:|user|seller)$/)

  try {
    if (username == '') throw ('Username must filled')
    if (!checkInputUsername.test(username)) throw ('Username minimum five characters and maximum eight characters, minimum at least one letter and one number')
    if (name == '') throw ('Name must filled')
    if (!checkInputName.test(name)) throw ('Name only used characters')
    if (picture == '') throw ('Picture must filled')
    if (!gender == '' && !checkGender.test(gender.toLowerCase())) throw ('Gender only men or women')
    if (!phone == '' && !checkInputPhone.test(phone)) throw ('Phone Number has Invalid')
    if (!date_of_birth == '' && !checkInputDate.test(date_of_birth)) throw ('Date must formatted YYYY-MM-DD')
    // if (!/\.(jpe?g|png|gif|bmp)$/.test(req.file.filename)) throw 'Please upload only images'
    if (role == '') throw ('Role must filled')
    if (!checkRole.test(role.toLowerCase())) throw ('Role only user or seller')

  } catch (error) {
    return res.json(createError(400, error));
  }
  next()
}

const validateChangeEmail = (req, res, next) => {
  const { email } = req.body
  const checkInputEmail = new RegExp(/^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)
  try {
    if (email === '') throw ('Email must filled')
    if (!checkInputEmail.test(email)) throw ('Email has not valid')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}


const validateChangePassword = (req, res, next) => {
  const { password } = req.body
  const checkInputPassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/)
  try {
    if (password === '') throw ('Password must filled')
    if (!checkInputPassword.test(password)) throw ('Password minimum eight characters and maximum twelve characters, minimum at least one letter, one number, and one special character')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}




const checkInputSeller = (req, res, next) => {
  const { name, logo, address, description } = req.body
  const checkInputName = new RegExp(/^[A-Za-z-_\s]{3,100}$/)
  try {
    if (req.payload.role == 'user') throw ('Role not Seller')
    if (name == '') throw ('Name store must filled')
    if (!checkInputName.test(name)) throw ('Name only store used characters')
    if (logo == '') throw ('Logo store must filled')
    if (address == '') throw ('Address store must filled')
    if (description == '') throw ('Description store must filled')

  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}


const checkUpdateSeller = (req, res, next) => {
  const { name, logo, address, description } = req.body
  const checkInputName = new RegExp(/^[A-Za-z\s]{3,100}$/)
  try {
    if (req.payload.role == 'user') throw ('Role not Seller')
    if (name == '') throw ('Name store must filled')
    if (!checkInputName.test(name)) throw ('Name store only used characters')
    if (logo == '') throw ('Logo store must filled')
    if (address == '') throw ('Address store must filled')
    if (description == '') throw ('Description store must filled')

  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkDeleteSeller = (req, res, next) => {
  try {
    if (req.payload.role == 'user') throw ('Role not Seller')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkInputCategory = (req, res, next) => {
  const { name } = req.body
  try {
    if (req.payload.role !== 'admin') throw ('Role not Administator')
    if (name == '') throw ('Name Category must filled')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkUpdateCategory = (req, res, next) => {
  const { name } = req.body
  try {
    if (req.payload.role !== 'admin') throw ('Role not Administator')
    if (name == '') throw ('Name Category must filled')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkDeleteCategory = (req, res, next) => {
  const { name } = req.body
  try {
    if (req.payload.role !== 'admin') throw ('Role not Administator')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkInputPayment = (req, res, next) => {
  const { name } = req.body
  try {
    if (req.payload.role !== 'admin') throw ('Role not Administator')
    if (name == '') throw ('Name Payment must filled')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkUpdatePayment = (req, res, next) => {
  const { name } = req.body
  try {
    if (req.payload.role !== 'admin') throw ('Role not Administator')
    if (name == '') throw ('Name Payment must filled')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkDeletePayment = (req, res, next) => {
  const { name } = req.body
  try {
    if (req.payload.role !== 'admin') throw ('Role not Administator')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}


const checkInputProduct = (req, res, next) => {
  const {
    name,
    brand,
    price,
    stock,
    photo,
    color,
    size,
    description,
    status,
    category_id,
    seller_id

  } = req.body

  const checkInputColor = new RegExp(/^[A-Za-z-_\s]{2,100}$/)
  const checkInputPrice = new RegExp(/^[1-9][0-9]*$/)
  const checkInputStock = new RegExp(/^[1-9][0-9]*$/)
  const checkInputSize = new RegExp(/^[0-9A-Za-z-_\s]{1,100}$/)
  const checkStatus = new RegExp(/^(?:|enable|disable)$/)
  const CheckCategory_id = new RegExp(/^(category)[-](\d{1,100})$/)
  const checkSeller_id = new RegExp(/^([a-zA-Z0-9]{8})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{12})$/)

  try {
    if (req.payload.role == 'user') throw ('Role not Seller')
    if (name == '') throw ('Name product must filled')
    if (brand == '') throw ('Brand product must filled')
    if (price == '') throw ('Price product must filled')
    if (!checkInputPrice.test(price)) throw ('Price has Invalid')
    if (stock == '') throw ('Stock product must filled')
    if (!checkInputStock.test(stock)) throw ('Stock has Invalid')
    if (photo == '') throw ('Photo product must filled')
    if (color == '') throw ('Color product must filled')
    if (!checkInputColor.test(color)) throw ('Color product only format character')
    if (size == '') throw ('Size product must filled')
    if (!checkInputSize.test(size)) throw ('Size product only format character or number')
    if (description == '') throw ('Description product must filled')
    if (status == '') throw ('Status product must filled')
    if (!checkStatus.test(status.toLowerCase())) throw ('Status product only enable or disable')
    if (category_id == '') throw ('Category_id product must filled')
    if (!CheckCategory_id.test(category_id.toLowerCase())) throw ('Category_id only format category-(number)')
    if (seller_id == '') throw ('Seller_id product must filled')
    if (!checkSeller_id.test(seller_id.toLowerCase())) throw ('Seller_id only format uuid : 00000000-0000-0000-0000-000000000000')

  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}


const checkUpdateProduct = (req, res, next) => {
  const {
    name,
    brand,
    price,
    stock,
    photo,
    color,
    size,
    description,
    status,
    category_id,
    seller_id

  } = req.body

  const checkInputColor = new RegExp(/^[A-Za-z-_\s]{2,100}$/)
  const checkInputPrice = new RegExp(/^[1-9][0-9]*$/)
  const checkInputStock = new RegExp(/^[1-9][0-9]*$/)
  const checkInputSize = new RegExp(/^[0-9A-Za-z-_\s]{1,100}$/)
  const checkStatus = new RegExp(/^(?:|enable|disable)$/)
  const CheckCategory_id = new RegExp(/^(category)[-](\d{1,100})$/)
  const checkSeller_id = new RegExp(/^([a-zA-Z0-9]{8})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{12})$/)

  try {
    if (req.payload.role == 'user') throw ('Role not Seller')
    if (name == '') throw ('Name product must filled')
    if (brand == '') throw ('Brand product must filled')
    if (price == '') throw ('Price product must filled')
    if (!checkInputPrice.test(price)) throw ('Price has Invalid')
    if (stock == '') throw ('Stock product must filled')
    if (!checkInputStock.test(stock)) throw ('Stock has Invalid')
    if (photo == '') throw ('Photo product must filled')
    if (color == '') throw ('Color product must filled')
    if (!checkInputColor.test(color)) throw ('Color product only format character')
    if (size == '') throw ('Size product must filled')
    if (!checkInputSize.test(size)) throw ('Size product only format character or number')
    if (description == '') throw ('Description product must filled')
    if (status == '') throw ('Status product must filled')
    if (!checkStatus.test(status.toLowerCase())) throw ('Status product only enable or disable')
    if (category_id == '') throw ('Category_id product must filled')
    if (!CheckCategory_id.test(category_id.toLowerCase())) throw ('Category_id only format category-(number)')
    if (seller_id == '') throw ('Seller_id product must filled')
    if (!checkSeller_id.test(seller_id.toLowerCase())) throw ('Seller_id only format uuid : 00000000-0000-0000-0000-000000000000')

  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkDeleteProduct = (req, res, next) => {
  try {
    if (req.payload.role == 'user') throw ('Role not Seller')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkInputTransaction = (req, res, next) => {
  const { product_id, quantity, discount, payment_id, users_id } = req.body
  const CheckPayment_id = new RegExp(/^(payment)[-](\d{1,100})$/)
  const checkProduct_id = new RegExp(/^([a-zA-Z0-9]{8})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{12})$/)
  const checkUsers_id = new RegExp(/^([a-zA-Z0-9]{8})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{12})$/)
  const checkQuantity = new RegExp(/^[1-9][0-9]*$/)
  const checkDiscount = new RegExp(/^[0-9][0-9]*$/)

  try {
    if (product_id == '') throw ('Product_id must filled')
    if (!checkProduct_id.test(product_id.toLowerCase())) throw ('Product_id only format uuid : 00000000-0000-0000-0000-000000000000')
    if (quantity == '') throw ('Quantity must filled')
    if (!checkQuantity.test(quantity)) throw ('Quantity has Invalid')
    if (discount == '') throw ('Discount must filled')
    if (!checkDiscount.test(discount)) throw ('Discount has Invalid')
    if (payment_id == '') throw ('Payment_id must filled')
    if (!CheckPayment_id.test(payment_id.toLowerCase())) throw ('Payment_id only format payment-(number)')
    if (users_id == '') throw ('Users_id must filled')
    if (!checkUsers_id.test(users_id.toLowerCase())) throw ('Users_id only format uuid : 00000000-0000-0000-0000-000000000000')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}



const checkUpdateTransaction = (req, res, next) => {
  const { product_id, quantity, discount, payment_id, status_payment, status_transaction, users_id } = req.body
  const CheckPayment_id = new RegExp(/^(payment)[-](\d{1,100})$/)
  const checkProduct_id = new RegExp(/^([a-zA-Z0-9]{8})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{12})$/)
  const checkUsers_id = new RegExp(/^([a-zA-Z0-9]{8})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{4})[-]([a-zA-Z0-9]{12})$/)
  const checkQuantity = new RegExp(/^[1-9][0-9]*$/)
  const checkDiscount = new RegExp(/^[0-9][0-9]*$/)
  const checkStatus_payment = new RegExp(/^(?:|pending|paid)$/)
  const checkStatus_transaction = new RegExp(/^(?:|process|packing|shipping|delivered)$/)

  try {
    if (req.payload.role !== 'admin') throw ('Role not Administator')
    if (product_id == '') throw ('Product_id must filled')
    if (!checkProduct_id.test(product_id.toLowerCase())) throw ('Product_id only format uuid : 00000000-0000-0000-0000-000000000000')
    if (quantity == '') throw ('Quantity must filled')
    if (!checkQuantity.test(quantity)) throw ('Quantity has Invalid')
    if (discount == '') throw ('Discount must filled')
    if (!checkDiscount.test(discount)) throw ('Discount has Invalid')
    if (payment_id == '') throw ('Payment_id must filled')
    if (!CheckPayment_id.test(payment_id.toLowerCase())) throw ('Payment_id only format payment-(number)')
    if (status_payment == '') throw ('Status_payment must filled')
    if (!checkStatus_payment.test(status_payment.toLowerCase())) throw ('Status_payment only input pending or paid')
    if (status_transaction == '') throw ('Status_transaction must filled')
    if (!checkStatus_transaction.test(status_transaction.toLowerCase())) throw ('Status_transaction only input process ,packing ,shipping, and delivered')
    if (users_id == '') throw ('Users_id must filled')
    if (!checkUsers_id.test(users_id.toLowerCase())) throw ('Users_id only format uuid : 00000000-0000-0000-0000-000000000000')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}

const checkDeleteTransaction = (req, res, next) => {
  const { name } = req.body
  try {
    if (req.payload.role !== 'admin') throw ('Role not Administator')
  } catch (error) {
    return res.send(createError(400, error));
  }
  next()
}



module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangeEmail,
  validateChangePassword,
  checkInputSeller,
  checkUpdateSeller,
  checkDeleteSeller,
  checkInputCategory,
  checkUpdateCategory,
  checkDeleteCategory,
  checkInputPayment,
  checkUpdatePayment,
  checkDeletePayment,
  checkInputProduct,
  checkUpdateProduct,
  checkDeleteProduct,
  checkInputTransaction,
  checkUpdateTransaction,
  checkDeleteTransaction
}
