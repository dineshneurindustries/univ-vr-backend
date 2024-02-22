const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const countryRoute = require('./country.route');
const stateRoute = require('./state.route');
const universityRoute = require('./university.route');
const collegeRoute = require('./college.route');
const buildingRoute = require('./building.route');
const roomRoute = require('./room.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/country',
    route: countryRoute,
  },
  {
    path: '/state',
    route: stateRoute,
  },
  {
    path: '/university',
    route: universityRoute,
  },
  {
    path: '/college',
    route: collegeRoute,
  },
  {
    path: '/building',
    route: buildingRoute,
  },
  {
    path: '/room',
    route: roomRoute,
  },
];
const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
