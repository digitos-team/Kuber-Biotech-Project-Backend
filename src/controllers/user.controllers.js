import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefreshtoken } from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  //first get the Email,password firstname from the req.body
  const { email, password } = req.body;
  //check for the every data is provided and with proper format
  if (!(email && password)) {
    throw new ApiError(402, "Email and Password required");
  }
  if (!email.endsWith("@gmail.com")) {
    throw new ApiError(403, "Invalid Email Address");
  }
  if (password.length < 8 || password[0] !== password[0].toUpperCase()) {
    throw new ApiError(
      403,
      "Password Should Contain more than 8 character and Start with Upper Case"
    );
  }

  if (
    !(
      password.includes("@") ||
      password.includes("$") ||
      password.includes("#")
    )
  ) {
    throw new ApiError(
      403,
      "Password Must contain one Special character [@#$]"
    );
  }
  //check if the User is already Exist or not in the data base
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(403, "User already Exist with This  Email");
  }
  //Create a new User
  const user = await User.create({
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //return the response
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Register SuccessFully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get the essential data for the requested body
  const { email, password } = req.body;
  //check for the User gave the proper data anything will not be miss
  if (!(email || password)) {
    throw new ApiError(403, "Email Password required");
  }
  //find the User in the database
  const user = await User.findOne({email});

  if (!user) {
    throw new ApiError(402, "User not Found on this email");
  }
  //check the password is correct from the userSchema Method
  const CheckForPassword = await user.ispasswordCorrect(password);
  if (!CheckForPassword) {
    throw new ApiError(400, "Password is Incorrect");
  }
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //generate the Access token and refresh Token
  const { refreshToken, accessToken } = await generateAccessAndRefreshtoken(
    user._id
  );

  const options = { httpOnly: true, secure: true };
  //send this token in the UserCookies with the response
  res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User Logged In SuccessFully"
      )
    );
});

const loggedOutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = { httpOnly: true, secure: true };

  res
    .status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "logged Out SuccessFully"));
});

// const forgotPassword = asyncHandler(async (req,res) => {
//     //email ->req.body
//     //check if user exits or not
//     //generate a token
//     //save it into User resetToken
//     //send the Mail to the User

//     const { email } = req.body

//     if (!email) {
//       throw new ApiError(403,"Email is required to send the Veriticatoion link")
//     }

//      const findedUser = await User.findOne({email})
//     if(!findedUser) {
//         throw new ApiError(404,"User not Found")
//     }

//     const token = crypto.randomBytes(32).toString("hex");
//     const tokenAddingIntoUserDoc = await User.findByIdAndUpdate(findedUser._id,
//         {
//             $set:{resettoken:token}
//         },
//         {
//             new:true
//         }
//     ).select("-password -refreshToken")

//     if (!tokenAddingIntoUserDoc) {
//         throw new ApiError(402,"resetToken Not Added")
//     }

//     const EmailSending = await SendEmail(findedUser.email,findedUser.username,token)

//     if (!EmailSending) {
//         throw new ApiError(403,"Email Not Generated Something Went Wrong")
//     }

//     return res.status(200)
//     .json(
//         new ApiResponse(
//             200,
//             {EmailSending,tokenAddingIntoUserDoc},
//             "Email Send SuccessFully"
//         )
//     )
// })

// const resetPassword = asyncHandler(async (req,res) => {
//     //resettoke->req.query
//     //newpassword -> req.body
//     //find user based on reset token
//     //i got the user then find the user by id and then update the password
//     //send the response that password is updatete

//     const {resettoken} = req.query
//     const {newpassword} = req.body
//     if (!newpassword) {
//         throw new ApiError(403,"Password is required To change the data")
//     }

//     if (!resettoken) {
//         throw new ApiError(403,"Token Not Found")
//     }

//     if (newpassword.length < 8 || newpassword[0] !==newpassword[0].toUpperCase()){
//         throw new ApiError(403,"Password Should Contain more than 8 character and Start with Upper Case")
//         }

//     if (!(newpassword.includes("@")||newpassword.includes('$')||newpassword.includes("#"))) {
//         throw new ApiError(403,"Password Must contain one Special character [@#$]")
//     }

//     const user = await User.findOne({resettoken})
//     if (!user) {
//         throw new ApiError(403,"Reset Token Expires")
//     }

//     user.password = newpassword
//     user.resettoken = undefined
//     await user.save()

//     const passwordChangedUser = await User.findById(user._id).select("-refreshToken -password")

//     return res.status(200)
//     .json(
//         new ApiResponse(
//             200,
//             passwordChangedUser,
//             "Password update SuccessFully"
//         )
//     )
// })

export { registerUser, loginUser, loggedOutUser };
