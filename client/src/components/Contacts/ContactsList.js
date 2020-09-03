import React, { Fragment } from "react";
import { ContactsItem } from "./ContactsItem";
export function ContactsList({ contacts, addChat }) {
  if (contacts && contacts.length > 0) {
    return (
      <Fragment>
        {contacts.map((contact) => (
          <ContactsItem key={contact._id} contact={contact} />
        ))}
      </Fragment>
    );
  }
}

export default ContactsList;
