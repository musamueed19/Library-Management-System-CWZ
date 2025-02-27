export function catchAsyncErrors(theFunction) {
  return (req, res, next) => {
    Promise.resolve(theFunction(req, res, next).catch(next));
  };

  // The above statement will execute the whole function passed as parameter, 
  // 
  // and  then call the catch method on the returned promise, passing the next function as the error handler.
  
  // In case of unsuccess, the next middleware in the app.js will be executed,  which is the error handler middleware.
  


};
