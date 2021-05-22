const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../roles/roles');
/// image upload ///
const multer = require('multer');
const upload = multer({
  storage: storage,
  limits : {fileSize : 3000000}
});

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
 }
  
 async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
 }

 exports.signup = async (req, res, next) => {
  try {
   const { first_name, last_name, email, password, userType } = req.body
   const hashedPassword = await hashPassword(password);
   const newUser = new User({first_name, last_name, email, password: hashedPassword, userType: userType || "admin" });
   const accessToken = jwt.sign({ userId: newUser.userId }, process.env.JWT_SECRET, {
    expiresIn: "1d"
   });
   newUser.accessToken = accessToken;
   await newUser.save();
   res.json({
    data: newUser,
    accessToken
   })
  } catch (error) {
   next(error)
  }
 }
 exports.login = async (req, res, next) => {
  try {
   const { email, password } = req.body;
   const user = await User.findOne({ email });
   if (!user) return next(new Error('Email does not exist'));
   const validPassword = await validatePassword(password, user.password);
   if (!validPassword) return next(new Error('Password is not correct'))
   const accessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
    expiresIn: "1d"
   });
   await User.findByIdAndUpdate(user.userId, { accessToken })
   res.status(200).json({
    data: { email: user.email, userType: user.userType },
    accessToken
   })
  } catch (error) {
   next(error);
  }
 }
/////////////////////////////////

exports.getUsers = async (req, res, next) => {
 const users = await User.find({});
 res.status(200).json({
  data: users
 });
}

exports.getUser = async (req, res, next) => {
 try {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) return next(new Error('User does not exist'));
   res.status(200).json({
   data: user
  });
 } catch (error) {
  next(error)
 }
}

exports.updateUser = async (req, res, next) => {
 try {
  const update = req.body
  const userId = req.params.userId;
  await User.findByIdAndUpdate(userId, update);
  const user = await User.findById(userId)
  res.status(200).json({
   data: user,
   message: 'User has been updated'
  });
 } catch (error) {
  next(error)
 }
}

exports.deleteUser = async (req, res, next) => {
 try {
  const userId = req.params.userId;
  await User.findByIdAndDelete(userId);
  res.status(200).json({
   data: null,
   message: 'User has been deleted'
  });
 } catch (error) {
  next(error)
 }
} 
exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.userType)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}
 
exports.allowIfLoggedin = async (req, res, next) => {
 try {
  const user = res.locals.loggedInUser;
  if (!user)
   return res.status(401).json({
    error: "You need to be logged in to access this route"
   });
   req.user = user;
   next();
  } catch (error) {
   next(error);
  }
}
/////////////////////////////
///// image upload ////////////
//////////////////////////////////
// function fileFilter (req, file, cb) {    
//   // Allowed ext
//    const filetypes = /jpeg|jpg|png|gif/;

 // Check ext
 // const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
 // Check profile
 // const profiletype = filetypes.test(file.profiletype);
//  if(profiletype && extname){
//      return cb(null,true);
//  } else {
//      cb('Error: Images Only!');
//  }
var storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, './uploads');    
  }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);   
  }
});
app.post("/profilePicture", (req, res) => {
  var upload = multer({ storage:storage}).single('userPhoto');
  upload(req,res,function(err){   
    console.log(req.file);
    if(err){
      res.json({success:false,message:err});
    }
    else{
      res.json({success:true,message:"Photo was updated !"});
    } 
});
});
////// pagination //////
app.get('/users/pagination',(req,res) => {
  var pageNo = parseInt(req.query.pageNo)
  var size = parseInt(req.query.size)
  var query = {}
  if(pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  mongoOp.find({},{},query,function(err,data) {
    // Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    });
})
// sortClause = {};
// sortClause.user=parseInt(-1);
// let properties = await Property.find({'status':{$in:[1,2]}}).populate({path: 'user',
//   model: 'User',select: 'first_name last_name email userType'}).populate({path: 'vegitable',
//   model: 'Vegitable',select: 'name'}).sort(sortClause).skip(skip).limit(perpage).exec();
 ///////////////////////////////////////////////////
// Retrieve and return all users from the database.
// exports.findAll = (req, res) => {
// User.find()
//   .then(users => {
//   res.send(users);
// }).catch(err => {
//   res.status(500).send({
//   message: err.message || "Something went wrong while getting list of users."
// });
// });
// };
// // Create and Save a new User
// exports.create = (req, res) => {
// // Validate request
// if(!req.body) {
//   return res.status(400).send({
//   message: "Please fill all required field"
// });
// }
// // Create a new User
// const user = new User({
//   first_name: req.body.first_name,
//   last_name: req.body.last_name,
//   email: req.body.email,
//   profile_Picture: req.body.profile_Picture,
//   password: req.body.password,
//   userType: req.body.userType
// });
// // Save user in the database
// user.save()
//   .then(data => {
//   res.send(data);
// }).catch(err => {
//   res.status(500).send({
//   message: err.message || "Something went wrong while creating new user."
// });
// });
// };
// // Find a single User with a id
// exports.findOne = (req, res) => {
//  User.findById(req.params.id)
//   .then(user => {
//   if(!user) {
//    return res.status(404).send({
//    message: "User not found with id " + req.params.id
//  });
// }
//  res.send(user);
// }).catch(err => {
//   if(err.kind === 'ObjectId') {
//     return res.status(404).send({
//     message: "User not found with id " + req.params.id
//   });
// }
// return res.status(500).send({
//   message: "Error getting user with id " + req.params.id
// });
// });
// };
// // Update a User identified by the id in the request
// exports.update = (req, res) => {
// // Validate Request
// if(!req.body) {
//   return res.status(400).send({
//   message: "Please fill all required field"
// });
// }
// // Find user and update it with the request body
// User.findByIdAndUpdate(req.params.id, {
//   first_name: req.body.first_name,
//   last_name: req.body.last_name,
//   email: req.body.email,
//   password: req.body.password,
//   userType: req.body.userType,
//   profile_Picture: req.body.profile_Picture
// }, {new: true})
// .then(user => {
//  if(!user) {
//    return res.status(404).send({
//    message: "user not found with id " + req.params.id
//  });
// }
// res.send(user);
// }).catch(err => {
// if(err.kind === 'ObjectId') {
//   return res.status(404).send({
//   message: "user not found with id " + req.params.id
// });
// }
// return res.status(500).send({
//   message: "Error updating user with id " + req.params.id
// });
// });
// };
// // Delete a User with the specified id in the request
// exports.delete = (req, res) => {
// User.findByIdAndRemove(req.params.id)
// .then(user => {
// if(!user) {
//   return res.status(404).send({
//   message: "user not found with id " + req.params.id
// });
// }
// res.send({message: "user deleted successfully!"});
// }).catch(err => {
// if(err.kind === 'ObjectId' || err.name === 'NotFound') {
//   return res.status(404).send({
//   message: "user not found with id " + req.params.id
// });
// }
// return res.status(500).send({
//   message: "Could not delete user with id " + req.params.id
// });
// });
// };