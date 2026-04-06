import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

// ✅ Socket connection
const socket = io("http://127.0.0.1:5000");
    console.log("this is client side");
// axios uses for connecting api between python 

function App() {
  const [page, setPage] = useState("home");
  useEffect(() => {
  socket.on("connect", () => {
    console.log("Connected to backend ✅");
  });

  socket.on("vote_update", (data) => {
    console.log("Live votes:", data);
    setVotes(data);   // update votes from backend
  });

  return () => {
    socket.off("connect");
    socket.off("vote_update");
    socket.disconnect();
  };
}, []);

  // User registration here
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    aadhaar: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    gender: "",
  });

  const [regOtp, setRegOtp] = useState("");
  const [genRegOtp, setGenRegOtp] = useState("");
  const [registered, setRegistered] = useState(false);

  // Voting
  const [aadhaar, setAadhaar] = useState("");
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [vote, setVote] = useState("");

  const [votes, setVotes] = useState({});
  const [aadhaarVotes, setAadhaarVotes] = useState({});
  const [cityVotes, setCityVotes] = useState({});
  const [stateVotes, setStateVotes] = useState({});

  // Admin panel
  const ADMIN_USER = "nikhil";
  const ADMIN_PASS = "12345";
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [searchAadhaar, setSearchAadhaar] = useState("");

//political parties adding
  const parties = {
    "Uttar Pradesh": ["BJP", "SP", "BSP", "INC"],
    "Maharashtra": ["BJP", "Shiv Sena", "NCP", "INC"],
    "Delhi": ["AAP", "BJP", "INC"],
  };

// --------------party comparison--------------------
  const statePartyData = {};

