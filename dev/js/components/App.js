import React from 'react';
import UserList from '../containers/user-list';
import UserDetails from '../containers/user-detail';
import Board from '../containers/Board';
import AllowDuplicates from '../containers/checkbox';
require('../../scss/style.scss');

const App = () => (
    <div>
          
          {/*     <h2>User List</h2> -->
            <UserList />
            <hr />
            <h2>User Details</h2>
            <UserDetails />
            */}
        
        <AllowDuplicates/>
        <Board/>
    </div>
);

export default App;
