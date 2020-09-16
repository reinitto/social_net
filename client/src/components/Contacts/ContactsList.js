import React, { Fragment } from "react";
import { ContactsItem } from "./ContactsItem";
import { useUser } from "../../context/user";
export function ContactsList() {
  const { friends } = useUser();
  return (
    <Fragment>
      {friends.map((friend) => (
        <ContactsItem key={friend._id} contact={friend.recipient} />
      ))}
    </Fragment>
  );
}

export default ContactsList;
