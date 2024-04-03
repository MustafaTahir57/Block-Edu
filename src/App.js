import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbars from "./component/navbar";
import Home from "./component/home/home";
import Card from "./component/card/Card";
import { useState } from "react";
import About from "./component/about/about";
import Roadmap from "./component/roadmap/Roadmap";
import Footer from "./component/footer/Footer";
function App() {
  const [connectWallets, setConnectWallets] = useState("Connect Wallet");
  return (
    <div className="App">
      <Navbars setConnectWallets={setConnectWallets} />
      <Home />
      <About />
      <Card connectWallets={connectWallets} />
      <Roadmap />
      <Footer/>
    </div>
  );
}

export default App;
