import {render} from 'solid-js/web';
import 'uno.css';
import App from './App';
// reset.css by Eric Meyer https://meyerweb.com/eric/tools/css/reset/index.html
import '@unocss/reset/eric-meyer.css'
import './style.css';

render(() => <App />, document.getElementById('root') as HTMLElement)
