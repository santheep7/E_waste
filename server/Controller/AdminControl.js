const Request = require('../model/Requestmodel');
const User = require('../model/Usermodel');
const Agent = require('../model/Agentmodel')
// for display users
const getuser = async(req,res)=>{
  try{
    const user = await User.find()
    console.log("user",user)
    res.status(200).json(user);
  }catch(error){
    console.error('error fetcing users:',error.message)
    res.status(500).json({message:'Failed to fetch users'})
  }
};
// for deleting user

const deluser = async (req, res) => {
  try {
    const id = req.headers['userid'];              // match “userid”
    if (!id) return res.status(400).json({ message: "User ID header is required" });

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
const getAgent = async(req,res)=>{
  try{
    const user = await Agent.find()
    console.log("user",user)
    res.status(200).json(user);
  }catch(error){
    console.error('error fetcing users:',error.message)
    res.status(500).json({message:'Failed to fetch users'})
  }
};
const delagent = async (req, res) => {
  try {
    const id = req.headers['userid'];              // match “userid”
    if (!id) return res.status(400).json({ message: "User ID header is required" });

    const deletedUser = await Agent.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "Agent not found" });

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
const approveAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await Agent.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }
        res.status(200).json({ message: "Agent approved", agent });
    } catch (error) {
        res.status(500).json({ message: "Error approving agent" });
    }
}




// Get all pickup requests

module.exports = {getuser,deluser,getAgent,delagent,approveAgent}