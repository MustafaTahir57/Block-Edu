import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { loadWeb3 } from '../../utils/api/api';
import "./index.css"
import logo from "../../assets/logo.jpeg"
const Navbars = ({setConnectWallets}) => {
  const [address, setAddress] = useState("Connect Wallet");
    const handleConnect = async () => {
        try {
          let acc = await loadWeb3();
          if (acc === "No Wallet") {
            setConnectWallets("No Wallet");
            setAddress("Wrong Network");
          } else if (acc === "Wrong Network") {
            setConnectWallets("Wrong Network");
            setAddress("Wrong Network");
          } else {
            setAddress(acc.substring(0, 5) + "..." + acc.substring(acc.length - 5))
            setConnectWallets(acc)
          }
        } catch (err) {
          console.log("err", err);
        }
      }
  return (
    <Navbar collapseOnSelect expand="lg" className="">
      <Container>
        <Navbar.Brand href="" className='crypto-text'><img src={logo} width={60} height={60} style={{borderRadius: "50%"}}/> BLOCKCLASS</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav>
            <button className='btn btn-connect' onClick={handleConnect}>{address}</button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navbars