import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [tooted, setTooted] = useState([]);
  const nameRef = useRef();
  const priceRef = useRef(); 
  const kogusRef = useRef();
  const [valuut, setvaluut] = useState("euro"); 
  const isActiveRef = useRef();

  useEffect(() => {
    fetch("https://localhost:7047/tooted") 
      .then(res => res.json())
      .then(json => setTooted(json));
  }, []);

  function kustuta(index) {
    setTimeout(() => { 
      fetch("https://localhost:7047/tooted/kustuta/" + index, {"method": "DELETE"}) 
        .then(res => res.json())
        .then(json => setTooted(json));
    }, 1000);
  }

  function lisa() {                                          
    fetch(`https://localhost:7047/tooted/lisa/${nameRef.current.value}/        
        ${Number(priceRef.current.value)}/${isActiveRef.current.checked}/${kogusRef.current.value}`, {"method": "POST"})
      .then(res => res.json())
      .then(json => setTooted(json));
  }

  function dollariteks() {
    setvaluut(prevValuut => (prevValuut === "euro" ? "dollar" : "euro"));
  }

  async function makePayment(sum, id) { 
    try {
      const response = await fetch(`https://localhost:7047/Payment/${sum}/${id}`);
      if (response.ok) {
        let paymentLink = await response.text();
        paymentLink = paymentLink.replace(/^"|"$/g, '');
        window.open(paymentLink, '_blank');
      } else {
        console.error('Payment failed.');
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  }
  
  return(
    <div className="App">
      <div className="input">
      <label>Nimi</label> <br />
      <input ref={nameRef} type="text" /> <br />
      <label>Hind</label> <br />
      <input ref={priceRef} type="number" /> <br />
      <label>Kogus</label> <br />
      <input ref={kogusRef} type="number" /> <br />
      <label>Aktiivne</label> <br />
      <input ref={isActiveRef} type="checkbox" /> <br />
      <button onClick={() => lisa()}>Lisa</button>
      </div>
      <table>
        <thead>
          <th>ID</th>
          <th>Nimi</th>
          <th>Hind</th>
          <th>Kogus</th>
          <th>Kustuta</th>
          <th>Maksma</th>
          <th>Dollariteks</th>
        </thead>
        <tbody>
          {tooted
            .filter((toode) => toode.isActive === true)
            .map((toode) => (
              <tr key={toode.id}>
                <td>{toode.id}</td>
                <td>{toode.name}</td>
                <td>
                  {Math.round(toode.price * (valuut === "euro" ? 1 : 1.05) * 100) / 100}
                  {valuut === "euro" ? "€" : "$"}
                </td>
                <td>{toode.kogus}</td>
                <td><button onClick={() => kustuta(toode.id)}>X</button></td>
                <td><button onClick={() => makePayment(toode.price, toode.id)}><i class="fa fa-credit-card"/></button></td>
                <td><button onClick={() => dollariteks()}>Muuda</button></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    
  );
}

export default App;