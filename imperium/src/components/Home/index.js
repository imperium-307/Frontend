import React from 'react';

const styles = {
  fontFamily: "arial",
  textAlign: "center",
  marginTop: "40px",
  color: "#421CE8"
};

const Home = () => (
  <div style={styles}>
  <style>{'body { background-color: #DBDAE1; }'}</style>
    <h1>Home</h1>
    <br/>
    <h2>TODO create card</h2>
    <br/>
    <button type="submit">
    Like
    </button>
    <button type="submit">
    Favorite
    </button>
    <button type="submit">
      Dislike
    </button>
  </div>
);

export default Home;
