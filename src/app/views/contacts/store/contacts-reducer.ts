import { Contact } from '@app/core/models';
import {EntityState, createEntityAdapter} from '@ngrx/entity';

import {
  ContactsActionTypes,
  All as AllContactsActions
} from './contacts-actions';

// This adapter will allow is to manipulate contacts (mostly CRUD operations)
export const contactsAdapter = createEntityAdapter<Contact>({
  selectId: (contact: Contact) => contact.id,
  sortComparer: false
});

// -----------------------------------------
// The shape of EntityState
// ------------------------------------------
// interface EntityState<Contact> {
//   ids: string[] | number[];
//   entities: { [id: string]: Contact };
// }
// -----------------------------------------
// -> ids arrays allow us to sort data easily
// -> entities map allows us to access the data quickly without iterating/filtering though an array of objects

export interface State extends EntityState<Contact> {
  currentContactId?: number;
}

export const INIT_STATE: State = contactsAdapter.getInitialState({
  currentContactId: undefined
});



export function reducer(
  state: State = INIT_STATE,
  {type, payload}: AllContactsActions
) {

  switch (type) {

    case ContactsActionTypes.SET_CURRENT_CONTACT_ID : {
      return {
        ...state,
        currentContactId: payload
      };
    }

    case ContactsActionTypes.LOAD_ALL_SUCCESS : {
      return contactsAdapter.addAll(payload, state);
    }


    case ContactsActionTypes.LOAD_SUCCESS : {
      return contactsAdapter.addOne(payload, {
        ...state,
        currentContactId: payload.id
      });
    }

    case ContactsActionTypes.CREATE_SUCCESS : {
      return contactsAdapter.addOne(payload, {
        ...state
      });
    }

    case ContactsActionTypes.PATCH_SUCCESS : {
      return contactsAdapter.updateOne(payload, state);
    }

    case ContactsActionTypes.DELETE_SUCCESS : {
      return contactsAdapter.removeOne(payload, state);
    }

    default: return state;

  }
}

export const getCurrentContactId = (state: State) => state.currentContactId;
