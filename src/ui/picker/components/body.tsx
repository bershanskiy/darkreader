import {m} from 'malevic';
import type {PickerActions, PickerData} from '../../../definitions';

export default function Body({data, actions}: {data: PickerData; actions: PickerActions}) {
    return (
        <body>
            <header>
                <img id="logo" src="../assets/images/darkreader-type.svg" alt="Dark Reader" />
                <h1 id="title">Dark Reader Picker</h1>
            </header>
        </body>
    );
}
