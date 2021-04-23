import { AttributeMap } from "./ConnectAttributeMap";
import { ContactData } from "./ConnectContactData";

export interface ConnectEvent {
  Details: {
    ContactData: ContactData;
    Parameters: AttributeMap;
  };
  Name: string;
}
