import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState } from 'react';
import { toast,ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function AdminLogin() {
    const [admin,setadmin] =useState({email:'',password:''});
    const handleChange =(e) =>{
        setadmin({...admin,[e.target.name]:e.target.value});
    };
    const navigate = useNavigate();
    const handleSubmit =(e)=>{
        e.preventDefault();
        if(admin.email.trim().toLowerCase() === 'admin@gmail.com' && admin.password.trim().toLowerCase()==="12345"){
            toast.success("Login Succesfull")
            setTimeout(()=>{navigate('/adminhome')},2000)
            setadmin({email:'', password:''})
        }
    }
  return (
    <>
    <ToastContainer/>
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange}/>
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>
 
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name='password' placeholder="Password" onChange={handleChange}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    </>
  );
}