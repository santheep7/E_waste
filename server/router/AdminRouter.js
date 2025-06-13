const express = require('express')
const { getuser, deluser, getAgent, delagent, approveAgent, getAdminStats } = require('../Controller/AdminControl')
const AdminRoute = express.Router()

AdminRoute.get('/getuser',getuser)
AdminRoute.delete('/deleteuser',deluser)
AdminRoute.get('/getagent',getAgent)
AdminRoute.delete('/delagent',delagent)
AdminRoute.put('/approveagent/:id',approveAgent)
AdminRoute.get('/stats',getAdminStats)
module.exports = AdminRoute;