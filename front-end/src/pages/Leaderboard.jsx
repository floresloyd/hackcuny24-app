import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Fireserver from '../Fireserver';
import './Leaderboard.css';
import imag1 from "../Public/Photos/Central-Park.png"
import bronze from "../Public/Photos/bronze.png"
import silver from "../Public/Photos/silver.png"
import gold from "../Public/Photos/gold.png"

const { userDataDatabase } = Fireserver;

function Leaderboard() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersQuery = query(collection(userDataDatabase, 'userDataDatabase'), orderBy('communitypoints', 'desc'), limit(10));
        const querySnapshot = await getDocs(usersQuery);
  
        if (querySnapshot.empty) {
          console.log('No matching documents.');
          return;
        }
  
        let users = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            name: `${data.firstname} ${data.lastinitial}.`,
            score: data.communitypoints // Assuming this is a string, it will be converted to number for sorting
          };
        });
  
        // Sort the users by score in descending order
        users.sort((a, b) => Number(b.score) - Number(a.score));
  
        setTopUsers(users);
        console.log(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchTopUsers();
  }, []);
  
  return (
    <div className="container">
      <div className="image-container">
        <img className="image" src={imag1} alt="Central Park" />
      </div>
      <div className="leaderboard-container">
        <div className="table-container">
          <h1>Leaderboard</h1>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, index) => {
                let medal;
                if (index === 0) {
                  medal = <img src={gold} alt="Gold Medal" className="medal gold" />;
                } else if (index === 1) {
                  medal = <img src={silver} alt="Silver Medal" className="medal silver" />;
                } else if (index === 2) {
                  medal = <img src={bronze} alt="Bronze Medal" className="medal bronze" />;
                }
  
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {medal}
                      {user.name}
                    </td>
                    <td>{user.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="footer-note">
    <p>
        Understanding Community Points: Our points system rewards active community engagement. <br/>
        <strong>Organizers receive 2 points for every event they host</strong>, acknowledging their effort in bringing people together. <br/>
        <strong>Attendees earn 1 point for each event they participate in</strong>, encouraging involvement within the community. <br/>
        This system is designed to celebrate and promote active participation, fostering a vibrant and interactive community. <br/>
    </p>
    </div>

      </div>
    </div>
  );
}

export default Leaderboard;
