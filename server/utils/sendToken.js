export function sendToken(user, statusCode, message, res) {
  
    // "User" Modal have function as "generateToken" to generate tokens
    const token = user.generateToken();
  
  
    // Generally, token is stoed in cookie. So, we will generate token first - then store in cookie, and send cookie with the "res" object
  res.status(statusCode).cookie("token", sendToken, {
    // we also need to give some options like - when it will expire
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 100
    ),
    // means if the value of
    // COOKIE_EXPIRE = 3 , this cookie will expire in 3 days,
    // "expires" property takes mili-seconds, so
      // days (COOKIE_EXPIRE) * hours * minutes * seconds * mili-second (per one piece)
      httpOnly: true,
  }).json({
      success: true,
      message,
      user,
      token,
  });
}
