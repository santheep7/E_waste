import React, { useEffect, useState, useRef } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import gsap from 'gsap';

export default function GetUser() {
  const [users, setUsers] = useState([]);
  const tableBodyRef = useRef(null);

  const fetchUsers = () => {
    axios.get('http://localhost:9000/api/admin/getuser')
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Animate rows whenever `users` change
 useEffect(() => {
  if (tableBodyRef.current) {
    gsap.fromTo(
      tableBodyRef.current.children,
      { opacity: 0, y: 20 },    // from: invisible and shifted down
      { opacity: 1, y: 0,      // to: visible and original position
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      }
    );
  }
}, [users]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete('http://localhost:9000/api/admin/deleteuser', {
        headers: { userid: id }
      })
        .then(() => {
          alert("User deleted successfully");
          fetchUsers(); // Refresh the list
        })
        .catch(error => {
          console.error("Error deleting user:", error);
          alert("Failed to delete user");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Registered Users</h3>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Place</th>
            <th>Address</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody ref={tableBodyRef}>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.place}</td>
                <td>{user.address}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">No users found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
