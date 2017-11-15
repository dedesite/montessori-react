import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Dictation from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Dictation />, document.getElementById('root'));
registerServiceWorker();
