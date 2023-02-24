import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  width: 400px;

  & > * {
    margin-bottom: 20px;
    width: 100%;
  }

  h2 {
    margin: 0 0 20px 0;
    text-align: center;
    color: #555;
  }

  input {
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 16px;
    width: 100%;
    outline: none;

    &:focus {
      border-color: #777;
    }
  }

  button {
    background-color: #f44336;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: #d32f2f;
    }
  }
`;


export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('auth/login', { email, password })
      console.log(response);
      const token = response.data.token
      Cookies.set('token', token) // Save the token as a cookie
      navigate("/");
    } catch (error) {
      setError('Invalid email or password')
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <div>
        <h2>Login</h2>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
        </Form>
    </Container>
  )
}
