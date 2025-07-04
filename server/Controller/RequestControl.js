const Request = require('../model/Requestmodel'); 
const Agent = require('../model/Agentmodel')
const createRequest = async (req, res) => {
  try {
    console.log("req.user:", req.user); 

    const newRequest = new Request({
      user: req.user.id, 
      ewasteType: req.body.ewasteType,
      quantity: req.body.quantity,
      pickupDate: req.body.pickupDate,
      timeSlot: req.body.timeSlot,
      notes: req.body.notes,
      latitude: req.body.latitude,
  longitude: req.body.longitude,
      image: req.file?.filename || null,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (err) {
    console.error('❌ Error saving request:', err.message);
    res.status(500).json({ message: 'Failed to submit request' });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('user', 'name email phone place address') // show user info in frontend
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error.message);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Status updated', updatedRequest });
  } catch (error) {
    console.error('Error updating request status:', error.message);
    res.status(500).json({ message: 'Failed to update status' });
  }
};
const getUserRequests = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];


    const userRequests = await Request.find({ user: userId })
      .populate('user', 'name email phone place address')
      .sort({ createdAt: -1 });

    res.status(200).json(userRequests);
  } catch (error) {
    console.error('Error fetching user requests:', error.message);
    res.status(500).json({ message: 'Failed to fetch your requests' });
  }
};

// Canceling the request for user
const cancelRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const updated = await Request.findByIdAndUpdate(
      requestId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({ message: 'Request cancelled successfully', data: updated });
  } catch (err) {
    console.error('Error cancelling request:', err);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
};
// controllers/requestController.js




// For agents to view only approved requests


const getApprovedRequests = async (req, res) => {
  try {
    const agentId = req.headers['x-agent-id'];

    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required in headers' });
    }

    // Fetch agent details
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const agentPlace = agent.place; // get the agent's locality

    if (!agentPlace) {
      return res.status(400).json({ message: 'Agent does not have a place specified' });
    }

    // Find approved requests where the user's place matches agent's
    const approvedRequests = await Request.find({ status: 'Approved' })
      .populate({
        path: 'user',
        select: 'name email phone place address',
        match: { place: agentPlace }
      })
      .sort({ createdAt: -1 });

    // Filter out nulls (no place match)
    const filtered = approvedRequests.filter(req => req.user !== null);

    res.status(200).json(filtered);
  } catch (error) {
    console.error('Error fetching approved requests:', error.message);
    res.status(500).json({ message: 'Failed to fetch approved requests' });
  }
};

const updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params; // request ID in URL
    if (!id) {
      return res.status(400).json({ message: 'Request ID parameter is required' });
    }

    // Expecting a JSON body like { isPickedUp: true } or { isPickedUp: false }
    const { isPickedUp } = req.body;
    if (typeof isPickedUp !== 'boolean') {
      return res.status(400).json({ message: 'isPickedUp (boolean) is required in body' });
    }

    const updated = await Request.findByIdAndUpdate(
      id,
      { isPickedUp },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res
      .status(200)
      .json({ message: 'Pickup status updated', request: updated });
  } catch (error) {
    console.error('Error updating pickup status:', error.message);
    return res.status(500).json({ message: 'Failed to update pickup status' });
  }
};




module.exports = {createRequest,getAllRequests,getUserRequests,cancelRequest,updateRequestStatus,getApprovedRequests,updatePickupStatus}