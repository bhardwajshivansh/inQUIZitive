import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../Actions/User";
import "./AllUsers.css";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { loading, users, error } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (userId) => {
    setSelectedUser(userId === selectedUser ? null : userId);
  };

  const getBadge = (score) => {
    if (score >= 90) return "Gold";
    if (score >= 75) return "Silver";
    return "Bronze";
  };

  const handleShare = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      let shareText = `Quiz Results for ${user.name}:\n\n`;
      user.quizzes.forEach((quiz) => {
        shareText += `Quiz Title: ${quiz.quizId.title}\n`;
        shareText += `Score: ${quiz.score}\n`;
        shareText += `Start Time: ${quiz.startTime}\n`;
        shareText += `End Time: ${quiz.endTime}\n`;
        shareText += `Time Taken: ${quiz.timeTaken}\n\n`;
      });

      if (navigator.share) {
        navigator
          .share({
            title: `Quiz Results for ${user.name}`,
            text: shareText,
          })
          .then(() => console.log("Shared successfully!"))
          .catch((error) => console.error("Error sharing", error));
      } else {
        alert("Sharing is not supported in your browser.");
      }
    }
  };

  return (
    <div className="all-users-container">
      <h2 style={{ textAlign: "center" }}>USER LIST</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <ul className="user-list">
          {users &&
            users.map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className={`user-item ${selectedUser === user._id ? "selected" : ""}`}
                id={`user-${user._id}`} 
              >
                <p className="user-name">Name: {user.name}</p>
                <p className="user-email">Email: {user.email}</p>
                {user.isAdmin ? (
                  <p className="admin-status">Admin user</p>
                ) : (
                  selectedUser === user._id && (
                    <div className="user-details">
                      <p className="quiz-heading">Quizzes:</p>
                      <ul className="quiz-list">
                        {user.quizzes &&
                          user.quizzes.map((quiz) => (
                            <li key={quiz._id} className="quiz-item">
                              <p className="quiz-title">Quiz Title: {quiz.quizId.title}</p>
                              <p className="quiz-score">Score: {quiz.score}</p>
                              <p className="quiz-start-time">Start Time: {quiz.startTime}</p>
                              <p className="quiz-end-time">End Time: {quiz.endTime}</p>
                              <p className="quiz-time-taken">Time Taken: {quiz.timeTaken}</p>

                              <p className="quiz-badge">
                                Badge: <span className={`badge ${getBadge(quiz.score).toLowerCase()}`}>{getBadge(quiz.score)}</span>
                              </p>
                            </li>
                          ))}
                      </ul>
                      <button className="share-button" onClick={() => handleShare(user._id)}>
                        Share Quiz Results
                      </button>
                    </div>
                  )
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default AllUsers;
