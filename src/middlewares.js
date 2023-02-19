import multer from "multer";

export const localsMiddleWare = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not athorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleWare = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not athorized");
    return res.redirect("/");
  }
};

export const uploadAvatar = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 5_000_000 },
});
export const uploadVideo = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 10_000_000 },
});
