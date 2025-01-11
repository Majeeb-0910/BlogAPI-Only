export const TryCatch = (controllerType) => (req, res, next) => {
  return Promise.resolve(controllerType(req, res, next)).catch(next);
};