Object.keys(aadhaarVotes).forEach((a) => {
  const { state, party } = aadhaarVotes[a];

  if (!statePartyData[state]) statePartyData[state] = {};

  statePartyData[state][party] =
    (statePartyData[state][party] || 0) + 1;
});

  // ----------------Account REGISTER here ----------------
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const sendRegOtp = () => {
    if (!/^\d{10}$/.test(user.mobile)) {
      return alert("Mobile must be 10 digits");
    }
    if (!/^\d{14}$/.test(user.aadhaar)) {
      return alert("Aadhaar must be 14 digits");
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    setGenRegOtp(otp.toString());
    alert("OTP: " + otp);
  };

  const verifyRegOtp = () => {
    if (regOtp === genRegOtp) {
      alert("Account Created ✅");
      setRegistered(true);
    } else {
      alert("Wrong OTP ❌");
    }
  };

  // ---------------- LOGIN Panel----------------
  const [otp, setOtp] = useState("");
  const [genOtp, setGenOtp] = useState("");

  const sendOtp = () => {
    if (!/^\d{14}$/.test(aadhaar)) {
      return alert("Enter valid Aadhaar");
    }
    const o = Math.floor(1000 + Math.random() * 9000);
    setGenOtp(o.toString());
    alert("OTP: " + o);
  };

  const verifyOtp = () => {
    if (otp === genOtp) setPage("vote");
    else alert("Wrong OTP");
  };

 // ---------------- VOTE Here ----------------
  const submitVote = () => {
  if (aadhaarVotes[aadhaar]) return alert("Already voted");

  if (!vote) return alert("Select party");

  // ✅ Send to Flask backend
  axios.post("http://127.0.0.1:5000/", {
    party: vote,
  });

  // Local tracking (same as your code)
  setAadhaarVotes({
  ...aadhaarVotes,
  [aadhaar]: {
    party: vote,
    city: city,
    state: selectedState,
  }
});

  setCityVotes({ ...cityVotes, [city]: (cityVotes[city] || 0) + 1 });
  setStateVotes({
    ...stateVotes,
    [selectedState]: (stateVotes[selectedState] || 0) + 1,
  });

  alert("Vote Submitted ✅");
  setPage("home");
};

  // ---------------- ADMIN ----------------
  const adminLogin = () => {
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      setPage("dashboard");
    } else alert("Invalid");
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

const winner =
  Object.keys(votes).length > 0
    ? Object.keys(votes).reduce((a, b) =>
        votes[a] > votes[b] ? a : b
      )
    : "No Votes Yet";

  // Party-wise chart
const partyChartData = {
  labels: Object.keys(votes),
  datasets: [
    {
      data: Object.values(votes),
    },
  ],
};

// Area-wise chart (city)
const cityChartData = {
  labels: Object.keys(cityVotes),
  datasets: [
    {
      data: Object.values(cityVotes),
    },
  ],
};


  return (
    <div style={styles.container}>

      {/* HOME */}
      {page === "home" && (
        <div style={styles.card}>
          <h1>🗳️ Voting System</h1>

          <button style={styles.btn} onClick={() => setPage("register")}>
            Create Account
          </button>

          <button style={styles.btn} onClick={() => setPage("login")}>
            Voter Login
          </button>

          <button style={styles.btn} onClick={() => setPage("admin")}>
            Admin Login
          </button>
        </div>
      )}

      {/* REGISTER */}
      {page === "register" && (
        <div style={styles.card}>
          <h2>Create Account</h2>

          <input style={styles.input} name="name" placeholder="Full Name" onChange={handleChange}/>
          <input style={styles.input} name="mobile" placeholder="Mobile (10 digits)" onChange={handleChange}/>
          <input style={styles.input} name="aadhaar" placeholder="Aadhaar (14 digits)" onChange={handleChange}/>
          <input style={styles.input} type="date" name="dob" onChange={handleChange}/>
          <input style={styles.input} name="address" placeholder="Full Address" onChange={handleChange}/>
          <input style={styles.input} name="city" placeholder="City" onChange={handleChange}/>
          <input style={styles.input} name="state" placeholder="State" onChange={handleChange}/>

          <select style={styles.input} name="gender" onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <button style={styles.btn} onClick={sendRegOtp}>Send OTP</button>

          <input style={styles.input} placeholder="Enter OTP" onChange={(e)=>setRegOtp(e.target.value)}/>
          <button style={styles.btn} onClick={verifyRegOtp}>Verify</button>

          {registered && <p style={{color:"green"}}>Account Created ✅</p>}

          <button style={styles.back} onClick={() => setPage("home")}>Back</button>
        </div>
      )}

      {/* LOGIN */}
      {page === "login" && (
        <div style={styles.card}>
          <h2>Login</h2>

          <input style={styles.input} placeholder="Aadhaar"
            onChange={(e)=>setAadhaar(e.target.value.replace(/\D/g,""))}/>

          <button style={styles.btn} onClick={sendOtp}>Send OTP</button>

          <input style={styles.input} placeholder="OTP"
            onChange={(e)=>setOtp(e.target.value)}/>

          <button style={styles.btn} onClick={verifyOtp}>Login</button>

          <button style={styles.back} onClick={()=>setPage("home")}>Back</button>
        </div>
      )}

      {/* VOTE */}
      {page === "vote" && (
        <div style={styles.card}>
          <h2>Vote</h2>

          <input style={styles.input} placeholder="City"
            onChange={(e)=>setCity(e.target.value)}/>

          <select style={styles.input}
            onChange={(e)=>setSelectedState(e.target.value)}>
            <option>Select State</option>
            {Object.keys(parties).map(s=><option key={s}>{s}</option>)}
          </select>

          {selectedState && parties[selectedState].map(p=>(
            <div key={p}>
              <input type="radio" onChange={()=>setVote(p)}/> {p}
            </div>
          ))}

          <button style={styles.btn} onClick={submitVote}>Submit</button>
          <button style={styles.back} onClick={()=>setPage("home")}>Back</button>
        </div>
      )}

      {/* ADMIN */}
      {page === "admin" && (
        <div style={styles.card}>
          <h2>Admin</h2>

          <input style={styles.input} placeholder="Username"
            onChange={(e)=>setAdminUser(e.target.value)}/>
          <input style={styles.input} type="password" placeholder="Password"
            onChange={(e)=>setAdminPass(e.target.value)}/>

          <button style={styles.btn} onClick={adminLogin}>Login</button>
        </div>
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <div style={styles.card}>
          <h2>Dashboard</h2>

          <p>Total Votes: {totalVotes}</p>
          <p>Winner: {winner}</p>

          {Object.keys(votes).map(p=>{
            const percent = totalVotes?((votes[p]/totalVotes)*100).toFixed(2):0;
            return <p key={p}>{p}: {votes[p]} ({percent}%)</p>
          })}

{/* //admin panel left side card        */}

          {page === "dashboard" && (
  <div style={styles.card}>

    {/* here is the style or designing style of admin panel*/}

    <h2 style={{ textAlign: "center"}}>📊 Admin Dashboard</h2>
    
   {/* TOP ROW */} {/* <div style={styles.row}> <div style={styles.box}> <h3>Total Votes</h3> <p>{totalVotes}</p> </div> <div style={styles.box}> <h3>Winner</h3> <p>{winner}</p> </div> </div> */}

    <h3>📈 Party Percentage</h3>
    {/* CHART ROW */}
    
    <div style={styles.pright}>
      <div style={styles.pright}>
        
          <h3>Overview</h3>
{/* <div styles={styles.pright}> <Pie data={partyChartData} /> {Object.keys(cityVotes).map(c => ( <p key={c}>{c}: {cityVotes[c]}</p> ))} {Object.keys(stateVotes).map(s => ( <p key={s}>{s}: {stateVotes[s]}</p> ))} {Object.keys(votes).map(p=>{ const percent = totalVotes?((votes[p]/totalVotes)*100).toFixed(2):0; return <p key={p}>{p}: {votes[p]} ({percent}%)</p> })} </div> */}
<select
  style={styles.input}
  onChange={(e) => setSelectedState(e.target.value)}
>
  <option>Select State</option>
  {Object.keys(statePartyData).map((s) => (
    <option key={s}>{s}</option>
  ))}
</select>

{selectedState && (
  <Pie
    data={{
      labels: Object.keys(statePartyData[selectedState] || {}),
      datasets: [
        {
          data: Object.values(statePartyData[selectedState] || {}),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    }}
  />
)}
       {/* 🔍 Aadhaar Search */}
<input
  style={styles.input}
  placeholder="Enter Aadhaar Number"
  value={searchAadhaar}
  onChange={(e) => setSearchAadhaar(e.target.value.replace(/\D/g, ""))}
/>

{/* 📄 Result */}
{searchAadhaar && (
  <div style={{
    marginTop: "10px",
    padding: "10px",
    background: "#ffffff",
    borderRadius: "8px"
  }}>
    {aadhaarVotes[searchAadhaar] ? (
      <>
        <p><b>Aadhaar:</b> {searchAadhaar}</p>
        <p><b>Party:</b> {aadhaarVotes[searchAadhaar].party}</p>
        <p><b>City:</b> {aadhaarVotes[searchAadhaar].city}</p>
        <p><b>State:</b> {aadhaarVotes[searchAadhaar].state}</p>
      </>
    ) : (
      <p style={{ color: "red" }}>❌ No record found</p>
    )}
  </div>

  
)}
      </div>

      <div style={styles.box}>
        <h3>🏙 City Votes</h3>
        <div style={styles.pleft}>
        <Pie data={cityChartData} />
        </div>
      </div>
    </div>

    {/* DATA ROW */}
    <div style={styles.row}>
      <div style={styles.box}>
        <h3>City Data</h3>
        
        {Object.keys(cityVotes).map(c => (
          <p key={c}>{c}: {cityVotes[c]}</p>
        ))}
      </div>

      <div style={styles.box}>
        <h3>State Data</h3>
        {Object.keys(stateVotes).map(s => (
          <p key={s}>{s}: {stateVotes[s]}</p>
        ))}
      </div>
    </div>
  </div>
)}

{/* 🏆 Winning Party */}
<div style={styles.winnerCard}>
  <h3>🏆 Winning Party</h3>
  <p style={styles.winnerText}>{winner}</p>
</div>
{/* 📊 Party Percentage */}
<div style={styles.percentCard}>
  <h3>📊 Party Vote Percentage</h3>

  {Object.keys(votes).map((p) => {
    const percent = totalVotes
      ? ((votes[p] / totalVotes) * 100).toFixed(2)
      : 0;
    return (
      <div key={p} style={styles.percentRow}>
        <span>{p}</span>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${percent}%`
            }}
          ></div>
        </div>

        <span>{percent}%</span>
      </div>
    );
  })}
</div>
          <h3>City Votes</h3>
          {Object.keys(cityVotes).map(c=><p key={c}>{c}: {cityVotes[c]}</p>)}

          <h3>State Votes</h3>
          {Object.keys(stateVotes).map(s=><p key={s}>{s}: {stateVotes[s]}</p>)}

          <button style={styles.back} onClick={()=>setPage("home")}>Logout</button>
        </div>
      )}

    </div>
  );
}
// 🎨 UI Styling
const styles = {
  container:{
    height:"100%",
    background:"linear-gradient(#4c669f, #ebdbe1, #192f6a)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  pleft:{
    background:"linear-gradient(#4c669f, #ecf7f8, #85ffff)",
  },
  pright:{
  background:"linear-gradient(#4c669f, #ecf7f8, #85ffff)",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  marginBottom: "15px",
  flexWrap: "wrap",
  flex: "1",
  minWidth: "200px",
  padding: "15px",
  borderRadius: "10px"
  },
  card:{
    maxWidth: "100%",
    // background: "#eff5f7",
    padding: "20px",
    borderRadius: "15px",
    width: "100%",
    boxShadow:"0 10px 25px rgba(250, 245, 245, 0.2)"
  },
  row: {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  marginBottom: "15px",
  flexWrap: "wrap"
},
box: {
  flex: "1",
  minWidth: "200px",
  background: "#fafafa",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
},
  input:{
    width:"100%",
    padding:"10px",
    margin:"6px 0",
    borderRadius:"8px",
    border:"1px solid #ccc"
  },
  btn:{
    width:"100%",
    padding:"10px",
    marginTop:"8px",
    background:"#e9ff6a96",
    color:"#101516ad",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer"
  },
  back:{
    marginTop:"10px",
    background:"gray",
    fontWeight:"bold",
    color:"#110f0f",
    padding:"8px",
    border:"none",
    borderRadius:"6px"
  },
overviewContainer: {
  background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
  padding: "20px",
  borderRadius: "15px"
},
heading: {
  textAlign: "center",
  marginBottom: "20px",
  color: "#333"
},
searchCard: {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  marginBottom: "20px"
},
searchInput: {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "10px",
  outline: "none",
  fontSize: "14px"
},
resultCard: {
  marginTop: "15px",
  padding: "12px",
  background: "#f9f9f9",
  borderRadius: "8px",
  borderLeft: "5px solid #4caf50"
},

chartRow: {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "20px"
},
chartCard: {
  flex: "1",
  minWidth: "250px",
  background: "#ffffff",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  textAlign: "center"
},
statsRow: {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap"
},
statBox: {
  flex: "1",
  background: "#ffffff",
  padding: "15px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  fontSize: "18px",
  fontWeight: "bold"
},
winnerCard: {
  background: "linear-gradient(135deg, #43cea2, #185a9d)",
  color: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  marginBottom: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
},
winnerText: {
  fontSize: "22px",
  fontWeight: "bold",
  marginTop: "10px"
},
percentCard: {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  marginTop: "20px"
},
percentRow: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  margin: "10px 0"
},
progressBar: {
  flex: 1,
  height: "10px",
  background: "#eee",
  borderRadius: "10px",
  overflow: "hidden"
},
progressFill: {
  height: "100%",
  background: "linear-gradient(90deg, #00c6ff, #0072ff)",
  borderRadius: "10px",
  transition: "0.5s"
}
};

export default App;