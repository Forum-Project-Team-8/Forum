// AppContext.js
import React, { useState } from 'react';

export const AppContext = React.createContext();

import PropTypes from 'prop-types';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
};