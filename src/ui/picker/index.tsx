import {m} from 'malevic';
import {sync} from 'malevic/dom';
import Body from './components/body';
import type {PickerActions, PickerData} from '../../definitions';

function renderBody(data: PickerData, actions: PickerActions) {
    sync(document.body, <Body data={data} actions={actions} />);
}

async function start() {
    const token = document.location.search.replace('?t=', '');
    console.log(token);
    window.addEventListener('unload', () => console.log('invalidate token'));

    //const data = await connector.getData();
    renderBody(null, null);
    // connector.subscribeToChanges((data) => renderBody(data, connector));
}

start();
